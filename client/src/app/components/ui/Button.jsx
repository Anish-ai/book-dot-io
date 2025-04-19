import React from 'react'
import { twMerge } from 'tailwind-merge'

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled = false,
  fullWidth = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantStyles = {
    primary: 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white focus:ring-[var(--primary-light)]',
    secondary: 'bg-[var(--secondary)] hover:bg-[var(--secondary-dark)] text-white focus:ring-[var(--secondary-light)]',
    outline: 'bg-transparent border border-[var(--border)] hover:bg-[var(--background-hover)] text-[var(--foreground)] focus:ring-[var(--primary-light)]',
    danger: 'bg-[var(--error)] hover:bg-[var(--error-dark)] text-white focus:ring-[var(--error-light)]',
    ghost: 'bg-transparent hover:bg-[var(--background-hover)] text-[var(--foreground)] focus:ring-[var(--primary-light)]',
  }
  
  const sizeStyles = {
    small: 'text-xs px-3 py-1.5',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-6 py-3',
  }
  
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none'
  const widthStyles = fullWidth ? 'w-full' : ''
  
  const classes = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled && disabledStyles,
    widthStyles,
    className
  )
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button 