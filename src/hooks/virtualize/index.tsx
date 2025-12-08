import { useState, useMemo, useEffect, useRef } from 'react';

interface VirtualizerProps {
  count: number;
  scrollRef: React.RefObject<HTMLElement>; // MUDANÇA: Recebe Ref diretamente
  estimateSize: (index: number) => number;
  overscan?: number;
}

export const useVirtualizer = ({
  count,
  scrollRef,
  estimateSize,
  overscan = 5
}: VirtualizerProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // 1. Resize Observer (Detecta altura do container)
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setContainerHeight(entry.contentRect.height);
        }
      }
    });

    // 2. Scroll Listener
    const handleScroll = () => {
      if (!isScrolling.current) {
        isScrolling.current = true;
        requestAnimationFrame(() => {
          setScrollTop(element.scrollTop);
          isScrolling.current = false;
        });
      }
    };

    resizeObserver.observe(element);
    element.addEventListener('scroll', handleScroll, { passive: true });

    // Força leitura inicial
    setContainerHeight(element.clientHeight);

    return () => {
      resizeObserver.disconnect();
      element.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRef]); // Dependência estável (Ref não muda)

  // Cálculos
  const totalHeight = count * estimateSize(0);

  // Proteção: Se containerHeight for 0 (não montou), renderiza pelo menos alguns itens
  const effectiveHeight = containerHeight || 500;

  const visibleCount = Math.ceil(effectiveHeight / estimateSize(0));
  const startIndexRaw = Math.floor(scrollTop / estimateSize(0));

  const startIndex = Math.max(0, startIndexRaw - overscan);
  const endIndex = Math.min(
    count - 1,
    startIndexRaw + visibleCount + overscan
  );

  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        start: i * estimateSize(0),
        size: estimateSize(0)
      });
    }
    return items;
  }, [startIndex, endIndex, estimateSize]);

  return { virtualItems, totalHeight };
};