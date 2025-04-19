// src/components/ui/Table.js
export function Table({ children, className = '' }) {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    );
  }
  
  export function Thead({ children }) {
    return <thead>{children}</thead>;
  }
  
  export function Tbody({ children }) {
    return <tbody className="divide-y divide-gray-200">{children}</tbody>;
  }
  
  export function Tr({ children, className = '', ...props }) {
    return (
      <tr className={className} {...props}>
        {children}
      </tr>
    );
  }
  
  export function Th({ children, className = '', ...props }) {
    return (
      <th
        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
        {...props}
      >
        {children}
      </th>
    );
  }
  
  export function Td({ children, className = '', ...props }) {
    return (
      <td
        className={`px-6 py-4 whitespace-nowrap ${className}`}
        {...props}
      >
        {children}
      </td>
    );
  }