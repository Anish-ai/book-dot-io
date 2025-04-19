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
    return <tbody className="divide-y divide-[var(--border)]">{children}</tbody>;
  }
  
  export function Tr({ children, className = '', ...props }) {
    return (
      <tr className={`table-row-hover ${className}`} {...props}>
        {children}
      </tr>
    );
  }
  
  export function Th({ children, className = '', ...props }) {
    return (
      <th
        className={`table-header-cell ${className}`}
        {...props}
      >
        {children}
      </th>
    );
  }
  
  export function Td({ children, className = '', ...props }) {
    return (
      <td
        className={`table-cell ${className}`}
        {...props}
      >
        {children}
      </td>
    );
  }