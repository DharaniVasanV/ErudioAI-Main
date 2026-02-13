import React from 'react';
import { useApp } from '@/app/context/AppContext';
import { Card, Badge } from '@/app/components/ui/Base';
import { MessageSquare, BrainCircuit, PlayCircle, Clock } from 'lucide-react';

export const History = () => {
  const { recentHistory } = useApp();

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-slate-900">Your Learning History</h1>
      
      <div className="space-y-4">
        {recentHistory.map((session) => (
            <Card key={session.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    session.type === 'Chat' ? 'bg-blue-100 text-blue-600' :
                    session.type === 'Quiz' ? 'bg-orange-100 text-orange-600' :
                    session.type === 'Video' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                }`}>
                    {session.type === 'Chat' && <MessageSquare size={20} />}
                    {session.type === 'Quiz' && <BrainCircuit size={20} />}
                    {session.type === 'Video' && <PlayCircle size={20} />}
                    {session.type === 'Revision' && <Clock size={20} />}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900">{session.title}</h3>
                        <span className="text-xs text-slate-400">{session.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <Badge variant="default" className="text-[10px] px-1.5 py-0.5">{session.subject}</Badge>
                         <span className="text-xs text-slate-500">{session.type} Session</span>
                    </div>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
};
