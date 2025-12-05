import type { IApiResponse, ResponseAdapter } from "./types";

/**
 * ADAPTER PADRÃO (Enterprise)
 * Espera envelope: { data, isSuccess, notifications }
 */
export const standardAdapter: ResponseAdapter = <T>(res: Response, body: any): IApiResponse<T> => {
  const payload = body || {};

  return {
    data: payload.data ?? null,
    error: payload.error || (!res.ok ? { 
        code: String(res.status), 
        message: payload.message || res.statusText || "Erro na requisição" 
    } : null),
    isSuccess: payload.isSuccess ?? res.ok,
    status: res.status,
    headers: res.headers,
    notifications: Array.isArray(payload.notifications) ? payload.notifications : []
  };
};

/**
 * ADAPTER CRU (External APIs)
 * O corpo inteiro é o dado.
 */
export const rawAdapter: ResponseAdapter = <T>(res: Response, body: any): IApiResponse<T> => {
  const isSuccess = res.ok;

  return {
    // Se for sucesso, o corpo é o data.
    data: isSuccess ? (body as T) : null,
    
    error: isSuccess ? null : {
        code: String(res.status),
        message: body?.message || body?.error || res.statusText || "Erro externo",
        details: body
    },
    
    isSuccess,
    status: res.status,
    headers: res.headers,
    notifications: []
  };
};

/**
 * ADAPTER INTELIGENTE (Auto-Detect)
 * Decide qual estratégia usar olhando para o formato do JSON.
 */
export const smartAdapter: ResponseAdapter = <T>(res: Response, body: any): IApiResponse<T> => {
    // 1. É Array? (ex: JSONPlaceholder) -> RAW
    if (Array.isArray(body)) {
        return rawAdapter(res, body);
    }

    // 2. Tem cara de Envelope? (ex: nossa API) -> STANDARD
    if (body && typeof body === 'object' && ('isSuccess' in body || 'notifications' in body)) {
        // Nota: Verifica chaves específicas do seu padrão para evitar falsos positivos
        // Se o seu padrão sempre tem 'data', pode checar 'data' também, mas cuidado com APIs externas que retornam { data: ... } sem ser envelope.
        // Melhor checar metadados de controle como 'isSuccess' ou 'notifications' ou 'meta'.
        // Se sua API sempre retorna { data: ... }, essa verificação pode ser ambígua,
        // mas geralmente APIs cruas retornam o objeto de negócio direto.
        
        // Refinamento: Se tiver isSuccess explicitamente, é nosso.
        if ('isSuccess' in body) {
             return standardAdapter(res, body);
        }
    }

    // 3. Fallback (Objeto desconhecido) -> RAW
    return rawAdapter(res, body);
};