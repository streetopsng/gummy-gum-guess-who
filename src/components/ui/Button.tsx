import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'amber' | 'coral' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'amber', children, className = '', ...props }) => {
  const baseStyles = 'w-full p-4 rounded-lg text-[15px] font-bold border-none cursor-pointer transition-all duration-150 active:scale-98 active:opacity-90';
  
  const variants = {
    amber: 'bg-amber text-[#1a0f00]',
    coral: 'bg-coral text-white',
    ghost: 'bg-transparent border-[1.5px] border-border text-white hover:border-amber hover:text-amber',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
