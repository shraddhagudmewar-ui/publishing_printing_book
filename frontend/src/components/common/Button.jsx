import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-[#48779E] text-white hover:bg-[#3A6486] focus:ring-[#48779E] shadow-sm',
    secondary: 'bg-white text-[#202020] border border-[#A8B9C8] hover:bg-slate-50 focus:ring-[#A8B9C8]',
    outline: 'bg-transparent text-[#48779E] border border-[#48779E] hover:bg-[#48779E] hover:text-white',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 focus:ring-rose-600',
    ghost: 'bg-transparent text-[#202020] hover:bg-[#EAF1F7]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${
        disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-1" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
