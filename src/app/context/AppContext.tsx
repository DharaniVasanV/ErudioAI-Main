import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Subject,
  Topic,
  TimeBlock,
  ChatSession,
  RecentActivity,
  Notification,
  Exam,
} from "@/app/types";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { formatDistanceToNow } from "date-fns";

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string, level?: string) => void;
  logout: () => void;

  subjects: Subject[];
  topics: Topic[];
  timetable: TimeBlock[];
  recentActivity: RecentActivity[];
  notifications: Notification[];
  exams: Exam[];
  chatHistory: ChatSession[];

  // Actions
  addTimeBlock: (block: TimeBlock) => void;
  updateTimeBlock: (block: TimeBlock) => void;
  generateLessonPlan: (preferences: any) => void;
  addRecentActivity: (activity: RecentActivity) => void;
  createNewChat: (
    subjectId?: string,
    topicId?: string,
  ) => string;
  sendMessage: (chatId: string, content: string) => void;
  scheduleRevision: (topicId: string, date: string) => void;
  updateTopicStatus: (topicId: string, score: number) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined,
);

// MOCK DATA

const MOCK_SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    progress: 65,
    color: "bg-blue-500",
  },
  {
    id: "phys",
    name: "Physics",
    progress: 42,
    color: "bg-purple-500",
  },
  {
    id: "chem",
    name: "Chemistry",
    progress: 28,
    color: "bg-green-500",
  },
  {
    id: "cs",
    name: "Computer Science",
    progress: 80,
    color: "bg-indigo-500",
  },
];

const MOCK_TOPICS: Topic[] = [
  // Math
  {
    id: "t1",
    subjectId: "math",
    name: "Quadratic Equations",
    status: "Mastered",
    examRelevance: "High importance for Midterm",
    score: 90,
    lastRevised: "2023-10-15",
  },
  {
    id: "t2",
    subjectId: "math",
    name: "Calculus I: Limits",
    status: "In progress",
    examRelevance: "Medium",
    score: 45,
    hasRemedialVideo: true,
  },
  {
    id: "t3",
    subjectId: "math",
    name: "Trigonometry",
    status: "Not started",
    examRelevance: "Low",
  },

  // Physics
  {
    id: "t4",
    subjectId: "phys",
    name: "Kinematics",
    status: "Mastered",
    examRelevance: "High",
    score: 85,
    lastRevised: "2023-10-20",
  },
  {
    id: "t5",
    subjectId: "phys",
    name: "Newton's Laws",
    status: "In progress",
    examRelevance: "High",
  },
  {
    id: "t6",
    subjectId: "phys",
    name: "Thermodynamics",
    status: "Not started",
    examRelevance: "Medium",
  },

  // CS
  {
    id: "t7",
    subjectId: "cs",
    name: "Arrays & Strings",
    status: "Mastered",
    score: 95,
  },
  {
    id: "t8",
    subjectId: "cs",
    name: "Pointers in C",
    status: "In progress",
    hasRemedialVideo: true,
  },
];

const MOCK_TIMETABLE: TimeBlock[] = [
  // Fixed classes
  {
    id: "c1",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    type: "Class",
    title: "Math Class",
    isFixed: true,
  },
  {
    id: "c2",
    day: "Monday",
    startTime: "10:00",
    endTime: "11:00",
    type: "Class",
    title: "Physics Class",
    isFixed: true,
  },
  {
    id: "c3",
    day: "Monday",
    startTime: "11:00",
    endTime: "12:00",
    type: "Class",
    title: "CS Class",
    isFixed: true,
  },

  // Study blocks
  {
    id: "s1",
    day: "Monday",
    startTime: "17:00",
    endTime: "18:00",
    type: "Study",
    subjectId: "math",
    topicId: "t2",
    title: "Calculus Study",
  },
  {
    id: "s2",
    day: "Monday",
    startTime: "18:15",
    endTime: "19:00",
    type: "Revision",
    subjectId: "phys",
    topicId: "t4",
    title: "Kinematics Revision",
  },
];

const MOCK_EXAMS: Exam[] = [
  {
    id: "e1",
    name: "Midterm Physics",
    date: "2023-11-15",
    importance: "High",
  },
  {
    id: "e2",
    name: "Math Quiz",
    date: "2023-11-05",
    importance: "Medium",
  },
];

const MOCK_ACTIVITY: RecentActivity[] = [
  {
    id: "a1",
    type: "Chat",
    title: "Algebra – Quadratic equations",
    timestamp: "Today, 6:20 PM",
    refId: "chat1",
  },
  {
    id: "a2",
    type: "Quiz",
    title: "Physics – Kinematics",
    subtitle: "Score: 85%",
    timestamp: "Yesterday, 4:30 PM",
    refId: "t4",
  },
  {
    id: "a3",
    type: "Video",
    title: "Fix your weak spot: Pointers",
    timestamp: "Yesterday, 8:00 PM",
    refId: "t8",
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "remedial_content",
    title: "New remedial video ready",
    message: "Video generated for Quadratic Equations based on your last quiz",
    read: false,
    timestamp: "1 hour ago",
    priority: "high",
    actionType: "video",
    actionId: "t8",
  },
  {
    id: "n2",
    type: "plan_update",
    title: "Plan updated",
    message:
      "Your timetable was updated after yesterday's quiz",
    read: false,
    timestamp: "1 day ago",
    priority: "normal",
    actionType: "timetable",
  },
  {
    id: "n3",
    type: "study_reminder",
    title: "Study session starting soon",
    message: "Math – Quadratic equations at 5:00 PM",
    read: true,
    timestamp: "2 hours ago",
    priority: "high",
    actionType: "timetable",
    actionId: "s1",
  },
  {
    id: "n4",
    type: "weekly_revision",
    title: "Weekly revision reminder",
    message: "You have 3 pending revisions from last week",
    read: false,
    timestamp: "3 hours ago",
    priority: "high",
    actionType: "dashboard",
  },
  {
    id: "n5",
    type: "suggested_revision",
    title: "Suggested revision",
    message:
      "Algebra – Quadratic equations (low quiz score, high exam weight)",
    read: false,
    timestamp: "5 hours ago",
    priority: "high",
    actionType: "topic",
    actionId: "t2",
  },
  {
    id: "n6",
    type: "scheduled_revision",
    title: "Revision due today",
    message: "Kinematics – you scheduled this for today",
    read: true,
    timestamp: "1 day ago",
    priority: "normal",
    actionType: "topic",
    actionId: "t4",
  },
  {
    id: "n7",
    type: "exam_alert",
    title: "Exam coming up",
    message: "Math Midterm in 3 days",
    read: false,
    timestamp: "2 days ago",
    priority: "high",
    actionType: "analytics",
  },
  {
    id: "n8",
    type: "achievement",
    title: "Nice work!",
    message: "You're on a 7-day study streak, keep it going!",
    read: true,
    timestamp: "2 days ago",
    priority: "low",
    actionType: "dashboard",
  },
  {
    id: "n9",
    type: "chat_notes",
    title: "AI chat summary ready",
    message:
      "Your conversation about Pointers in C has been converted to notes",
    read: false,
    timestamp: "3 days ago",
    priority: "normal",
    actionType: "chat",
    actionId: "chat1",
  },
];

export const AppProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [timetable, setTimetable] = useState<TimeBlock[]>(MOCK_TIMETABLE);
  const [exams] = useState<Exam[]>(MOCK_EXAMS);
  const [recentActivity, setRecentActivity] =
    useState<RecentActivity[]>(MOCK_ACTIVITY);
  const [notifications, setNotifications] = useState<
    Notification[]
  >(MOCK_NOTIFICATIONS);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(
    [
      {
        id: "chat1",
        title: "Algebra – Quadratic equations",
        timestamp: "2023-10-25T18:20:00",
        messages: [
          {
            id: "m1",
            role: "user",
            content: "Explain quadratic formula",
            timestamp: "2023-10-25T18:20:00",
          },
          {
            id: "m2",
            role: "assistant",
            content:
              "The quadratic formula is used to find the roots of a quadratic equation...",
            timestamp: "2023-10-25T18:20:05",
          },
        ],
      },
    ],
  );

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('erudio_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('erudio_user');
      }
    }
  }, []);

  // Load chat history from backend
  useEffect(() => {
    if (isAuthenticated) {
      const fetchHistory = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const res = await fetch(`${config.api.baseUrl}/chat/history`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            const historyActivities = data.map((conv: any) => ({
              id: conv.id,
              type: 'Chat' as const,
              title: conv.title,
              timestamp: formatDistanceToNow(new Date(conv.created_at), { addSuffix: true }),
              refId: conv.id
            }));

            setRecentActivity(prev => {
              const others = prev.filter(a => a.id !== 'a1' && a.type !== 'Chat');
              return [...historyActivities, ...others];
            });
          }
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };

      fetchHistory();
    }
  }, [isAuthenticated]);

  const login = (email: string, name?: string) => {
    const userData = {
      id: "u1",
      name: name || email.split('@')[0],
      email,
      level: "College" as const,
      streak: 12,
    };

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('erudio_user', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const signup = (name: string, email: string, level?: string) => {
    const userData = {
      id: "u1",
      name,
      email,
      level: (level as "School" | "College" | "Other") || "College",
      streak: 0,
    };

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('erudio_user', JSON.stringify(userData));
    toast.success(`Account created successfully! Welcome, ${name}!`);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('erudio_user');
    toast.success('Signed out successfully');
  };

  const addTimeBlock = (block: TimeBlock) => {
    setTimetable((prev) => [...prev, block]);
    toast.success("Added to timetable");
  };

  const updateTimeBlock = (updatedBlock: TimeBlock) => {
    setTimetable((prev) =>
      prev.map((b) =>
        b.id === updatedBlock.id ? updatedBlock : b,
      ),
    );
  };

  const generateLessonPlan = (_preferences: any) => {
    setTimeout(() => {
      const newBlocks: TimeBlock[] = [
        {
          id: `gen-${Date.now()}-1`,
          day: "Tuesday",
          startTime: "16:00",
          endTime: "18:00",
          type: "Study",
          title: "Generated Study Session",
        },
        {
          id: `gen-${Date.now()}-2`,
          day: "Wednesday",
          startTime: "16:00",
          endTime: "17:00",
          type: "Revision",
          title: "Generated Revision",
        },
      ];
      setTimetable((prev) => [...prev, ...newBlocks]);
      toast.success("Lesson plan generated!");
    }, 1500);
  };

  const addRecentActivity = (activity: RecentActivity) => {
    setRecentActivity((prev) => [activity, ...prev]);
  };

  const createNewChat = (
    subjectId?: string,
    topicId?: string,
  ) => {
    const newId = `chat-${Date.now()}`;
    const newChat: ChatSession = {
      id: newId,
      title: topicId
        ? `Chat about ${topics.find((t) => t.id === topicId)?.name}`
        : "New AI Chat",
      timestamp: new Date().toISOString(),
      subjectId,
      topicId,
      messages: [],
    };
    setChatHistory((prev) => [newChat, ...prev]);
    return newId;
  };

  const sendMessage = (chatId: string, content: string) => {
    setChatHistory((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: `msg-${Date.now()}`,
                role: "user",
                content,
                timestamp: new Date().toISOString(),
              },
              {
                id: `msg-${Date.now()}+1`,
                role: "assistant",
                content:
                  "This is a simulated AI response to your query. In a real app, this would come from an LLM.",
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return chat;
      }),
    );
  };

  const scheduleRevision = (topicId: string, _date: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      addTimeBlock({
        id: `rev-${Date.now()}`,
        day: "Friday",
        startTime: "18:00",
        endTime: "19:00",
        type: "Revision",
        subjectId: topic.subjectId,
        topicId,
        title: `Revise: ${topic.name}`,
      });
      toast.success(`Revision scheduled for ${topic.name}`);
    }
  };

  const updateTopicStatus = (
    topicId: string,
    score: number,
  ) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
            ...t,
            score,
            status: score >= 80 ? "Mastered" : "In progress",
          }
          : t,
      ),
    );
    toast.success(`Topic status updated!`);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        subjects,
        topics,
        timetable,
        recentActivity,
        notifications,
        exams,
        chatHistory,
        addTimeBlock,
        updateTimeBlock,
        generateLessonPlan,
        addRecentActivity,
        createNewChat,
        sendMessage,
        scheduleRevision,
        updateTopicStatus,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(
      "useApp must be used within an AppProvider",
    );
  }
  return context;
};