
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MessageComponent from './Message';
import LoadingIndicator from './LoadingIndicator';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {messages.map((msg, index) => (
          <MessageComponent key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-4 py-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex-shrink-0 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5z" />
                    <path d="M5 14a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
                </svg>
            </div>
            <div className="bg-gray-700/20 rounded-xl p-4">
              <LoadingIndicator />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default ChatWindow;