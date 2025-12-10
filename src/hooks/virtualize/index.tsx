import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

interface VirtualizerProps {
  count: number;
  estimateSize: (index: number) => number;
  overscan?: number;
  horizontal?: boolean; // Preparado para futuro, por enquanto assume vertical
}

export const useVirtualizer = ({ 
  count, 
  estimateSize, 
  overscan = 5
}: VirtualizerProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const scrollElementRef = useRef<HTMLElement | null>(null);
  const isScrolling = useRef(false);

  // --- CALLBACK REF (Gerenciamento de Ciclo de Vida do DOM) ---
  // Substitui a necessidade de passar ref de fora ou usar useState no pai
  const registerContainer = useCallback((node: HTMLElement | null) => {
    // Limpeza do anterior
    if (scrollElementRef.current) {
       // Se tivermos listeners manuais para limpar, faríamos aqui.
       // Como usamos ResizeObserver, desconectamos abaixo.
    }
    
    scrollElementRef.current = node;

    if (node) {
        // Inicializa medições assim que monta
        setContainerHeight(node.clientHeight);
        
        // Configura Observer de Resize
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.contentRect.height > 0) {
                    setContainerHeight(entry.contentRect.height);
                }
            }
        });
        ro.observe(node);

        // Configura Listener de Scroll
        const onScroll = () => {
            if (!isScrolling.current) {
                isScrolling.current = true;
                requestAnimationFrame(() => {
                    if (scrollElementRef.current) {
                        setScrollTop(scrollElementRef.current.scrollTop);
                    }
                    isScrolling.current = false;
                });
            }
        };
        node.addEventListener('scroll', onScroll, { passive: true });

        // Cleanup function anexada ao nó (truque para limpar listeners ao desmontar)
        (node as any).__cleanup = () => {
            ro.disconnect();
            node.removeEventListener('scroll', onScroll);
        };
    } else {
        // Se node é null, verifica se tinha cleanup
        // (Nota: Em React moderno o ref callback null é chamado antes de desmontar)
    }
  }, []);

  // Cleanup effect
  useEffect(() => {
      return () => {
          if (scrollElementRef.current && (scrollElementRef.current as any).__cleanup) {
              (scrollElementRef.current as any).__cleanup();
          }
      };
  }, []);


  // --- CÁLCULOS ---
  const totalHeight = count * estimateSize(0);
  const effectiveHeight = containerHeight || 500; 
  const visibleCount = Math.ceil(effectiveHeight / estimateSize(0));
  const startIndexRaw = Math.floor(scrollTop / estimateSize(0));
  
  const startIndex = Math.max(0, startIndexRaw - overscan);
  const endIndex = Math.min(count - 1, startIndexRaw + visibleCount + overscan);

  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const size = estimateSize(i);
      const start = i * size;
      
      items.push({
        index: i,
        // Props prontas para espalhar na div do item
        props: {
            style: {
                position: 'absolute' as const,
                top: 0,
                left: 0,
                width: '100%',
                height: `${size}px`,
                transform: `translateY(${start}px)`
            }
        }
      });
    }
    return items;
  }, [startIndex, endIndex, estimateSize]);

  // --- API DE RETORNO (DX FOCUSED) ---

  const scrollToIndex = useCallback((index: number) => {
      if (scrollElementRef.current) {
          const offset = index * estimateSize(0);
          scrollElementRef.current.scrollTo({ top: offset, behavior: 'smooth' });
      }
  }, [estimateSize]);

  return { 
      virtualItems,
      scrollToIndex,
      // Props para o elemento pai (quem tem scroll)
      containerProps: {
          ref: registerContainer,
          style: { overflowY: 'auto' as const, height: '100%', width: '100%' }
      },
      // Props para o elemento wrapper interno (fantasma)
      wrapperProps: {
          style: { height: `${totalHeight}px`, position: 'relative' as const, width: '100%' }
      }
  };
};