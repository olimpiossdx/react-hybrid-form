import { useState, useMemo, useEffect, useRef, useCallback } from "react";

interface VirtualizerProps {
  count: number;
  estimateSize: (index: number) => number;
  overscan?: number;
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

  // Cache de medidas reais (índice -> altura em px)
  const measurements = useRef<Record<number, number>>({});

  // Cache de offsets calculados (índice -> posição Y acumulada)
  // Usamos useRef para evitar re-calculo em cada render se não necessário
  const offsetsCache = useRef<number[]>([]);

  // Último índice que calculamos com precisão
  const lastMeasuredIndex = useRef(-1);

  const [measurementVersion, setMeasurementVersion] = useState(0);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  // --- 1. SETUP DE EVENTOS ---
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const containerRo = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      if (height > 0) setContainerHeight(height);
    });
    containerRo.observe(element);

    resizeObserver.current = new ResizeObserver((entries) => {
      let hasChanges = false;
      entries.forEach((entry) => {
        if (entry.target instanceof HTMLElement) {
          const index = Number(entry.target.getAttribute("data-index"));
          const height =
            entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;

          if (
            height > 0 &&
            !isNaN(index) &&
            measurements.current[index] !== height
          ) {
            measurements.current[index] = height;

            // Se uma medida mudou, invalidamos o cache dali para frente
            if (index < lastMeasuredIndex.current) {
              lastMeasuredIndex.current = index - 1;
            }
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        requestAnimationFrame(() => setMeasurementVersion((v) => v + 1));
      }
    });

    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    setContainerHeight(element.clientHeight);

    return () => {
      containerRo.disconnect();
      resizeObserver.current?.disconnect();
      element.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef]);

  // --- 2. CÁLCULO PREGUIÇOSO (LAZY CALCULATION) ---

  // Esta função calcula offsets apenas até o índice solicitado.
  // Se pedir o índice 100, ela calcula do último conhecido até o 100.
  // Otimização O(1) para leituras repetidas.
  const getOffset = (index: number) => {
    // Garante limites
    if (index >= count) return 0; // Fallback

    // Se já calculamos, retorna do cache
    if (index <= lastMeasuredIndex.current) {
      return offsetsCache.current[index];
    }

    // Se não, calcula a partir do último conhecido
    let currentOffset = 0;
    let i = 0;

    if (lastMeasuredIndex.current >= 0) {
      i = lastMeasuredIndex.current;
      currentOffset = offsetsCache.current[i];
    }

    while (i < index) {
      const size = measurements.current[i] || estimateSize(i);
      offsetsCache.current[i] = currentOffset;
      currentOffset += size;
      i++;
    }

    // Salva o estado atual
    lastMeasuredIndex.current = index;
    offsetsCache.current[index] = currentOffset;

    return currentOffset;
  };

  // Altura Total Estimada (Híbrida)
  // Altura conhecida até o último medido + Estimativa do restante
  const totalHeight = useMemo(() => {
    // Garante que temos pelo menos o topo calculado
    const safeLastIndex = Math.max(0, lastMeasuredIndex.current);
    const measuredOffset = getOffset(safeLastIndex);

    // Quantos faltam?
    const remainingCount = count - safeLastIndex;
    const estimatedRemainingHeight = remainingCount * estimateSize(0);

    return measuredOffset + estimatedRemainingHeight;
  }, [count, estimateSize, measurementVersion]);

  // --- 3. JANELA VISÍVEL (BUSCA BINÁRIA + ESTIMATIVA) ---

  const findStartIndex = () => {
    let low = 0;
    let high = count - 1;

    // Busca Binária
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const offset = getOffset(mid); // Calcula sob demanda se precisar!

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

  // Avança até cobrir a altura da tela
  // Como getOffset é lazy, isso vai calculando apenas o necessário para preencher a tela
  while (
    endIndexRaw < count &&
    getOffset(endIndexRaw) < scrollTop + effectiveHeight
  ) {
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
        start: getOffset(i),
        size: size,
        props: {
          style: {
            position: "absolute" as const,
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${getOffset(i)}px)`,
          },
          "data-index": i,
        },
      });
    }
    return items;
  }, [startIndex, endIndex, estimateSize, measurementVersion]);

  // --- API ---

  const measureElement = useCallback((node: HTMLElement | null) => {
    if (node) resizeObserver.current?.observe(node);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollRef.current) {
      // Calcula o offset exato antes de rolar
      const offset = getOffset(index);
      scrollRef.current.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []); // Dependências estáveis

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
