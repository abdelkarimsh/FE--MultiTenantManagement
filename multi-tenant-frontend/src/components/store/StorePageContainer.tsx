import React from 'react';

interface StorePageContainerProps {
  children: React.ReactNode;
}

const StorePageContainer: React.FC<StorePageContainerProps> = ({ children }) => {
  return <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>;
};

export default StorePageContainer;
