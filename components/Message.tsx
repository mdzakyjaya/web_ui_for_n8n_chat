
import React from 'react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageProps {
  message: Message;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex-shrink-0 flex items-center justify-center font-bold text-white">
        U
    </div>
);

const ModelIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex-shrink-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5z" />
            <path d="M5 14a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
        </svg>
    </div>
);

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 py-6 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && <ModelIcon />}
        <div className={`max-w-2xl text-white prose prose-invert prose-p:text-gray-200 prose-strong:text-white ${isUser ? 'bg-blue-500/10' : 'bg-gray-700/20'} rounded-xl p-4`}>
            {isUser ? <p>{message.content}</p> : <MarkdownRenderer content={message.content} />}
        </div>
        {isUser && <UserIcon />}
    </div>
  );
};

export default MessageComponent;
