
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-fuchsia-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default LoadingIndicator;
