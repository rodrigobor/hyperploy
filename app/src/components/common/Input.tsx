import React from 'react';
import "../../styles/tailwind.css";


const Input: React.FC<{
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
}> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  label,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-white mb-2 font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-white/5 border border-hl-accent/20 rounded-lg py-3 px-4 text-white transition-all focus:border-hl-accent focus:outline-none focus:ring-2 focus:ring-hl-accent/20 ${className}`}
      />
    </div>
  );
};

export default Input;
