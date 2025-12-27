import { smartAdapter } from './adapters';
import type { HttpClientOptions, HttpRequestConfig, IApiResponse, RequestInterceptor, ResponseInterceptor } from './types';
import { toast } from '../../componentes/toast';

export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Headers;
  private adapter: any;
  private defaultRetries: number;
  private defaultRetryDelay: number;
  private defaultRetryBackoff = true;

  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(options: HttpClientOptions = {}) {
    this.baseURL = options.baseURL || '';

    this.defaultHeaders = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    });

    this.adapter = options.defaultAdapter || smartAdapter;
    this.defaultRetries = options.defaultRetries || 0;
    this.defaultRetryDelay = options.defaultRetryDelay || 1000;
  }

  useRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isRetryable(error: any, response?: Response): boolean {
    if (error && error.name !== 'AbortError') {
      return true;
    }
    if (response) {
      return response.status >= 500 || response.status === 429;
    }
    return false;
  }

  async request<T>(endpoint: string, config: Partial<HttpRequestConfig> = {}): Promise<IApiResponse<T>> {
    const isAbsolute = endpoint.startsWith('http');
    let url = isAbsolute ? endpoint : `${this.baseURL}${endpoint}`;

    if (config.params) {
      const query = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
      const separator = url.includes('?') ? '&' : '?';
      if (Array.from(query).length > 0) {
        url = `${url}${separator}${query.toString()}`;
      }
    }

    let finalConfig: HttpRequestConfig = {
      retries: this.defaultRetries,
      retryDelay: this.defaultRetryDelay,
      retryBackoff: this.defaultRetryBackoff,
      adapter: this.adapter,
      ...config,
      url: url,
      headers: new Headers(config.headers || this.defaultHeaders),
      method: config.method || 'GET',
    };

    if (config.body instanceof FormData) {
      (finalConfig.headers as Headers).delete('Content-Type');
    }

    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    let apiResponse: IApiResponse<T> = {
      data: null,
      error: { code: 'INIT', message: '' },
      isSuccess: false,
      status: 0,
      headers: new Headers(),
      notifications: [],
    };

    let attempt = 0;
    const totalAttempts = (finalConfig.retries || 0) + 1;

    for (attempt = 1; attempt <= totalAttempts; attempt++) {
      try {
        const fetchResponse = await fetch(url, finalConfig);

        if (attempt < totalAttempts && this.isRetryable(null, fetchResponse)) {
          const delay = (finalConfig.retryDelay || 1000) * (finalConfig.retryBackoff ? Math.pow(2, attempt - 1) : 1);
          await this.sleep(delay);
          continue;
        }

        let body: any = null;
        const contentType = fetchResponse.headers.get('content-type');
        if (fetchResponse.status !== 204) {
          if (contentType && contentType.includes('application/json')) {
            body = await fetchResponse.json().catch(() => null);
          } else {
            body = await fetchResponse.text();
          }
        }

        if (finalConfig.adapter) {
          apiResponse = finalConfig.adapter<T>(fetchResponse, body);
        }

        break;
      } catch (error) {
        const isAbort = error instanceof Error && error.name === 'AbortError';

        if (!isAbort && attempt < totalAttempts && this.isRetryable(error)) {
          const delay = (finalConfig.retryDelay || 1000) * (finalConfig.retryBackoff ? Math.pow(2, attempt - 1) : 1);
          await this.sleep(delay);
          continue;
        }

        apiResponse = {
          data: null,
          error: {
            code: isAbort ? 'REQUEST_ABORTED' : 'NETWORK_ERROR',
            message: isAbort ? 'Cancelado.' : error instanceof Error ? error.message : 'Falha de conexão.',
          },
          isSuccess: false,
          status: 0,
          headers: new Headers(),
          notifications: [],
        };
        break;
      }
    }

    for (const interceptor of this.responseInterceptors) {
      apiResponse = await interceptor(apiResponse);
    }

    if (!apiResponse.isSuccess && finalConfig.notifyOnError && apiResponse.error?.code !== 'REQUEST_ABORTED') {
      toast.error(apiResponse.error?.message || 'Ocorreu um erro');
    }

    if (finalConfig.notifyOnError && apiResponse.notifications.length > 0) {
      apiResponse.notifications.map((notification) => toast[notification.type](notification.message));
    }

    return apiResponse;
  }

  get<T>(url: string, config?: Omit<HttpRequestConfig, 'method'>) {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  post<T>(url: string, body: any, config?: Omit<HttpRequestConfig, 'method' | 'body'>) {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(url: string, body: any, config?: Omit<HttpRequestConfig, 'method' | 'body'>) {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(url: string, config?: Omit<HttpRequestConfig, 'method'>) {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }
}
