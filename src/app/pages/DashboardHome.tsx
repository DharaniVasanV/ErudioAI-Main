import { useNavigate } from 'react-router-dom';
import { MessageSquare, UploadCloud, CalendarDays, Flame, Circle } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export const DashboardHome = () => {
  const { user, recentActivity, timetable, exams, createNewChat, topics, notifications } = useApp();
  const navigate = useNavigate();

  const handleNewChat = () => {
    const chatId = createNewChat();
    navigate(`/chat/${chatId}`);
  };

  const currentDay = format(new Date(), 'EEEE');
  const todaysPlan = timetable
    .filter(t => t.day === currentDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  const nextExam = exams[0];
  const examDaysRemaining = nextExam
    ? Math.ceil((new Date(nextExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Get high-priority unread notifications for inline banners
  const priorityNotifications = notifications
    .filter(n => !n.read && n.priority === 'high')
    .slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Priority Notification Banners */}
      {priorityNotifications.length > 0 && (
        <div className="space-y-3">
          {priorityNotifications.map(notification => {
            let bgColor = 'bg-orange-50';
            let borderColor = 'border-orange-200';
            let textColor = 'text-orange-800';
            let buttonColor = 'bg-orange-600 hover:bg-orange-700';

            if (notification.type === 'remedial_content') {
              bgColor = 'bg-red-50';
              borderColor = 'border-red-200';
              textColor = 'text-red-800';
              buttonColor = 'bg-red-600 hover:bg-red-700';
            } else if (notification.type === 'exam_alert') {
              bgColor = 'bg-yellow-50';
              borderColor = 'border-yellow-200';
              textColor = 'text-yellow-800';
              buttonColor = 'bg-yellow-600 hover:bg-yellow-700';
            } else if (notification.type === 'weekly_revision') {
              bgColor = 'bg-purple-50';
              borderColor = 'border-purple-200';
              textColor = 'text-purple-800';
              buttonColor = 'bg-purple-600 hover:bg-purple-700';
            }

            return (
              <div
                key={notification.id}
                className={clsx(
                  'p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                  bgColor,
                  borderColor
                )}
              >
                <div className="flex-1">
                  <h3 className={clsx('font-bold text-sm mb-1', textColor)}>
                    {notification.title}
                  </h3>
                  <p className={clsx('text-sm', textColor, 'opacity-90')}>
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (notification.actionType === 'video' && notification.actionId) {
                      navigate(`/video/${notification.actionId}`);
                    } else if (notification.actionType === 'topic' && notification.actionId) {
                      navigate(`/lessons/${notification.actionId}`);
                    } else if (notification.actionType === 'timetable') {
                      navigate('/timetable');
                    } else {
                      navigate('/notifications');
                    }
                  }}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-white font-medium text-sm whitespace-nowrap transition-colors',
                    buttonColor
                  )}
                >
                  {notification.type === 'remedial_content' ? 'Watch Now' :
                    notification.type === 'weekly_revision' ? 'Review Now' :
                      notification.type === 'suggested_revision' ? 'Start Revision' :
                        'View'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. Header & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* New Chat Card */}
        <button
          onClick={handleNewChat}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left group flex flex-col justify-between h-40"
        >
          <div className="bg-indigo-50 w-10 h-10 rounded-full flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-110 transition-transform">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">New AI Chat</h3>
            <p className="text-slate-500 text-sm">Ask doubts, generate questions, or explain any concept.</p>
          </div>
        </button>

        {/* Upload & Setup Card */}
        <button
          onClick={() => navigate('/upload-setup')}
          className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all text-left group flex flex-col justify-between h-40"
        >
          <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
            <UploadCloud size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Upload Syllabus & Setup</h3>
            <p className="text-indigo-100 text-sm">Add your syllabus, academic calendar, and timetable.</p>
          </div>
        </button>
      </div>

      {/* 2. Streak & Exam Summary (Mobile/Tablet Friendly) */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3 shadow-sm">
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
            <Flame size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Current Streak</p>
            <p className="text-lg font-bold text-slate-900">{user?.streak || 0} Days</p>
          </div>
        </div>

        {nextExam && (
          <div className="flex-[2] bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3 shadow-sm">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Upcoming Exam</p>
              <p className="text-lg font-bold text-slate-900">
                {nextExam.name}
                <span className="text-slate-400 font-normal text-sm ml-2">
                  {examDaysRemaining !== null ? (
                    examDaysRemaining > 0 ? `in ${examDaysRemaining} days` :
                      examDaysRemaining === 0 ? 'Today!' :
                        `${Math.abs(examDaysRemaining)} days ago`
                  ) : 'No date set'}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Recent Studies (History) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Your recent studies</h2>
          <button onClick={() => navigate('/history')} className="text-indigo-600 text-sm font-medium hover:underline">View all history</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivity.slice(0, 6).map((activity) => (
            <div
              key={activity.id}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 cursor-pointer transition-colors"
              onClick={() => {
                if (activity.type === 'Chat') navigate(`/chat/${activity.refId}`);
                // Add other navigations as needed
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={clsx(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
                  activity.type === 'Chat' && "bg-blue-100 text-blue-700",
                  activity.type === 'Quiz' && "bg-purple-100 text-purple-700",
                  activity.type === 'Video' && "bg-pink-100 text-pink-700",
                  activity.type === 'Revision' && "bg-green-100 text-green-700",
                )}>
                  {activity.type}
                </span>
                <span className="text-xs text-slate-400">{activity.timestamp}</span>
              </div>
              <h4 className="font-semibold text-slate-800 line-clamp-1">{activity.title}</h4>
              {activity.subtitle && <p className="text-sm text-slate-500 mt-1">{activity.subtitle}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Today's Plan */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Today's Plan</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {todaysPlan.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {todaysPlan.map((block) => (
                <div key={block.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-16 text-center shrink-0">
                    <p className="text-sm font-bold text-slate-700">{block.startTime}</p>
                    <p className="text-xs text-slate-400">{block.endTime}</p>
                  </div>
                  <div className={clsx(
                    "w-1 self-stretch rounded-full",
                    block.type === 'Class' && "bg-gray-300",
                    block.type === 'Study' && "bg-indigo-500",
                    block.type === 'Revision' && "bg-orange-500",
                  )}></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{block.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 font-medium uppercase">{block.type}</span>
                      {block.subjectId && <span className="text-xs text-slate-400">• {topics.find(t => t.id === block.topicId)?.name || 'General'}</span>}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {/* Status toggle mock */}
                    <button className="text-slate-300 hover:text-green-500 transition-colors">
                      <Circle size={24} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-slate-50 text-center">
                <button onClick={() => navigate('/timetable')} className="text-sm font-medium text-indigo-600 hover:underline">View full timetable</button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <p>No study blocks scheduled for today.</p>
              <button onClick={() => navigate('/upload-setup')} className="mt-2 text-indigo-600 font-medium hover:underline">Create a plan</button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Trending / Suggested */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Trending topics students are learning</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {topics.filter(t => t.status !== 'Not started').map((topic) => (
            <button
              key={topic.id}
              onClick={() => navigate(`/lessons/${topic.id}`)}
              className="shrink-0 bg-white border border-slate-200 px-4 py-2 rounded-full text-slate-700 font-medium whitespace-nowrap hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              {topic.name}
            </button>
          ))}
          <button className="shrink-0 bg-white border border-slate-200 px-4 py-2 rounded-full text-slate-700 font-medium whitespace-nowrap">
            Probability Basics
          </button>
          <button className="shrink-0 bg-white border border-slate-200 px-4 py-2 rounded-full text-slate-700 font-medium whitespace-nowrap">
            Organic Chemistry
          </button>
        </div>
      </section>
    </div>
  );
};