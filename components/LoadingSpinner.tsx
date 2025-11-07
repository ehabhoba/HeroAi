
import React from 'react';

interface LoadingSpinnerProps {
    message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8">
        <div className="w-16 h-16 border-4 border-t-pharaoh-gold border-r-pharaoh-gold border-b-pharaoh-gold border-l-nile-blue rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-nile-blue">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
