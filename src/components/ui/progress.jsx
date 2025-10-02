import React from 'react';

const Progress = ({ value, className = '', ...props }) => {
  const progressValue = Math.min(100, Math.max(0, value || 0));
  
  return (
    <div className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
      <div
        className="h-full w-full flex-1 bg-blue-600 transition-all"
        style={{ transform: `translateX(-${100 - progressValue}%)` }}
      />
    </div>
  );
};

export { Progress };