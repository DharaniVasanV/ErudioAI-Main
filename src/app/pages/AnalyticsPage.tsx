import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Flame, Trophy, Clock, Target, FileText } from 'lucide-react';

export const AnalyticsPage = () => {
  const { subjects, user } = useApp();
  const navigate = useNavigate();

  const progressData = subjects.map(s => ({
    name: s.name,
    progress: s.progress,
    color: s.color.replace('bg-', 'text-').replace('-500', '') // Rough mapping, better to use hex
  }));

  const COLORS = ['#6366f1', '#a855f7', '#22c55e', '#ec4899'];

  const pieData = [
    { name: 'Mastered', value: 35 },
    { name: 'In Progress', value: 45 },
    { name: 'Weak', value: 20 },
  ];

  const PIE_COLORS = ['#22c55e', '#6366f1', '#ef4444'];

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <h1 className="text-2xl font-bold text-slate-900">Your Progress</h1>
         <button 
           onClick={() => navigate('/reports')}
           className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
         >
           <FileText size={18} />
           Download Report
         </button>
       </div>
       
       {/* Stats Cards */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-2">
                <Flame size={20} />
             </div>
             <p className="text-2xl font-bold text-slate-900">{user?.streak || 0}</p>
             <p className="text-xs text-slate-500 uppercase font-bold">Day Streak</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
                <Trophy size={20} />
             </div>
             <p className="text-2xl font-bold text-slate-900">1,240</p>
             <p className="text-xs text-slate-500 uppercase font-bold">XP Earned</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                <Clock size={20} />
             </div>
             <p className="text-2xl font-bold text-slate-900">12h</p>
             <p className="text-xs text-slate-500 uppercase font-bold">Study Time</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <Target size={20} />
             </div>
             <p className="text-2xl font-bold text-slate-900">85%</p>
             <p className="text-xs text-slate-500 uppercase font-bold">Quiz Avg</p>
          </div>
       </div>

       <div className="grid lg:grid-cols-2 gap-6">
          {/* Subject Progress Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">Subject Mastery</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={progressData} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={20}>
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Topic Status Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">Topic Status Distribution</h3>
             <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-4 mt-4">
                {pieData.map((entry, index) => (
                   <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                      <span className="text-xs text-slate-600">{entry.name}</span>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};