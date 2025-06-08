import React from 'react';

const Button: React.FC<{
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  className = '',
  disabled = false,
}) => {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-hl-accent focus:ring-opacity-50';

  const variantClasses = {
    primary:
      'bg-hl-accent text-hl-dark hover:bg-hl-accent-light hover:translate-y-[-2px] hover:shadow-button',
    secondary:
      'bg-transparent text-hl-accent border-2 border-hl-accent hover:bg-hl-accent/10 hover:translate-y-[-2px]',
    text: 'bg-transparent text-hl-accent hover:underline',
  };

  const sizeClasses = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
