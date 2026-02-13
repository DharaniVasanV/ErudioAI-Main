import { Plus, BookOpen, Brain, Calendar, MessageSquare, PieChart, Play, CheckCircle, Clock, AlertCircle, TrendingUp, ChevronRight, Upload, Search, Mic, ArrowLeft, RefreshCw, Star, Filter, Bell, X, Video } from "lucide-react";

export type Subject = {
  id: string;
  name: string;
  color: string;
  progress: number;
  topics: Topic[];
};

export type Topic = {
  id: string;
  subjectId: string;
  name: string;
  status: "not-started" | "in-progress" | "mastered";
  importance: "low" | "medium" | "high";
  lastScore?: number;
  nextRevision?: string; // ISO date string
  hasRemedial?: boolean;
};

export type TimetableBlock = {
  id: string;
  day: string; // Mon, Tue, etc.
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  type: "class" | "study" | "revision";
  subjectId?: string;
  topicId?: string;
  title: string;
};

export type HistoryItem = {
  id: string;
  type: "chat" | "quiz" | "video" | "revision";
  title: string;
  timestamp: string; // ISO date string
  subjectId?: string;
  topicId?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string;
};

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    color: "bg-blue-500",
    progress: 65,
    topics: [
      { id: "math-1", subjectId: "math", name: "Quadratic Equations", status: "mastered", importance: "high", lastScore: 85, nextRevision: new Date(Date.now() + 86400000 * 2).toISOString() },
      { id: "math-2", subjectId: "math", name: "Calculus: Derivatives", status: "in-progress", importance: "high", lastScore: 45, hasRemedial: true },
      { id: "math-3", subjectId: "math", name: "Complex Numbers", status: "not-started", importance: "medium" },
    ],
  },
  {
    id: "phys",
    name: "Physics",
    color: "bg-purple-500",
    progress: 40,
    topics: [
      { id: "phys-1", subjectId: "phys", name: "Kinematics 1D", status: "mastered", importance: "medium", lastScore: 90 },
      { id: "phys-2", subjectId: "phys", name: "Newton's Laws", status: "in-progress", importance: "high", lastScore: 60, nextRevision: new Date(Date.now() - 86400000).toISOString() }, // Overdue
      { id: "phys-3", subjectId: "phys", name: "Thermodynamics", status: "not-started", importance: "high" },
    ],
  },
  {
    id: "cs",
    name: "Computer Science",
    color: "bg-green-500",
    progress: 80,
    topics: [
      { id: "cs-1", subjectId: "cs", name: "Arrays & Strings", status: "mastered", importance: "high" },
      { id: "cs-2", subjectId: "cs", name: "Pointers in C", status: "in-progress", importance: "high", lastScore: 50, hasRemedial: true },
      { id: "cs-3", subjectId: "cs", name: "Data Structures Intro", status: "not-started", importance: "medium" },
    ],
  },
];

export const MOCK_TIMETABLE: TimetableBlock[] = [
  // Monday
  { id: "t-1", day: "Mon", startTime: "09:00", endTime: "10:00", type: "class", title: "Math Class" },
  { id: "t-2", day: "Mon", startTime: "10:00", endTime: "11:00", type: "class", title: "Physics Class" },
  { id: "t-3", day: "Mon", startTime: "17:00", endTime: "18:00", type: "study", subjectId: "math", topicId: "math-2", title: "Study: Derivatives" },
  { id: "t-4", day: "Mon", startTime: "18:30", endTime: "19:00", type: "revision", subjectId: "phys", topicId: "phys-1", title: "Revise: Kinematics" },
  
  // Tuesday
  { id: "t-5", day: "Tue", startTime: "09:00", endTime: "11:00", type: "class", title: "CS Lab" },
  { id: "t-6", day: "Tue", startTime: "16:00", endTime: "17:30", type: "study", subjectId: "cs", topicId: "cs-2", title: "Study: Pointers" },
];

export const MOCK_HISTORY: HistoryItem[] = [
  { id: "h-1", type: "chat", title: "Algebra – Quadratic Equations", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), subjectId: "math", topicId: "math-1" },
  { id: "h-2", type: "quiz", title: "Physics – Kinematics Quiz", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), subjectId: "phys", topicId: "phys-1" },
  { id: "h-3", type: "video", title: "Fix your weak spot: Pointers", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), subjectId: "cs", topicId: "cs-2" },
  { id: "h-4", type: "revision", title: "Revision: Newton's Laws", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), subjectId: "phys", topicId: "phys-2" },
];

export const TRENDING_TOPICS = [
  { id: "math-1", title: "Quadratic Equations", subject: "Math" },
  { id: "cs-1", title: "Arrays in Java", subject: "CS" },
  { id: "chem-1", title: "Organic Chemistry", subject: "Chemistry" },
  { id: "bio-1", title: "Genetics Basics", subject: "Biology" },
];
