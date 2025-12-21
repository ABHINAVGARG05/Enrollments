import { useState } from "react";

interface Props {
  label: string;
  placeholder: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

const Input: React.FC<Props> = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  required = false,
  className = "",
}: Props) => {
  const [inputType, setInputType] = useState(type);

  // 🔥 Key logic: decide icon color
  const isFilled = Boolean(value && value.length > 0);

  return (
    <div className={`relative input-container flex flex-grow w-full ${className}`}>
      <input
        className="nes-input is-dark text-white outline-none w-full min-w-[280px] md:min-w-[320px] lg:min-w-[360px]"
        type={inputType}
        placeholder={placeholder}
        name={label}
        value={value}
        onChange={onChange}
        required={required}
      />

      {type === "password" && (
        <button
          type="button"
          className="absolute top-1/2 -translate-y-1/2 right-2 h-1/2 outline-none border-0 bg-transparent"
          onClick={() =>
            setInputType(inputType === "text" ? "password" : "text")
          }
        >
          <img
            src={inputType === "password" ? "/eye.png" : "/invisible.png"}
            alt="Toggle password visibility"
            className="h-full mx-auto"
            style={{
              filter: isFilled ? "none" : "invert(1)",
            }}
          />
        </button>
      )}
    </div>
  );
};

export default Input;
