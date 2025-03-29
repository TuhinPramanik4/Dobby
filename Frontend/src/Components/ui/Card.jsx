export function Card({ children, className }) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-6 ${className || ""}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className }) {
    return <div className={`flex items-center space-x-4 ${className || ""}`}>{children}</div>;
  };
  