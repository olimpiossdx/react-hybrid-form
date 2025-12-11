import React from 'react';
import useForm from '../../hooks/use-form';
import useMask from '../../hooks/use-mask';
import showModal from '../../componentes/modal/hook';

const TabMaskExample = () => {
  const { handleSubmit, formProps } = useForm("mask-form");
  const [phoneValue, setPhoneValue] = React.useState("");

  // Configuração Limpa
  const cpfMask = useMask('cpf');
  const cnpjMask = useMask('cnpj');
  
  // Exemplo com Callback customizado
  const phoneMask = useMask('phone', {
      onChange: (e) => {
          console.log("Telefone mudou:", e.target.value);
          setPhoneValue(e.target.value);
      }
  });

  const onSubmit = (data: any) => {
      showModal({
          title: "Dados Enviados",
          content: () => <pre className="bg-black p-4 text-green-400">{JSON.stringify(data, null, 2)}</pre>
      });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">Máscaras de Input</h2>
        
        <form {...formProps} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="text-xs text-gray-400 uppercase">CPF</label>
                <input 
                    name="doc_cpf" 
                    className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-white" 
                    {...cpfMask} 
                />
            </div>

            <div>
                <label className="text-xs text-gray-400 uppercase">CNPJ</label>
                <input 
                    name="doc_cnpj" 
                    className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-white" 
                    {...cnpjMask} 
                />
            </div>

            <div>
                <label className="text-xs text-gray-400 uppercase">Telefone (Dinâmico)</label>
                <input 
                    name="celular" 
                    className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-white" 
                    {...phoneMask} // Espalha onChange, onBlur, maxLength
                />
                <p className="text-xs text-gray-500 mt-1">State Local: {phoneValue}</p>
            </div>

            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded font-bold">
                Enviar
            </button>
        </form>
    </div>
  );
};

export default TabMaskExample;