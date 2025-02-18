import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick,
  children,
}) => {
  const baseStyles = 'px-4 py-2 text-sm font-medium rounded-md transition-colors';
  
  const variantStyles = {
    primary: `${disabled ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`,
    secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};