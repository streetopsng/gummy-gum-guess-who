import React from 'react';

interface BadgeProps {
  variant?: 'amber' | 'green' | 'coral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'amber', children, className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border';
  
  const variants = {
    amber: 'bg-[#F5A6231F] text-amber border-[#F5A62340]',
    green: 'bg-[#22C55E1F] text-green border-[#22C55E40]',
    coral: 'bg-[#FF5C381F] text-coral border-[#FF5C3840]',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
