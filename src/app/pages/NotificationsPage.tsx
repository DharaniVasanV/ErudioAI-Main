import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { 
  Bell, 
  Clock, 
  CalendarClock, 
  Lightbulb, 
  Video, 
  Calendar, 
  Trophy, 
  MessageSquare, 
  TrendingUp,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { NotificationType } from '@/app/types';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'study_reminder':
      return Clock;
    case 'weekly_revision':
      return CalendarClock;
    case 'suggested_revision':
      return Lightbulb;
    case 'scheduled_revision':
      return Calendar;
    case 'remedial_content':
      return Video;
    case 'plan_update':
      return TrendingUp;
    case 'exam_alert':
      return Bell;
    case 'achievement':
      return Trophy;
    case 'chat_notes':
      return MessageSquare;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'study_reminder':
      return 'text-blue-600 bg-blue-50';
    case 'weekly_revision':
      return 'text-purple-600 bg-purple-50';
    case 'suggested_revision':
      return 'text-orange-600 bg-orange-50';
    case 'scheduled_revision':
      return 'text-indigo-600 bg-indigo-50';
    case 'remedial_content':
      return 'text-red-600 bg-red-50';
    case 'plan_update':
      return 'text-teal-600 bg-teal-50';
    case 'exam_alert':
      return 'text-yellow-600 bg-yellow-50';
    case 'achievement':
      return 'text-green-600 bg-green-50';
    case 'chat_notes':
      return 'text-cyan-600 bg-cyan-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead } = useApp();

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // Mark as read
    markNotificationAsRead(notification.id);

    // Navigate based on action type
    switch (notification.actionType) {
      case 'timetable':
        navigate('/timetable');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'topic':
        if (notification.actionId) {
          navigate(`/lessons/${notification.actionId}`);
        }
        break;
      case 'video':
        if (notification.actionId) {
          navigate(`/video/${notification.actionId}`);
        }
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'chat':
        if (notification.actionId) {
          navigate(`/chat/${notification.actionId}`);
        } else {
          navigate('/chat');
        }
        break;
      case 'revision':
        if (notification.actionId) {
          navigate(`/revision/${notification.actionId}`);
        }
        break;
      default:
        navigate('/dashboard');
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm">
            {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Unread Section */}
      {unreadNotifications.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            New
          </h2>
          <div className="space-y-2">
            {unreadNotifications.map(notification => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);
              
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full bg-white border-l-4 border-indigo-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className={clsx('p-2.5 rounded-lg shrink-0', colorClass)}>
                      <Icon size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 leading-tight">
                          {notification.title}
                        </h3>
                        <ChevronRight 
                          size={18} 
                          className="text-gray-400 group-hover:text-indigo-600 transition-colors shrink-0 mt-0.5" 
                        />
                      </div>
                      <p className="text-sm text-slate-600 mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Read Section */}
      {readNotifications.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Earlier
          </h2>
          <div className="space-y-2">
            {readNotifications.map(notification => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);
              
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className={clsx('p-2.5 rounded-lg shrink-0 opacity-70', colorClass)}>
                      <Icon size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-slate-700 leading-tight">
                          {notification.title}
                        </h3>
                        <ChevronRight 
                          size={18} 
                          className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 mt-0.5" 
                        />
                      </div>
                      <p className="text-sm text-slate-500 mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">All caught up!</h3>
          <p className="text-slate-500">You have no notifications at the moment.</p>
        </div>
      )}
    </div>
  );
};
