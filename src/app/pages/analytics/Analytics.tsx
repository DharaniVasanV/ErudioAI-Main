import React from 'react';
import { Card, Button } from '@/app/components/ui/Base';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DATA_PROGRESS = [
  { name: 'Math', completed: 65, remaining: 35 },
  { name: 'Physics', completed: 40, remaining: 60 },
  { name: 'CS', completed: 80, remaining: 20 },
];

const DATA_WEAKNESS = [
  { name: 'Strong', value: 12, color: '#22c55e' },
  { name: 'Weak', value: 5, color: '#ef4444' },
  { name: 'Review Needed', value: 8, color: '#f97316' },
];

export const Analytics = () => {
  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Syllabus Coverage</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_PROGRESS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="completed" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Topic Mastery</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA_WEAKNESS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DATA_WEAKNESS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
             {DATA_WEAKNESS.map(d => (
                 <div key={d.name} className="flex items-center gap-1 text-xs text-slate-600">
                     <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                     {d.name}
                 </div>
             ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-xl font-bold mb-2">Exam Readiness Prediction</h2>
          <div className="flex items-end gap-4">
              <div className="text-4xl font-bold">72%</div>
              <p className="mb-2 text-indigo-100 text-sm">Probability of scoring A grade based on current pace.</p>
          </div>
          <div className="mt-4 bg-black/20 rounded-full h-2 overflow-hidden">
              <div className="bg-white h-full w-[72%] rounded-full" />
          </div>
      </Card>
    </div>
  );
};
