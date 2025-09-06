import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSendMessage(value.trim());
      setValue('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const isDisabled = isLoading || !value.trim();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 bg-transparent flex-shrink-0">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end space-x-4">
        <div className="flex-1 bg-[#2d2f34] rounded-full flex items-center py-2 pl-6 pr-2 shadow-lg">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Agent"
            rows={1}
            className="w-full bg-transparent text-gray-200 placeholder-gray-400 resize-none focus:outline-none max-h-48 text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isDisabled}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
           <svg className={`w-5 h-5 ${isDisabled ? 'text-gray-500' : 'text-white'}`} viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"></path></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;