import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Download, Eye, Calendar, TrendingUp, Award, AlertCircle, FileText, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';

export const ReportsPage = () => {
  const { subjects, exams } = useApp();
  const navigate = useNavigate();
  const [viewingReport, setViewingReport] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string>(exams[0]?.id || '');

  const handleDownloadPDF = (reportType: string) => {
    toast.success(`${reportType} report generated successfully! Download ready.`);
  };

  const handleViewDetails = (reportType: string) => {
    setViewingReport(reportType);
  };

  const handleBackToReports = () => {
    setViewingReport(null);
  };

  // Report Details View
  if (viewingReport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackToReports}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{viewingReport} Report Details</h1>
            <p className="text-slate-500">Detailed breakdown of your performance</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-8">
          {/* Study Summary */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-600" />
              Study Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjects.map(subject => (
                <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-2">{subject.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Study Time:</span>
                      <span className="font-medium text-slate-900">12.5 hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Topics Covered:</span>
                      <span className="font-medium text-slate-900">8/12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg. Quiz Score:</span>
                      <span className="font-medium text-green-600">82%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz & Exam Performance */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" />
              Quiz & Exam Performance
            </h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Test Name</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Score</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-slate-900">Weekly Test - Week 42</td>
                    <td className="p-4 text-sm text-slate-600">Oct 24, 2023</td>
                    <td className="p-4 text-sm font-bold text-green-600">85%</td>
                    <td className="p-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Excellent</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-slate-900">Monthly Exam - October</td>
                    <td className="p-4 text-sm text-slate-600">Oct 18, 2023</td>
                    <td className="p-4 text-sm font-bold text-blue-600">78%</td>
                    <td className="p-4"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Good</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-slate-900">Math Quiz</td>
                    <td className="p-4 text-sm text-slate-600">Oct 15, 2023</td>
                    <td className="p-4 text-sm font-bold text-orange-600">65%</td>
                    <td className="p-4"><span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Needs Work</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Weak Areas */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-orange-600" />
              Weak Areas & Focus Topics
            </h2>
            <div className="space-y-3">
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                <h3 className="font-bold text-orange-900 mb-1">Mathematics - Calculus I: Limits</h3>
                <p className="text-sm text-orange-700 mb-2">Quiz score: 45% • High exam relevance</p>
                <p className="text-sm text-slate-700">Recommended: Review fundamental concepts and practice more problems</p>
              </div>
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                <h3 className="font-bold text-orange-900 mb-1">Physics - Newton's Laws</h3>
                <p className="text-sm text-orange-700 mb-2">Not yet mastered • High exam relevance</p>
                <p className="text-sm text-slate-700">Recommended: Complete the study session and take the quiz</p>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award size={20} className="text-indigo-600" />
              Recommended Actions
            </h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
              <p className="flex items-start gap-2 text-slate-700">
                <span className="text-indigo-600 font-bold mt-0.5">1.</span>
                <span>Schedule revision sessions for weak topics (Calculus, Newton's Laws)</span>
              </p>
              <p className="flex items-start gap-2 text-slate-700">
                <span className="text-indigo-600 font-bold mt-0.5">2.</span>
                <span>Take weekly practice tests to maintain consistency</span>
              </p>
              <p className="flex items-start gap-2 text-slate-700">
                <span className="text-indigo-600 font-bold mt-0.5">3.</span>
                <span>Focus extra study time on high-importance exam topics</span>
              </p>
              <p className="flex items-start gap-2 text-slate-700">
                <span className="text-indigo-600 font-bold mt-0.5">4.</span>
                <span>Use AI chat for doubts on difficult concepts</span>
              </p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => handleDownloadPDF(viewingReport)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-2"
          >
            <Download size={20} />
            Download Full Report as PDF
          </button>
        </div>
      </div>
    );
  }

  // Main Reports List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500">Download detailed performance reports</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Report */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
              <Calendar size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-lg mb-1">Weekly Report</h3>
              <p className="text-sm text-slate-600">Summary of this week's activities</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Study time:</span>
              <span className="font-medium text-slate-900">18.5 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Topics studied:</span>
              <span className="font-medium text-slate-900">12 topics</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Revisions completed:</span>
              <span className="font-medium text-slate-900">5 revisions</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Weekly test score:</span>
              <span className="font-medium text-green-600">85%</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => handleViewDetails('Weekly')}
              className="flex-1 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              View Details
            </button>
            <button 
              onClick={() => handleDownloadPDF('Weekly')}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Monthly Report */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
              <TrendingUp size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-lg mb-1">Monthly Report</h3>
              <p className="text-sm text-slate-600">Overall progress for October 2023</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Overall progress:</span>
              <span className="font-medium text-slate-900">4 subjects</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Topics mastered:</span>
              <span className="font-medium text-slate-900">15 of 28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Monthly exam score:</span>
              <span className="font-medium text-blue-600">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Next month focus:</span>
              <span className="font-medium text-orange-600">Weak topics</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => handleViewDetails('Monthly')}
              className="flex-1 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              View Details
            </button>
            <button 
              onClick={() => handleDownloadPDF('Monthly')}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Exam-Focused Report */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-lg mb-1">Exam-Focused Report</h3>
            <p className="text-sm text-slate-600">Get readiness report for a specific upcoming exam</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Upcoming Exam
          </label>
          <select 
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>
                {exam.name} - {new Date(exam.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {selectedExam && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Exam Readiness:</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '72%' }}></div>
                </div>
                <span className="font-bold text-green-600">72%</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Covered topics:</span>
              <span className="font-medium text-slate-900">18 of 25</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Avg. quiz score:</span>
              <span className="font-medium text-blue-600">76%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Days remaining:</span>
              <span className="font-medium text-orange-600">22 days</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button 
            onClick={() => handleViewDetails('Exam-Focused')}
            className="flex-1 bg-orange-50 text-orange-700 px-4 py-2 rounded-lg font-medium hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
            disabled={!selectedExam}
          >
            <Eye size={16} />
            View Details
          </button>
          <button 
            onClick={() => handleDownloadPDF('Exam-Focused')}
            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            disabled={!selectedExam}
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
