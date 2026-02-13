import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Card, Button, Badge } from '@/app/components/ui/Base';
import { BookOpen, ChevronRight, CheckCircle2, PlayCircle, BrainCircuit } from 'lucide-react';

export const Lessons = () => {
  const { subjects } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Subjects & Topics</h1>
      
      <div className="grid gap-6">
        {subjects.map(subject => (
          <Card key={subject.id} className="overflow-hidden">
            <div className={`h-2 ${subject.color}`} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{subject.name}</h2>
                  <p className="text-sm text-slate-500">{subject.progress}% Mastered</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 relative">
                    <span className="z-10">{subject.progress}%</span>
                    <svg className="absolute inset-0 w-full h-full -rotate-90 text-indigo-600" viewBox="0 0 36 36">
                        <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path className={`${subject.color.replace('bg-', 'text-')}`} strokeDasharray={`${subject.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                </div>
              </div>

              <div className="space-y-3">
                {subject.topics.map(topic => (
                  <div 
                    key={topic.id} 
                    onClick={() => navigate(`/lessons/${subject.id}/${topic.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:shadow-sm hover:bg-slate-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {topic.status === 'mastered' ? (
                        <CheckCircle2 className="text-green-500" size={20} />
                      ) : topic.status === 'in-progress' ? (
                        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" /> // Static icon preferred usually but maybe clock
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{topic.name}</p>
                        <div className="flex items-center gap-2">
                            {topic.isWeak && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">WEAK SPOT</span>}
                            {topic.hasRemedial && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1"><PlayCircle size={10} /> VIDEO</span>}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-300" size={20} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
