
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SendIcon = ({ isLoading }: { isLoading: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-200 ${isLoading ? 'text-gray-500' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end space-x-4">
        <div className="flex-1 bg-gray-800/70 rounded-2xl flex items-end p-1 border border-transparent focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Gemini..."
            rows={1}
            className="w-full bg-transparent p-3 text-gray-200 placeholder-gray-500 resize-none focus:outline-none max-h-48"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            aria-label="Send message"
          >
           <SendIcon isLoading={isLoading || !value.trim()} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
