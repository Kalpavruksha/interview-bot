import React, { useState } from 'react';

const Tabs = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  // Pass the activeTab and setActiveTab to children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });
  
  return (
    <div className={className}>
      {childrenWithProps}
    </div>
  );
};

const TabsList = ({ children, className = '', ...props }) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`} {...props}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, children, activeTab, setActiveTab, className = '', ...props }) => {
  const isActive = activeTab === value;
  
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive 
          ? 'bg-background text-foreground shadow-sm' 
          : 'hover:text-foreground'
      } ${className}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, activeTab, className = '', ...props }) => {
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };