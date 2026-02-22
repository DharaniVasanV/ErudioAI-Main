import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Trash2, Plus, Clock, ChevronRight } from 'lucide-react';
import { config } from '@/lib/config';
import { formatDistanceToNow } from 'date-fns';

type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

export const ChatHistoryPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${config.api.baseUrl}/chat/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation(); // Don't navigate when clicking delete
    setDeletingId(convId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${config.api.baseUrl}/chat/${convId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== convId));
      }
    } catch (err) {
      console.error('Failed to delete conversation', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleContinue = (conv: Conversation) => {
    navigate(`/chat/${conv.id}`);
  };

  const handleNewChat = () => {
    navigate('/chat');
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chat History</h1>
          <p className="text-slate-500 text-sm mt-1">Continue any past conversation or start fresh</p>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No conversations yet</h3>
          <p className="text-slate-500 text-sm mb-5">Start your first AI chat to see your history here</p>
          <button
            onClick={handleNewChat}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
          >
            Start a Chat
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleContinue(conv)}
              className="group bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:border-indigo-200 hover:shadow-sm cursor-pointer transition-all"
            >
              {/* Icon */}
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                <MessageSquare size={18} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{conv.title}</h3>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                  <Clock size={11} />
                  <span>{formatDistanceToNow(new Date(conv.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  disabled={deletingId === conv.id}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete conversation"
                >
                  {deletingId === conv.id ? (
                    <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin block" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
                <div className="p-2 rounded-lg text-slate-400 group-hover:text-indigo-500">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
