// src/components/ui/Button.js
export default function Button({ children, className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
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