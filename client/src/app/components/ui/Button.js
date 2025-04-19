// src/components/ui/Button.js
export default function Button({ children, className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-[var(--error)] text-white hover:bg-[var(--error-light)]'
  }

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}