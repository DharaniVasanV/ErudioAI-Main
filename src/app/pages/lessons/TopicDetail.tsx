import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Card, Button, Badge } from '@/app/components/ui/Base';
import { Play, FileText, CheckCircle, BrainCircuit, Clock, ArrowLeft } from 'lucide-react';
import { cn } from '@/app/components/ui/Base';

export const TopicDetail = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'revision'>('learn');
  const { subjects } = useApp();

  const subject = subjects.find(s => s.id === subjectId);
  const topic = subject?.topics.find(t => t.id === topicId);

  if (!topic) return <div>Topic not found</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0 hover:bg-transparent hover:text-indigo-600">
        <ArrowLeft size={18} className="mr-2" /> Back to Lessons
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <Badge variant="info">{subject?.name}</Badge>
            {topic.isWeak && <Badge variant="danger">Weak Area</Badge>}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{topic.name}</h1>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        {[
            { id: 'learn', label: 'Learn', icon: BookIcon },
            { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
            { id: 'revision', label: 'Revision Schedule', icon: Clock },
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                    "flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id 
                        ? "border-indigo-600 text-indigo-600" 
                        : "border-transparent text-slate-500 hover:text-slate-800"
                )}
            >
                <tab.icon size={18} />
                {tab.label}
            </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'learn' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <Play className="text-white w-16 h-16 relative z-10 opacity-90 group-hover:scale-110 transition-transform" />
                    <p className="absolute bottom-4 left-4 text-white font-medium z-10">Watch: Understanding {topic.name}</p>
                </Card>
                
                <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Key Concepts</h3>
                    <div className="prose prose-slate">
                        <p className="text-slate-600 mb-4">
                            Detailed AI-generated summary of {topic.name} goes here. This would cover the fundamental definitions, formulas, and key properties you need to remember for your exam.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Concept point one regarding {topic.name}.</li>
                            <li>Important formula or equation.</li>
                            <li>Common pitfalls and mistakes.</li>
                        </ul>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <Button className="gap-2">
                            <CheckCircle size={18} /> Mark as Studied
                        </Button>
                    </div>
                </Card>
            </div>
        )}

        {activeTab === 'quiz' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                        <BrainCircuit size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Test your knowledge</h2>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">Take a quick 5-minute quiz to identify weak spots. We'll generate a remedial plan based on your score.</p>
                    <Button size="lg" onClick={() => navigate(`/quiz/${topic.id}`)}>Start Quiz</Button>
                </Card>
                
                {topic.score && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-sm font-medium text-slate-700">Last attempt score: <span className={topic.score > 70 ? "text-green-600" : "text-red-600"}>{topic.score}%</span></p>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'revision' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Schedule Next Revision</h3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <button className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-center transition-all">
                            <span className="block text-lg font-bold text-indigo-600">3 Days</span>
                            <span className="text-xs text-slate-500">Recommended</span>
                        </button>
                         <button className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-center transition-all">
                            <span className="block text-lg font-bold text-slate-700">1 Week</span>
                            <span className="text-xs text-slate-500">Standard</span>
                        </button>
                         <button className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-center transition-all">
                            <span className="block text-lg font-bold text-slate-700">Custom</span>
                            <span className="text-xs text-slate-500">Pick date</span>
                        </button>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 mb-3">Revision History</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-slate-600">Jan 20, 2024</span>
                            <Badge variant="success">Completed</Badge>
                        </div>
                    </div>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
};

const BookIcon = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
);
