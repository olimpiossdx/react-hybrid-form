import { useState, useMemo, useEffect, useRef, useCallback } from "react";

interface VirtualizerProps {
  count: number;
  estimateSize: (index: number) => number;
  overscan?: number;
  // Aceita qualquer tipo de Ref para flexibilidade (div, ul, tbody)
  scrollRef: React.RefObject<any>;
}

export const useVirtualizer = ({
  count,
  estimateSize,
  scrollRef,
  overscan = 5,
}: VirtualizerProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Cache de medidas: { índice: altura }
  const measurements = useRef<Record<number, number>>({});

  // Versionamento para forçar atualização apenas quando necessário
  const [measurementVersion, setMeasurementVersion] = useState(0);

  const resizeObserver = useRef<ResizeObserver | null>(null);

  // --- 1. SETUP DE EVENTOS ---
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // A. Observer do Container (Altura da Janela)
    const containerRo = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      if (height > 0) setContainerHeight(height);
    });
    containerRo.observe(element);

    // B. Observer dos Itens (Altura das Linhas)
    resizeObserver.current = new ResizeObserver((entries) => {
      let hasChanges = false;
      entries.forEach((entry) => {
        if (entry.target instanceof HTMLElement) {
          const index = Number(entry.target.getAttribute("data-index"));
          // Tenta pegar a altura com bordas (borderBox), fallback para contentRect
          const height =
            entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;

          // CORREÇÃO CRÍTICA: Ignorar altura 0.
          // Isso evita que itens sejam calculados como "invisíveis", o que faria o scroll
          // pular centenas de itens de uma vez.
          if (
            height > 0 &&
            !isNaN(index) &&
            measurements.current[index] !== height
          ) {
            measurements.current[index] = height;
            hasChanges = true;
          }
        }
      });

      // Só dispara re-render se houve mudança real de tamanho e válida
      if (hasChanges) {
        // Otimização: Batch update no próximo frame para evitar gargalo
        requestAnimationFrame(() => {
          setMeasurementVersion((v) => v + 1);
        });
      }
    });

    // C. Scroll Handler (Nativo e Rápido)
    const handleScroll = () => {
      // Atualiza o estado do scroll diretamente
      setScrollTop(element.scrollTop);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });

    // Leitura inicial
    setContainerHeight(element.clientHeight);

    return () => {
      containerRo.disconnect();
      resizeObserver.current?.disconnect();
      element.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef]);

  // --- 2. CÁLCULO INTELIGENTE ---

  const { totalHeight, offsets } = useMemo(() => {
    const offsets: number[] = [];
    let currentOffset = 0;

    for (let i = 0; i < count; i++) {
      offsets[i] = currentOffset;
      // Usa medida real se existir e for válida, senão usa estimativa
      const size = measurements.current[i] || estimateSize(i);
      currentOffset += size;
    }

    return { totalHeight: currentOffset, offsets };
  }, [count, estimateSize, measurementVersion]);

  // --- 3. JANELA VISÍVEL (BUSCA BINÁRIA) ---

  const findStartIndex = () => {
    let low = 0;
    let high = count - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const offset = offsets[mid];

      if (offset < scrollTop) {
        low = mid + 1;
      } else if (offset > scrollTop) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
    return Math.max(0, low - 1);
  };

  const startIndexRaw = findStartIndex();
  const effectiveHeight = containerHeight || 500;

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
      const size = measurements.current[i] || estimateSize(i);
      items.push({
        index: i,
        start: offsets[i],
        size: size,
        props: {
          style: {
            position: "absolute" as const,
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${offsets[i]}px)`,
          },
          "data-index": i,
        },
      });
    }
    return items;
  }, [startIndex, endIndex, offsets, estimateSize, measurementVersion]);

  // --- API ---

  const measureElement = useCallback((node: HTMLElement | null) => {
    if (node) {
      resizeObserver.current?.observe(node);
    }
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (scrollRef.current) {
        const offset = offsets[index] ?? 0;
        scrollRef.current.scrollTo({ top: offset, behavior: "smooth" });
      }
    },
    [offsets]
  );

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
    measureElement,
    containerProps: {
      style: {
        overflowY: "auto" as const,
        height: "100%",
        width: "100%",
        position: "relative" as const,
        contain: "strict",
      },
    },
    wrapperProps: {
      style: {
        height: `${totalHeight}px`,
        position: "relative" as const,
        width: "100%",
      },
    },
    containerHeight,
  };
};
