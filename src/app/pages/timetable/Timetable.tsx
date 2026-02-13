import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Card, Button, Badge } from '@/app/components/ui/Base';
import { ChevronLeft, ChevronRight, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/app/components/ui/Base';

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const Timetable = () => {
  const { timetable, regeneratePlan } = useApp();
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  // Helper to find blocks in a slot
  const getBlocksForSlot = (day: string, hour: string) => {
    return timetable.filter(t => t.day === day && t.startTime.startsWith(hour.split(':')[0]));
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Your Schedule</h1>
           <p className="text-slate-500">Focus on the highlighted blocks.</p>
        </div>
        <Button onClick={() => setShowRegenerateModal(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <Sparkles size={16} /> AI Optimize
        </Button>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Row */}
        <div className="grid grid-cols-8 border-b border-slate-200">
          <div className="p-4 text-xs font-semibold text-slate-400 border-r border-slate-100 text-center">TIME</div>
          {DAYS.map(day => (
            <div key={day} className="p-4 text-center text-sm font-bold text-slate-700 border-r border-slate-100 last:border-0">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 min-h-[100px] border-b border-slate-100 last:border-0">
              {/* Time Label */}
              <div className="p-2 text-xs font-medium text-slate-400 border-r border-slate-100 text-center pt-4 sticky left-0 bg-white">
                {hour}
              </div>

              {/* Day Columns */}
              {DAYS.map((day) => {
                const blocks = getBlocksForSlot(day, hour);
                return (
                  <div key={`${day}-${hour}`} className="border-r border-slate-100 relative p-1 group transition-colors hover:bg-slate-50">
                    {blocks.map(block => (
                      <div 
                        key={block.id}
                        className={cn(
                          "absolute inset-x-1 p-2 rounded-lg text-xs border shadow-sm cursor-pointer hover:scale-[1.02] transition-transform z-10",
                          block.type === 'Class' ? "bg-slate-100 border-slate-200 text-slate-600 top-1 bottom-1 opacity-70" :
                          block.type === 'Study' ? "bg-indigo-100 border-indigo-200 text-indigo-800 top-1 bottom-1" :
                          "bg-orange-100 border-orange-200 text-orange-800 top-1 bottom-1"
                        )}
                      >
                        <div className="font-bold truncate">{block.subject}</div>
                        <div className="opacity-90 truncate">{block.topic}</div>
                        <div className="mt-1 opacity-75 text-[10px] uppercase">{block.type}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* AI Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Optimize with AI</h2>
              <p className="text-slate-500 text-sm">How should we adjust your plan?</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {['Focus on weak topics', 'Balance my workload', 'Prepare for upcoming Math Exam'].map((opt) => (
                <button key={opt} className="w-full p-3 text-left border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-sm font-medium text-slate-700">
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowRegenerateModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => { regeneratePlan(); setShowRegenerateModal(false); }}>Apply Changes</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
