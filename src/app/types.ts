export type User = {
  id: string;
  name: string;
  email: string;
  level: 'School' | 'College' | 'Other';
  streak: number;
};

export type Subject = {
  id: string;
  name: string;
  progress: number; // 0-100
  color: string;
};

export type TopicStatus = 'Not started' | 'In progress' | 'Mastered';

export type Topic = {
  id: string;
  subjectId: string;
  name: string;
  status: TopicStatus;
  examRelevance?: string; // e.g. "Important for Midterm"
  score?: number;
  lastRevised?: string; // ISO date
  nextRevision?: string; // ISO date
  hasRemedialVideo?: boolean;
};

export type BlockType = 'Study' | 'Revision' | 'Class';

export type TimeBlock = {
  id: string;
  day: string; // "Monday", "Tuesday", etc.
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  type: BlockType;
  subjectId?: string;
  topicId?: string;
  title: string; // Display title
  isFixed?: boolean; // For school classes
};

export type ChatSession = {
  id: string;
  title: string;
  timestamp: string;
  subjectId?: string;
  topicId?: string;
  messages: ChatMessage[];
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type RecentActivity = {
  id: string;
  type: 'Chat' | 'Quiz' | 'Video' | 'Revision';
  title: string;
  subtitle?: string;
  timestamp: string;
  refId: string; // ID of the chat, topic, or quiz result
};

export type NotificationType = 
  | 'study_reminder'
  | 'weekly_revision'
  | 'suggested_revision'
  | 'scheduled_revision'
  | 'remedial_content'
  | 'plan_update'
  | 'exam_alert'
  | 'achievement'
  | 'chat_notes';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  priority?: 'high' | 'normal' | 'low';
  actionType?: 'timetable' | 'revision' | 'topic' | 'quiz' | 'video' | 'analytics' | 'chat' | 'dashboard';
  actionId?: string; // ID of topic, timetable block, chat, etc.
};

export type Exam = {
  id: string;
  name: string;
  date: string;
  importance: 'Low' | 'Medium' | 'High';
};