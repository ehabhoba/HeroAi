
import React from 'react';

interface LoadingSpinnerProps {
    message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8">
        <div className="w-16 h-16 border-4 border-t-gold border-r-gold border-b-gold border-l-charcoal dark:border-l-sand rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-light-text dark:text-dark-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
