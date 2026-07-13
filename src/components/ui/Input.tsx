import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`mb-3.5 ${className}`}>
      {label && <label className="block text-[11px] text-muted tracking-widest uppercase mb-[7px] font-semibold">{label}</label>}
      <input
        className="w-full bg-surface border border-border rounded-md text-white text-[14px] px-3.5 py-3 outline-none font-inherit transition-colors duration-150 focus:border-amber placeholder:text-white/20 text-center"
        {...props}
      />
      {error && <div className="text-[12px] text-red text-center min-h-[18px] mt-1">{error}</div>}
    </div>
  );
};
