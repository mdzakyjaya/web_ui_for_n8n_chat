
import React from 'react';

interface SuggestionChipProps {
  text: string;
  icon: JSX.Element;
  onClick: () => void;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({ text, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm p-4 rounded-xl flex flex-col justify-between h-36 w-full text-left transition-all duration-300 transform hover:-translate-y-1 group"
    >
      <div className="text-gray-300 text-lg">
        {text}
      </div>
      <div className="self-end text-gray-500 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
    </button>
  );
};

export default SuggestionChip;
