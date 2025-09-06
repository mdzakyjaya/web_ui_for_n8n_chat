import React, { useState, useRef, useEffect } from 'react';
import { Session } from '../types';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  isCollapsed: boolean;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  isCollapsed,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onToggle,
}) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSessionId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSessionId]);

  const handleRename = (session: Session) => {
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSessionId && editingTitle.trim()) {
      onRenameSession(editingSessionId, editingTitle.trim());
    }
    setEditingSessionId(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingSessionId(null);
    }
  }

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat session?')) {
        onDeleteSession(sessionId);
    }
  };

  return (
    <aside
      className={`bg-[#1e1f20] flex flex-col transition-all duration-300 ease-in-out text-gray-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
        <div className="flex-shrink-0 h-[70px] flex items-center px-4">
            <button
            onClick={onToggle}
            className="p-3 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
            <MenuIcon />
            </button>
        </div>

        <div className="px-2 mt-2">
            <button
            onClick={onNewChat}
            className={`flex items-center p-3 rounded-full bg-[#393a3d] hover:bg-[#48494d] transition-colors font-medium ${
                isCollapsed ? 'w-14 h-14 justify-center' : 'w-auto'
            }`}
            >
            <EditIcon />
            {!isCollapsed && <span className="ml-3 text-gray-100">New chat</span>}
            </button>
        </div>
      
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 mt-4">
        {!isCollapsed && <h3 className="px-3 py-2 text-sm font-medium text-gray-500">Recent</h3>}
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`group relative flex items-center p-3 rounded-full cursor-pointer transition-colors ${
              session.id === activeSessionId
                ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white'
                : 'hover:bg-gray-700/50'
            }`}
          >
            <ChatIcon />
            {!isCollapsed && (
              <div className="ml-3 w-full overflow-hidden">
                {editingSessionId === session.id ? (
                  <form onSubmit={handleRenameSubmit}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={handleRenameSubmit}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent border-b border-purple-400 focus:outline-none"
                    />
                  </form>
                ) : (
                  <span className="truncate">{session.title}</span>
                )}
              </div>
            )}
            {!isCollapsed && session.id === activeSessionId && (
              <div className="absolute right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleRename(session); }}
                  className="p-1 hover:bg-gray-600/50 rounded"
                  aria-label="Rename session"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={(e) => handleDelete(e, session.id)}
                  className="p-1 hover:bg-gray-600/50 rounded"
                  aria-label="Delete session"
                >
                  <TrashIcon />
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>

    </aside>
  );
};


// Icons
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
    </svg>
);


const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default Sidebar;