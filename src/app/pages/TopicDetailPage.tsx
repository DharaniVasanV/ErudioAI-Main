import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import {
  ArrowLeft, BrainCircuit, Play, Loader2, BookCheck, FileText, Check, CalendarClock, Mic
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { config } from '@/lib/config';

type TopicContent = {
  introduction: string;
  key_concepts: string[];
  formulas: string[];
  example_problem: {
    question: string;
    solution: string;
  };
};

export const TopicDetailPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { topics, scheduleRevision, createNewChat } = useApp();
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'revision' | 'notes'>('learn');
  const [userNotes, setUserNotes] = useState(() => localStorage.getItem(`topic_notes_${topicId}`) || '');
  const [topicContent, setTopicContent] = useState<TopicContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const topic = topics.find(t => t.id === topicId);

  // Study timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      // Update global study time
      const totalSeconds = parseInt(localStorage.getItem('study_time_seconds') || '0');
      localStorage.setItem('study_time_seconds', (totalSeconds + 10).toString()); // Increment by interval
    }, 10000);

    return () => {
      clearInterval(interval);
      // Final update on unmount
      const endTime = Date.now();
      const finalSessionSeconds = Math.floor((endTime - startTime) / 1000);
      const totalSeconds = parseInt(localStorage.getItem('study_time_seconds') || '0');
      // We only add the remainder since the last 10s increment
      localStorage.setItem('study_time_seconds', (totalSeconds + (finalSessionSeconds % 10)).toString());
    };
  }, []);

  useEffect(() => {
    if (!topic) return;

    const fetchContent = async () => {
      // Try cache first
      const cacheKey = `topic_content_${topicId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setTopicContent(JSON.parse(cached));
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${config.api.baseUrl}/chat/generate-topic-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ topic_name: topic.name })
        });
        const data = await res.json();
        setTopicContent(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to generate topic content:', error);
        toast.error('Failed to load study material');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [topicId, topic]);

  const handleSaveNotes = () => {
    localStorage.setItem(`topic_notes_${topicId}`, userNotes);
    toast.success('Notes saved successfully');
  };

  const handleScheduleRevision = (_dateDesc: string) => {
    scheduleRevision(topic!.id, '2023-11-01'); // Mock date
  };

  const startAiChat = () => {
    const chatId = createNewChat(topic!.subjectId, topic!.id);
    navigate(`/chat/${chatId}`);
  };

  const handleMarkAsStudied = () => {
    toast.success('Topic marked as studied! Take a quiz to track your progress.');
  };

  if (!topic) return <div className="p-8 text-center">Topic not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/lessons')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{topic.name}</h1>
          <p className="text-slate-500 text-sm">Status: <span className="font-medium text-indigo-600">{topic.status}</span></p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        {[
          { id: 'learn', label: 'Learn', icon: Play },
          { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
          { id: 'revision', label: 'Revision', icon: CalendarClock },
          { id: 'notes', label: 'My Notes', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={clsx(
              "flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px] p-6">

        {activeTab === 'learn' && (
          <div className="max-w-3xl mx-auto space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500">AI is preparing your study material...</p>
              </div>
            ) : (
              <>
                {/* Main Study Content */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction to {topic.name}</h2>

                    <div className="prose prose-slate max-w-none mb-6">
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {topicContent?.introduction}
                      </p>
                    </div>

                    {/* Key Points */}
                    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg mb-6">
                      <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        <BookCheck size={20} />
                        Key Concepts
                      </h3>
                      <ul className="space-y-2 text-slate-700">
                        {topicContent?.key_concepts.map((concept, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold mt-0.5">•</span>
                            <span>{concept}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Formulas */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-bold text-slate-900 mb-3">Important Formulas & Definitions</h3>
                      <div className="space-y-2">
                        {topicContent?.formulas.map((formula, i) => (
                          <div key={i} className="font-mono text-sm bg-white p-3 rounded border border-gray-200 text-slate-700">
                            {formula}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Example Problem */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-bold text-amber-900 mb-2">Example Problem</h3>
                      <p className="text-slate-700 mb-3">
                        <strong>Question:</strong> {topicContent?.example_problem.question}
                      </p>
                      <p className="text-slate-700">
                        <strong>Solution:</strong> {topicContent?.example_problem.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* AI-Generated Video Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Watch Explanation Video</h3>
              <p className="text-sm text-slate-500 mb-4">AI-generated video based on this topic's content</p>
              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative group cursor-pointer overflow-hidden">
                <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Video thumbnail" />
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border-2 border-white group-hover:scale-110 transition-transform z-10">
                  <Play size={32} fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <button
                onClick={handleMarkAsStudied}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Check size={18} /> Mark as Studied
              </button>
              <button
                onClick={() => navigate('/quiz', { state: { topicId: topic.id, topicName: topic.name } })}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <BrainCircuit size={18} /> Start Quiz
              </button>
              <button
                onClick={() => setActiveTab('revision')}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <CalendarClock size={18} /> Add Revision Schedule
              </button>
              <button
                onClick={startAiChat}
                className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                <Mic size={18} /> Ask AI Assistant
              </button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <BrainCircuit size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Test your knowledge</h3>
            <p className="text-slate-500 max-w-md mb-6">Take a quick 5-question quiz to assess your understanding of {topic.name}.</p>
            <button
              onClick={() => navigate('/quiz', { state: { topicId: topic.id, topicName: topic.name } })}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
            >
              Start Quiz
            </button>
          </div>
        )}

        {activeTab === 'revision' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Schedule Next Revision</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <button onClick={() => handleScheduleRevision('3 days')} className="p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center">
                  <span className="block text-2xl font-bold text-indigo-600 mb-1">3</span>
                  <span className="text-sm text-gray-600">Days</span>
                </button>
                <button onClick={() => handleScheduleRevision('1 week')} className="p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center">
                  <span className="block text-2xl font-bold text-indigo-600 mb-1">1</span>
                  <span className="text-sm text-gray-600">Week</span>
                </button>
                <button className="p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center flex items-center justify-center flex-col gap-1">
                  <CalendarClock size={24} className="text-indigo-600" />
                  <span className="text-sm text-gray-600">Custom</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Smart Revision Material</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                    <BrainCircuit size={18} className="text-indigo-600" />
                    AI Summary Notes
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Auto-generated</span>
                </div>
                <div className="p-4 prose prose-sm prose-slate max-w-none">
                  <p className="mb-2"><strong>Key Concepts:</strong></p>
                  <ul className="mt-0">
                    {topicContent?.key_concepts.slice(0, 3).map((concept, i) => (
                      <li key={i}>{concept}</li>
                    ))}
                  </ul>
                  {topicContent?.formulas.length ? (
                    <>
                      <p className="mb-2 mt-4"><strong>Key Formula:</strong></p>
                      <p className="bg-gray-50 p-2 rounded border border-gray-100 font-mono text-xs">{topicContent.formulas[0]}</p>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Revision History</h3>
              <div className="space-y-4">
                {topic.lastRevised ? (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <Check size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Last Revised</p>
                      <p className="text-sm text-slate-500">{topic.lastRevised}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No revisions yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">My Study Notes</h3>
              <button
                onClick={handleSaveNotes}
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save Notes
              </button>
            </div>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Type your personal notes, questions, or key takeaways here..."
              className="w-full flex-1 min-h-[400px] p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none text-slate-700 leading-relaxed"
            />
            <p className="text-xs text-slate-400 mt-2 text-right">Last saved: Just now</p>
          </div>
        )}
      </div>
    </div>
  );
};