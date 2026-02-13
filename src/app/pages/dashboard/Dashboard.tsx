import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Card, Button, Badge } from '@/app/components/ui/Base';
import { MessageSquare, UploadCloud, Clock, PlayCircle, BookOpen, BrainCircuit, ChevronRight, Flame, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { user, recentHistory, timetable, exams } = useApp();
  const navigate = useNavigate();

  const todaysPlan = timetable.filter(t => t.day === 'Mon'); // Mocking 'Today' as Monday
  const nextExam = exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-slate-600">You're on a {user?.streak} day streak. Keep it up!</p>
        </div>
        
        {nextExam && (
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Next Exam</p>
              <p className="text-sm font-bold text-slate-900">{nextExam.name} in {Math.ceil((new Date(nextExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</p>
            </div>
          </div>
        )}
      </div>

      {/* Primary Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div 
          onClick={() => navigate('/chat')}
          className="group cursor-pointer bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <MessageSquare size={28} />
            </div>
            <ArrowIcon className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
          </div>
          <h2 className="text-xl font-bold mb-1">New AI Chat</h2>
          <p className="text-indigo-100 text-sm">Ask doubts, generate questions, or explain any concept step-by-step.</p>
        </div>

        <div 
          onClick={() => navigate('/upload-setup')}
          className="group cursor-pointer bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
        >
           <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <UploadCloud size={28} />
            </div>
            <ArrowIcon className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Upload Syllabus & Setup</h2>
          <p className="text-slate-500 text-sm">Add your syllabus, academic calendar, and timetable to generate a plan.</p>
        </div>
      </div>

      {/* Recent Studies */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" /> Your recent studies
          </h2>
          <Link to="/history" className="text-sm text-indigo-600 font-medium hover:underline">View all</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentHistory.slice(0, 4).map(session => (
            <Card 
              key={session.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
              onClick={() => {
                if (session.type === 'Chat') navigate('/chat');
                if (session.type === 'Quiz') navigate(`/quiz/demo`); // pointing to generic for now
                if (session.type === 'Video') navigate(`/video/demo`);
                if (session.type === 'Revision') navigate(`/revision/demo`);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant={
                  session.type === 'Chat' ? 'info' : 
                  session.type === 'Quiz' ? 'warning' : 
                  session.type === 'Video' ? 'default' : 'success'
                }>
                  {session.type}
                </Badge>
                <span className="text-xs text-slate-400">{session.timestamp.split(',')[1]}</span>
              </div>
              <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 flex-1">{session.title}</h3>
              <p className="text-xs text-slate-500 mt-auto">{session.subject}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending & Plan Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Today's Plan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={20} className="text-slate-400" /> Today's Plan
            </h2>
            <Link to="/timetable" className="text-sm text-indigo-600 font-medium hover:underline">Full timetable</Link>
          </div>
          
          <Card className="divide-y divide-slate-100">
            {todaysPlan.length > 0 ? todaysPlan.map((item, i) => (
              <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-16 text-center">
                  <p className="text-xs font-bold text-slate-900">{item.startTime}</p>
                  <p className="text-xs text-slate-400">{item.endTime}</p>
                </div>
                <div className={`w-1 h-10 rounded-full ${
                  item.type === 'Study' ? 'bg-indigo-500' : 
                  item.type === 'Revision' ? 'bg-orange-500' : 'bg-slate-300'
                }`} />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900">{item.subjectId}</h4>
                  <p className="text-xs text-slate-500">{item.topicId} • {item.type}</p>
                </div>
                <div className="text-right">
                  {i === 0 ? (
                    <Badge variant="success">In Progress</Badge>
                  ) : (
                    <Badge variant="default">Scheduled</Badge>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500">
                <p>No plan for today. Relax! 🌴</p>
              </div>
            )}
          </Card>
        </div>

        {/* Trending / Explore */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit size={20} className="text-slate-400" /> Explore
          </h2>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Trending Now</h3>
            <div className="flex flex-wrap gap-2">
              {['Quadratic Equations', 'Pointers', 'Probability', 'Electrostatics', 'World War II'].map(t => (
                <button key={t} className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium rounded-lg border border-slate-100 transition-colors">
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Weekly Focus</h3>
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                <div className="flex gap-3">
                  <div className="p-2 bg-white rounded-md text-orange-600 shadow-sm h-fit">
                    <RefreshCw size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Weekly Revision</p>
                    <p className="text-xs text-slate-600 mb-2">You have 5 topics to review from last week.</p>
                    <Button size="sm" variant="secondary" className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50">Start Session</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
