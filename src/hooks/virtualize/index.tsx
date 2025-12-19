import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

interface VirtualizerProps {
  count: number;
  estimateSize: (index: number) => number;
  overscan?: number;
  // Opcional: Se o usuário quiser passar uma ref externa.
  // Se não passar, o hook cria uma interna.
  scrollRef?: React.RefObject<HTMLElement>;
}

export const useVirtualizer = ({
  count,
  estimateSize,
  scrollRef: externalScrollRef,
  overscan = 5
}: VirtualizerProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Ref interna (fallback se não houver externa)
  const internalRef = useRef<HTMLElement | null>(null);

  // Cache de medidas
  const measurements = useRef<Record<number, number>>({});
  const [measurementVersion, setMeasurementVersion] = useState(0);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  // --- CALLBACK REF (Gerencia conexão) ---
  const registerContainer = useCallback((node: HTMLElement | null) => {
    const ref = externalScrollRef || internalRef;

    // Se o nó já é o atual, não faz nada
    if (ref.current === node) return;

    // Atualiza a ref
    if (externalScrollRef) {
      (externalScrollRef as any).current = node;
    } else {
      internalRef.current = node;
    }

    if (node) {
      // 1. Medição Inicial
      setContainerHeight(node.clientHeight);

      // 2. Observer do Container
      const containerRo = new ResizeObserver(entries => {
        const height = entries[0].contentRect.height;
        if (height > 0) setContainerHeight(height);
      });
      containerRo.observe(node);

      // 3. Listener de Scroll
      const onScroll = () => {
        // Atualização direta para performance
        setScrollTop(node.scrollTop);
      };

      node.addEventListener('scroll', onScroll, { passive: true });

      // Cleanup anexado ao nó
      (node as any).__cleanup = () => {
        containerRo.disconnect();
        node.removeEventListener('scroll', onScroll);
      };
    }
  }, [externalScrollRef]);

  // Cleanup Global
  useEffect(() => {
    return () => {
      const ref = externalScrollRef || internalRef;
      if (ref.current && (ref.current as any).__cleanup) {
        (ref.current as any).__cleanup();
      }
      resizeObserver.current?.disconnect();
    };
  }, [externalScrollRef]);

  // --- OBSERVER DE ITENS ---
  useEffect(() => {
    if (!resizeObserver.current) {
      resizeObserver.current = new ResizeObserver(entries => {
        let hasChanges = false;
        entries.forEach(entry => {
          if (entry.target instanceof HTMLElement) {
            const index = Number(entry.target.getAttribute('data-index'));
            const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;

            if (height > 0 && !isNaN(index) && measurements.current[index] !== height) {
              measurements.current[index] = height;
              hasChanges = true;
            }
          }
        });
        if (hasChanges) {
          requestAnimationFrame(() => setMeasurementVersion(v => v + 1));
        }
      });
    }
  }, []);

  // --- CÁLCULOS ---

  const { totalHeight, offsets } = useMemo(() => {
    const offsets: number[] = [];
    let currentOffset = 0;
    for (let i = 0; i < count; i++) {
      offsets[i] = currentOffset;
      const size = measurements.current[i] || estimateSize(i);
      currentOffset += size;
    }
    return { totalHeight: currentOffset, offsets };
  }, [count, estimateSize, measurementVersion]);

  // Busca Binária para Start Index
  const findStartIndex = () => {
    let low = 0;
    let high = count - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const offset = offsets[mid];
      if (offset < scrollTop) low = mid + 1;
      else if (offset > scrollTop) high = mid - 1;
      else return mid;
    }
    return Math.max(0, low - 1);
  };

  const effectiveHeight = containerHeight || 500;
  const startIndexRaw = findStartIndex();

  let endIndexRaw = startIndexRaw;
  let currentBottom = offsets[startIndexRaw];
  while (endIndexRaw < count && currentBottom < scrollTop + effectiveHeight) {
    const size = measurements.current[endIndexRaw] || estimateSize(endIndexRaw);
    currentBottom += size;
    endIndexRaw++;
  }

  const startIndex = Math.max(0, startIndexRaw - overscan);
  const endIndex = Math.min(count - 1, endIndexRaw + overscan);

  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        start: offsets[i],
        size: measurements.current[i] || estimateSize(i),
        props: {
          style: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${offsets[i]}px)`
          },
          'data-index': i
        }
      });
    }
    return items;
  }, [startIndex, endIndex, offsets, estimateSize, measurementVersion]);

  // --- API ---

  const measureElement = useCallback((node: HTMLElement | null) => {
    if (node) resizeObserver.current?.observe(node);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const ref = externalScrollRef || internalRef;
    if (ref.current) {
      const offset = offsets[index] ?? 0;
      ref.current.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [offsets, externalScrollRef]);

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
    measureElement,
    containerProps: {
      ref: registerContainer,
      style: {
        overflowY: 'auto' as const,
        height: '100%',
        width: '100%',
        position: 'relative' as const,
        contain: 'strict'
      }
    },
    wrapperProps: {
      style: { height: `${totalHeight}px`, position: 'relative' as const, width: '100%' }
    },
    containerHeight
  };
};