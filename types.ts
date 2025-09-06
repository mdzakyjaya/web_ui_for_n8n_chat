export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  content: string;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
}

export interface ChatHistoryPart {
  text: string;
}

export interface ChatHistory {
    role: Role;
    parts: ChatHistoryPart[];
}
