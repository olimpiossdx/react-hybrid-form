import React from "react";

interface StarRatingProps {
  name: string;
  label?: string;
  initialValue?: number;
  maxStars?: number;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  validationKey?: string;
  className?: string;
  starClassName?: string;
}

/**
 * Componente de Avaliação Híbrido (Versão Homologada v2.5).
 * * Camada Visual (Z-10): SVGs que recebem interação do usuário.
 * * Camada de Dados (Z-0): Input 'Sentinela' (1px) para validação nativa.
 */
const StarRating: React.FC<StarRatingProps> = ({
  name,
  label,
  required,
  readOnly,
  disabled,
  initialValue = 0,
  maxStars = 5,
  onChange,
  validationKey,
  className = "",
  starClassName = "w-8 h-8",
}) => {
  const [currentValue, setCurrentValue] = React.useState<number>(
    Number(initialValue) || 0
  );
  const [hoverValue, setHoverValue] = React.useState<number>(0);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const effectiveDisabled = disabled || readOnly;
  const starsArray = React.useMemo(
    () => Array.from({ length: maxStars }, (_, i) => i + 1),
    [maxStars]
  );

  // Sincronia Inicial
  React.useEffect(() => {
    setCurrentValue(Number(initialValue) || 0);
  }, [initialValue]);

  // Sincronia com DOM (Reset & Load Data)
  React.useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleExternalUpdate = () => {
      const val = Number(input.value);
      const safeVal = isNaN(val) ? 0 : val;

      // Usa callback funcional para sempre ter o valor mais recente sem recriar o listener
      setCurrentValue((prev) => (prev !== safeVal ? safeVal : prev));
    };

    input.addEventListener("input", handleExternalUpdate);
    input.addEventListener("change", handleExternalUpdate);

    return () => {
      input.removeEventListener("input", handleExternalUpdate);
      input.removeEventListener("change", handleExternalUpdate);
    };
  }, []); // Dependência vazia para performance máxima

  function validate(inputRef: React.RefObject<HTMLInputElement | null>,newValue: number ) {
    if (!inputRef.current) {
      return;
    };

    if (inputRef.current.value !== String(newValue || "")) {
      inputRef.current.value = newValue === 0 ? "" : String(newValue);
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    };
    inputRef.current.setCustomValidity("");
  };

  const updateValue = (newValue: number) => {
    if (newValue !== currentValue) {
      setCurrentValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }

    validate(inputRef, newValue);
  };

  const handleClick = (value: number) => {
    if (effectiveDisabled) {
      return;
    }
    const newValue = value === currentValue ? 0 : value;
    updateValue(newValue);
    containerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (effectiveDisabled) {
      return;
    }
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp": {
        e.preventDefault();
        updateValue(Math.min(maxStars, currentValue + 1));
        break;
      }
      case "ArrowLeft":
      case "ArrowDown": {
        e.preventDefault();
        updateValue(Math.max(0, currentValue - 1));
        break;
      }
      case "Home": {
        e.preventDefault();
        updateValue(0);
        break;
      }
      case "End": {
        e.preventDefault();
        updateValue(maxStars);
        break;
      }
    }
  };

  // Interceptador de Erro de Validação Nativa
  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    // Deixa o browser mostrar a mensagem padrão
    e.currentTarget.setCustomValidity("Selecione uma nota.");
  };

  const handleBlur = () => {
    if (effectiveDisabled) {
      return;
    };

    inputRef.current?.dispatchEvent(new Event("blur", { bubbles: true }));
  };

  const displayValue = hoverValue || currentValue;

  return (<div className={`relative mb-4 ${effectiveDisabled ? "opacity-50" : ""} ${className}`}>
      {label ? (
        <label className="block mb-1 text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      ) : null}

      <div className="relative w-fit group">
        {/* CAMADA 0 (Fundo -> Agora vem antes no DOM para usar o seletor 'peer')
            MUDANÇA: Colocamos o input ANTES da div visual.
            Isso permite usar a classe 'peer' no input e 'peer-invalid' na div.
            O Z-Index e Posicionamento garantem que ele visualmente continue "atrás".
        */}
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="number"
          onInvalid={handleInvalid}
          required={required}
          min={required ? 1 : 0}
          max={maxStars}
          disabled={disabled}
          data-validation={validationKey}
          defaultValue={currentValue === 0 ? "" : currentValue}
          tabIndex={-1}
          className="peer absolute bottom-0 left-1 w-px h-px opacity-0 pointer-events-auto z-0"
          style={{ appearance: "none" }}
        />

        {/* CAMADA 1 (Frente): Estrelas Visuais
            - Adicionado 'peer-[.is-touched]:peer-invalid:ring-2'
            - Adicionado 'peer-[.is-touched]:peer-invalid:ring-red-500'
            - Isso faz o container brilhar vermelho quando o input irmão (peer) está inválido e foi tocado.
        */}
        <div
          ref={containerRef}
          className={`
            flex items-center gap-1 p-1 rounded-md outline-none 
            focus:ring-2 focus:ring-yellow-400 
            relative z-10
            peer-[.is-touched]:peer-invalid:ring-2 peer-[.is-touched]:peer-invalid:ring-red-500
          `}
          tabIndex={effectiveDisabled ? -1 : 0}
          role="slider"
          aria-valuenow={currentValue}
          aria-valuemax={maxStars}
          aria-label={label || name}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onMouseLeave={() => setHoverValue(0)}
        >
          {starsArray.map((starIndex) => (
            <svg
              key={starIndex}
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() =>
                !effectiveDisabled && setHoverValue(starIndex)
              }
              className={`transition-transform duration-100 cursor-pointer ${starClassName} ${effectiveDisabled ? "" : "hover:scale-110"} ${displayValue >= starIndex ? "text-yellow-400" : "text-gray-600"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarRating;
