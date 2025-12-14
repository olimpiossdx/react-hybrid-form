import React, { useState, useRef } from "react";
import {
  Network,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Ban,
  Clock,
  Database,
  Send,
  Trash,
  Edit3,
} from "lucide-react";
import  { toast } from "../../componentes/toast";
import  { api } from "../../service/api";

const ServiceExample: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [responseInfo, setResponseInfo] = useState<any>(null);
  const abortController = useRef<AbortController | null>(null);

  const displayResult = (
    res: any,
    title: string,
    method: string,
    payload?: any
  ) => {
    setResponseInfo({
      title,
      method,
      status: res.status,
      isSuccess: res.isSuccess,
      url: res.config?.url || "N/A",
      data: res.data,
      error: res.error,
      payloadSent: payload,
    });
    setLoading(null);
    abortController.current = null;
  };

  // --- HANDLERS (Mantidos da versão anterior) ---
  const handleGetList = async () => {
    setLoading("get-list");
    const res = await api.get("https://jsonplaceholder.typicode.com/users");
    if (res.isSuccess)
      toast.success(
        `Carregados ${Array.isArray(res.data) ? res.data.length : 0} usuários.`
      );
    displayResult(res, "Listar Usuários", "GET");
  };

  const handlePostCreate = async () => {
    setLoading("post-create");
    const payload = {
      name: "Novo Usuário Híbrido",
      job: "Dev Sênior",
      tech: ["React", "TypeScript"],
    };
    const res = await api.post(
      "https://jsonplaceholder.typicode.com/users",
      payload
    );
    if (res.isSuccess)
      toast.success("Usuário criado com ID: " + (res.data as any)?.id);
    displayResult(res, "Criar Registro", "POST", payload);
  };

  const handlePutUpdate = async () => {
    setLoading("put-update");
    const payload = { id: 1, name: "Usuário Atualizado", job: "Tech Lead" };
    const res = await api.put(
      "https://jsonplaceholder.typicode.com/users/1",
      payload
    );
    displayResult(res, "Atualizar Completo", "PUT", payload);
  };

  const handleDelete = async () => {
    setLoading("delete");
    const res = await api.delete(
      "https://jsonplaceholder.typicode.com/users/1"
    );
    if (res.isSuccess) toast.info("Registro excluído.");
    displayResult(res, "Remover Registro", "DELETE");
  };

  const handleForce404 = async () => {
    setLoading("404");
    const res = await api.get(
      "https://jsonplaceholder.typicode.com/users/99999",
      { notifyOnError: true }
    );
    displayResult(res, "Erro: Não Encontrado", "GET");
  };

  const handleForce500 = async () => {
    setLoading("500");
    const res = await api.get("https://httpstat.us/500", {
      notifyOnError: false,
    });
    if (!res.isSuccess)
      toast.warning("Erro de servidor detectado e tratado manualmente.");
    displayResult(res, "Erro: Servidor", "GET");
  };

  const handleRetryLogic = async () => {
    setLoading("retry");
    toast.info("Tentando conectar ao serviço instável (3x)...");
    const res = await api.get("https://httpstat.us/503", {
      retries: 2,
      retryDelay: 800,
      notifyOnError: true,
    });
    displayResult(res, "Retry Automático (503)", "GET");
  };

  const handleAbort = async () => {
    setLoading("abort");
    abortController.current = new AbortController();
    toast.info("Iniciando download lento... (cancele para testar)");
    const res = await api.get("https://httpstat.us/200?sleep=5000", {
      signal: abortController.current.signal,
    });
    if (res.error?.code === "REQUEST_ABORTED")
      toast.warning("Operação cancelada pelo utilizador.");
    else toast.success("Operação finalizada!");
    displayResult(res, "Cancelamento (Abort)", "GET");
  };

  const cancelRequest = () => {
    if (abortController.current) abortController.current.abort();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px] transition-colors">
      {/* COLUNA ESQUERDA: CONTROLES */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
            <Network className="w-6 h-6" /> HTTP Client Lab
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Teste de verbos, payloads, erros e resiliência.
          </p>
        </div>

        {/* BLOCO 1: CRUD */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700 pb-1">
            1. Operações CRUD (Estável)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <ApiButton
              label="GET List"
              method="GET"
              icon={<Database size={16} />}
              onClick={handleGetList}
              loading={loading === "get-list"}
              color="blue"
            />
            <ApiButton
              label="POST Create"
              method="POST"
              icon={<Send size={16} />}
              onClick={handlePostCreate}
              loading={loading === "post-create"}
              color="green"
            />
            <ApiButton
              label="PUT Update"
              method="PUT"
              icon={<Edit3 size={16} />}
              onClick={handlePutUpdate}
              loading={loading === "put-update"}
              color="orange"
            />
            <ApiButton
              label="DELETE"
              method="DEL"
              icon={<Trash size={16} />}
              onClick={handleDelete}
              loading={loading === "delete"}
              color="red"
            />
          </div>
        </div>

        {/* BLOCO 2: ERROS */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700 pb-1">
            2. Erros e Notificações
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <ApiButton
              label="Erro 404 (Toast Automático)"
              method="GET"
              icon={<AlertTriangle size={16} />}
              onClick={handleForce404}
              loading={loading === "404"}
              color="yellow"
            />
            <ApiButton
              label="Erro 500 (Tratamento Manual)"
              method="GET"
              icon={<XCircle size={16} />}
              onClick={handleForce500}
              loading={loading === "500"}
              color="red"
            />
          </div>
        </div>

        {/* BLOCO 3: RESILIÊNCIA */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700 pb-1">
            3. Resiliência de Rede
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <ApiButton
              label="Retry (503)"
              method="GET"
              icon={<RefreshCw size={16} />}
              onClick={handleRetryLogic}
              loading={loading === "retry"}
              color="purple"
              subtext="3 Tentativas"
            />
            <div className="flex items-center gap-2">
              <ApiButton
                label="Longo (5s)"
                method="GET"
                icon={<Clock size={16} />}
                onClick={handleAbort}
                loading={loading === "abort"}
                color="gray"
                className="flex-1"
              />
              <button
                onClick={cancelRequest}
                disabled={loading !== "abort"}
                className="p-3 rounded bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900 transition-colors h-full disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cancelar Requisição"
              >
                <Ban size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: VIEWER */}
      <div className="lg:col-span-7 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden h-[600px] shadow-inner">
        <div className="p-3 bg-gray-100 dark:bg-black/40 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
            Console de Resposta
          </span>
          {responseInfo && (
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono ${responseInfo.isSuccess ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"}`}
            >
              STATUS: {responseInfo.status || 0}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4 font-mono text-xs">
          {responseInfo ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-gray-400 dark:text-gray-500">
                  // Requisição
                </p>
                <div className="flex gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    {responseInfo.method}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {responseInfo.title}
                  </span>
                </div>
              </div>
              {responseInfo.payloadSent && (
                <div className="space-y-1">
                  <p className="text-gray-400 dark:text-gray-500">
                    // Payload Enviado
                  </p>
                  <pre className="text-blue-600 dark:text-blue-300">
                    {JSON.stringify(responseInfo.payloadSent, null, 2)}
                  </pre>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-gray-400 dark:text-gray-500">
                  // Resposta da API
                </p>
                {responseInfo.data ? (
                  <pre className="text-green-600 dark:text-green-300">
                    {JSON.stringify(responseInfo.data, null, 2)}
                  </pre>
                ) : (
                  <span className="text-gray-500 italic">null</span>
                )}
              </div>
              {responseInfo.error && (
                <div className="space-y-1">
                  <p className="text-gray-400 dark:text-gray-500">
                    // Detalhes do Erro
                  </p>
                  <pre className="text-red-600 dark:text-red-400 border-l-2 border-red-500 pl-2">
                    {JSON.stringify(responseInfo.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 opacity-50">
              <Network size={48} className="mb-4" />
              <p>Nenhuma requisição realizada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper de Botão Rico (Adaptado para Light/Dark)
const ApiButton = ({
  label,
  method,
  icon,
  onClick,
  loading,
  color,
  subtext,
  className = "",
}: any) => {
  const colors: any = {
    blue: "border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 hover:border-blue-500",
    green:
      "border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 hover:border-green-500",
    orange:
      "border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10 hover:border-orange-500",
    red: "border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:border-red-500",
    yellow:
      "border-yellow-200 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 hover:border-yellow-500",
    purple:
      "border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10 hover:border-purple-500",
    gray: "border-gray-200 dark:border-gray-500/30 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/10 hover:border-gray-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={!!loading}
      className={`flex items-start gap-3 p-3 rounded border transition-all text-left relative overflow-hidden group ${colors[color]} ${className} ${loading ? "opacity-70 cursor-wait" : ""}`}
    >
      <div className="mt-0.5">
        {loading ? <RefreshCw size={16} className="animate-spin" /> : icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm">{label}</span>
          <span className="text-[10px] font-mono opacity-50 border border-current px-1 rounded">
            {method}
          </span>
        </div>
        {subtext && <p className="text-[10px] opacity-70 mt-0.5">{subtext}</p>}
      </div>
    </button>
  );
};

export default ServiceExample;
