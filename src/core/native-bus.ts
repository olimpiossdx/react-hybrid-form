/**
 * Graph Bus: Um sistema de Pub/Sub baseado em EventTarget nativo.
 * Permite comunicação N:N entre componentes sem acoplamento de árvore React.
 */
class NativeBus extends EventTarget {
  /**
   * Envia um sinal para o grafo.
   */
  emit<T>(eventName: string, payload: T) {
    // CustomEvent é uma API nativa do navegador que transporta dados
    const event = new CustomEvent(eventName, { detail: payload });
    this.dispatchEvent(event);
  }

  /**
   * Escuta um sinal do grafo.
   * Retorna uma função de limpeza (unsubscribe) automática.
   */
  on<T>(eventName: string, callback: (payload: T) => void) {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<T>;
      callback(customEvent.detail);
    };

    this.addEventListener(eventName, handler);

    // Retorna cleanup para usar no useEffect do React
    return () => this.removeEventListener(eventName, handler);
  }
}

// Singleton Global (Apenas uma instância para toda a app)
export const graph = new NativeBus();
