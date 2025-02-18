import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};