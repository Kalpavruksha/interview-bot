import React from 'react';

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/80"
        onClick={() => onOpenChange && onOpenChange(false)}
      />
      <div className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-lg">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = '', ...props }) => {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h2>
  );
};

const DialogDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  );
};

const DialogFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };