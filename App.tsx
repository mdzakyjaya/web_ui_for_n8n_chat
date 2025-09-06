import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Message, Session } from './types';
import { sendMessageToWebhook } from './services/chatService';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SuggestionChip from './components/SuggestionChip';
import Sidebar from './components/Sidebar';

// Custom hook for persisting state to localStorage
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};


const App: React.FC = () => {
  const [sessions, setSessions] = useLocalStorage<Session[]>('chat-sessions', []);
  const [activeSessionId, setActiveSessionId] = useLocalStorage<string | null>('active-session-id', null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Create a default session if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      const newSessionId = `session-${Date.now()}`;
      setSessions([{ id: newSessionId, title: 'New Chat', messages: [] }]);
      setActiveSessionId(newSessionId);
    } else if (!activeSessionId || !sessions.find(s => s.id === activeSessionId)) {
      setActiveSessionId(sessions[0]?.id ?? null);
    }
  }, []);
  
  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === activeSessionId) ?? null;
  }, [sessions, activeSessionId]);

  const updateSessionMessages = (sessionId: string, newMessages: Message[]) => {
     setSessions(prevSessions =>
      prevSessions.map(s =>
        s.id === sessionId ? { ...s, messages: newMessages } : s
      )
    );
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (isLoading || !activeSession) return;

    const userMessage: Message = { role: 'user', content: text };
    const currentMessages = [...activeSession.messages, userMessage];
    
    // Optimistically update UI
    setSessions(prev => prev.map(s => s.id === activeSessionId ? {...s, messages: currentMessages} : s));
    setIsLoading(true);

    // If it's the first message, update the session title
    if (activeSession.messages.length === 0) {
        const newTitle = text.length > 30 ? text.substring(0, 27) + '...' : text;
        setSessions(prev => prev.map(s => s.id === activeSessionId ? {...s, title: newTitle} : s));
    }

    try {
      // Pass only the history of the current session
      const responseText = await sendMessageToWebhook(text, activeSession.messages);
      const modelMessage: Message = { role: 'model', content: responseText };
      updateSessionMessages(activeSession.id, [...currentMessages, modelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'model',
        content: "Sorry, I couldn't connect to the AI assistant. Please check your connection or try again later.",
      };
      updateSessionMessages(activeSession.id, [...currentMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, activeSession, activeSessionId, setSessions]);
  
  const handleSuggestionClick = (suggestion: string) => {
      handleSendMessage(suggestion);
  };

  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: Session = { id: newSessionId, title: 'New Chat', messages: [] };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(sessions[0]?.id ?? null);
    }
  }

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? {...s, title: newTitle} : s));
  }

  const suggestions = [
    { text: "Suggest a captivating book to read", icon: <BookIcon /> },
    { text: "Explain quantum computing in simple terms", icon: <BrainIcon /> },
    { text: "Write a short story about a friendly robot", icon: <RobotIcon /> },
    { text: "Plan a 3-day trip to Tokyo", icon: <PlaneIcon /> }
  ];

  return (
    <div className="h-screen w-screen flex bg-[#1e1f20] text-white font-sans overflow-hidden">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        isCollapsed={isSidebarCollapsed}
        onNewChat={handleNewChat}
        onSelectSession={setActiveSessionId}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 flex flex-col h-full bg-[#131314]">
        <header className="p-4 h-[70px] flex items-center justify-between flex-shrink-0 text-gray-200">
            <div className="flex items-center">
                <span className="text-2xl">Gemini</span>
                <button className="ml-4 flex items-center gap-1 text-sm text-gray-300 bg-gray-700/50 hover:bg-gray-700 transition-colors px-3 py-1.5 rounded-lg">
                    <span>2.5 Pro</span>
                    <ChevronDownIcon />
                </button>
            </div>
            {/* User Profile Icon can go here */}
        </header>
        
        {activeSession && activeSession.messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex flex-col justify-center items-center p-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">Hello there!</h2>
              <p className="text-2xl text-gray-300">How can I help you today?</p>
            </div>
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {suggestions.map(s => (
                  <SuggestionChip key={s.text} text={s.text} icon={s.icon} onClick={() => handleSuggestionClick(s.text)} />
              ))}
            </div>
          </div>
        ) : (
          <ChatWindow messages={activeSession?.messages ?? []} isLoading={isLoading} />
        )}
        
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

// Icons for suggestions
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const RobotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);
const PlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export default App;