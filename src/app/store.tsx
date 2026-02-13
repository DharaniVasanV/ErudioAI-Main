import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Subject, TimetableBlock, HistoryItem, MOCK_SUBJECTS, MOCK_TIMETABLE, MOCK_HISTORY, ChatMessage } from './mockData';

export type ViewName = 
  | 'Landing' 
  | 'Login' 
  | 'Signup' 
  | 'Dashboard' 
  | 'UploadWizard' 
  | 'TimetableSummary' 
  | 'Timetable' 
  | 'Lessons' 
  | 'TopicDetail' 
  | 'Quiz' 
  | 'QuizResult' 
  | 'RemedialVideo' 
  | 'Chat' 
  | 'History' 
  | 'RevisionMode' 
  | 'Analytics'
  | 'Notifications';

interface AppState {
  user: { name: string; email: string; avatar?: string } | null;
  currentView: ViewName;
  viewParams: any;
  subjects: Subject[];
  timetable: TimetableBlock[];
  history: HistoryItem[];
  chatHistory: Record<string, ChatMessage[]>;
  notifications: string[];
  isAuthenticated: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, name: string) => void;
  logout: () => void;
  navigate: (view: ViewName, params?: any) => void;
  goBack: () => void;
  updateTimetable: (blocks: TimetableBlock[]) => void;
  addHistoryItem: (item: HistoryItem) => void;
  addNotification: (text: string) => void;
  startChat: (topicId?: string) => string; // Returns chat ID
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppState['user']>(null);
  const [currentView, setCurrentView] = useState<ViewName>('Landing');
  const [viewParams, setViewParams] = useState<any>({});
  const [viewHistory, setViewHistory] = useState<{view: ViewName, params: any}[]>([]);
  
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [timetable, setTimetable] = useState<TimetableBlock[]>(MOCK_TIMETABLE);
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});
  const [notifications, setNotifications] = useState<string[]>([
    "Your timetable was updated after yesterday's quiz",
    "New remedial video ready for Pointers in C"
  ]);

  const login = (email: string, name: string) => {
    setUser({ email, name, avatar: `https://ui-avatars.com/api/?name=${name}&background=random` });
    setCurrentView('Dashboard');
    setViewHistory([]);
  };

  const logout = () => {
    setUser(null);
    setCurrentView('Landing');
    setViewHistory([]);
  };

  const navigate = (view: ViewName, params: any = {}) => {
    setViewHistory(prev => [...prev, { view: currentView, params: viewParams }]);
    setCurrentView(view);
    setViewParams(params);
  };

  const goBack = () => {
    if (viewHistory.length === 0) return;
    const last = viewHistory[viewHistory.length - 1];
    setViewHistory(prev => prev.slice(0, -1));
    setCurrentView(last.view);
    setViewParams(last.params);
  };

  const updateTimetable = (blocks: TimetableBlock[]) => {
    setTimetable(blocks);
  };

  const addHistoryItem = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const addNotification = (text: string) => {
    setNotifications(prev => [text, ...prev]);
  };

  const startChat = (topicId?: string) => {
    const chatId = Date.now().toString();
    const initialMessage: ChatMessage = {
        id: 'init',
        role: 'ai',
        text: topicId 
          ? `Hi! I see you're studying ${subjects.flatMap(s => s.topics).find(t => t.id === topicId)?.name || 'a topic'}. How can I help you with this?`
          : "Hello! I'm your ErudioAI companion. Ask me anything or let me help you plan your study.",
        timestamp: new Date().toISOString()
    };
    setChatHistory(prev => ({ ...prev, [chatId]: [initialMessage] }));
    return chatId;
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      currentView,
      viewParams,
      subjects,
      timetable,
      history,
      chatHistory,
      notifications,
      login,
      logout,
      navigate,
      goBack,
      updateTimetable,
      addHistoryItem,
      addNotification,
      startChat
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};