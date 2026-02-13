import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Calendar, Trophy, Target, ChevronRight, FileText, Clock, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';

export const ExamsPage = () => {
  const { exams, subjects } = useApp();
  const navigate = useNavigate();

  const handleStartTest = (testType: 'weekly' | 'monthly') => {
    toast.success(`Starting ${testType} test...`);
    // Navigate to quiz page with test context
    navigate('/quiz', { state: { testType } });
  };

  const handleViewReport = () => {
    navigate('/reports');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exams & Tests</h1>
          <p className="text-slate-500">Prepare with practice tests and track upcoming exams</p>
        </div>
        <button 
          onClick={handleViewReport}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <FileText size={18} />
          View Reports
        </button>
      </div>

      {/* Upcoming Official Exams */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600" />
            Upcoming Official Exams
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {exams.length > 0 ? (
            exams.map(exam => (
              <div 
                key={exam.id}
                className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                onClick={() => navigate('/analytics')}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{exam.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Calendar size={14} />
                        {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className={clsx(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        exam.importance === 'High' && "bg-red-100 text-red-700",
                        exam.importance === 'Medium' && "bg-orange-100 text-orange-700",
                        exam.importance === 'Low' && "bg-gray-100 text-gray-700"
                      )}>
                        {exam.importance} importance
                      </span>
                    </div>
                  </div>
                  <button 
                    className="text-indigo-600 font-medium text-sm hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/analytics');
                    }}
                  >
                    View linked topics <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <AlertCircle size={48} className="mx-auto mb-2 opacity-50" />
              <p>No upcoming exams scheduled</p>
              <p className="text-sm mt-1">Add exams in your academic calendar during onboarding</p>
            </div>
          )}
        </div>
      </div>

      {/* Practice Tests */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <Trophy size={20} className="text-purple-600" />
            Practice Tests & Periodic Exams
          </h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weekly Test */}
          <div className="border border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-white hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Weekly Practice Test</h3>
            <p className="text-slate-600 text-sm mb-4">
              Short test based on what you studied this week. Takes about 15-20 minutes.
            </p>
            <div className="bg-purple-50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-medium text-purple-900 mb-1">This week's focus:</p>
              <ul className="text-purple-700 space-y-0.5 text-xs">
                {subjects.slice(0, 3).map(subject => (
                  <li key={subject.id}>• {subject.name}</li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => handleStartTest('weekly')}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Start Weekly Test
            </button>
          </div>

          {/* Monthly Test */}
          <div className="border border-indigo-200 rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-white hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Monthly Mock Exam</h3>
            <p className="text-slate-600 text-sm mb-4">
              Longer test simulating your real exam. Takes about 45-60 minutes.
            </p>
            <div className="bg-indigo-50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-medium text-indigo-900 mb-1">Comprehensive coverage:</p>
              <ul className="text-indigo-700 space-y-0.5 text-xs">
                <li>• All subjects from this month</li>
                <li>• Exam-style questions</li>
                <li>• Detailed performance report</li>
              </ul>
            </div>
            <button 
              onClick={() => handleStartTest('monthly')}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Start Monthly Exam
            </button>
          </div>
        </div>
      </div>

      {/* Test History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-slate-900">Recent Test Results</h2>
        </div>
        <div className="p-4 space-y-3">
          {/* Mock test results */}
          <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={handleViewReport}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                85%
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Weekly Test - Week 42</h4>
                <p className="text-sm text-slate-500">Completed 2 days ago</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={handleViewReport}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                78%
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Monthly Exam - October</h4>
                <p className="text-sm text-slate-500">Completed 1 week ago</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
