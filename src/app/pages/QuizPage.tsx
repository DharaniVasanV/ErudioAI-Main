import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, XCircle, PlayCircle, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { useApp } from '@/app/context/AppContext';

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What is the discriminant of the quadratic equation ax² + bx + c = 0?",
    options: ["b² - 4ac", "b² + 4ac", "√b² - 4ac", "2ax + b"],
    correct: 0
  },
  {
    id: 2,
    question: "If the discriminant is zero, how many real roots does the equation have?",
    options: ["Two distinct roots", "One real root", "No real roots", "Infinite roots"],
    correct: 1
  },
  {
    id: 3,
    question: "Which method is NOT used to solve quadratic equations?",
    options: ["Factoring", "Quadratic Formula", "Completing the square", "Integration"],
    correct: 3
  }
];

export const QuizPage = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();
  const { createNewChat, updateTopicStatus } = useApp();

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);

    if (currentQ < MOCK_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setIsFinished(true);
      // Calculate score and update topic status
      const finalScore = newAnswers.reduce((acc, ans, idx) => acc + (ans === MOCK_QUESTIONS[idx].correct ? 1 : 0), 0);
      const finalPercentage = Math.round((finalScore / MOCK_QUESTIONS.length) * 100);
      // Update topic status - assuming quiz is for topic 't2' (Calculus I: Limits) for this prototype
      updateTopicStatus('t2', finalPercentage);
    }
  };

  const score = answers.reduce((acc, ans, idx) => acc + (ans === MOCK_QUESTIONS[idx].correct ? 1 : 0), 0);
  const percentage = Math.round((score / MOCK_QUESTIONS.length) * 100);

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
           <div className="bg-indigo-600 p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
              <p className="opacity-90">Topic: Quadratic Equations</p>
              
              <div className="mt-6 flex justify-center">
                 <div className="w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center text-4xl font-extrabold bg-white/10 backdrop-blur-sm">
                    {percentage}%
                 </div>
              </div>
           </div>
           
           <div className="p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Performance Analysis</h3>
              
              <div className="space-y-4 mb-8">
                 <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex gap-3">
                    <CheckCircle className="text-green-600 shrink-0" />
                    <div>
                       <p className="font-semibold text-green-800">Strong Areas</p>
                       <p className="text-sm text-green-700">Discriminant formula</p>
                    </div>
                 </div>
                 <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
                    <XCircle className="text-red-600 shrink-0" />
                    <div>
                       <p className="font-semibold text-red-800">Weak Areas</p>
                       <p className="text-sm text-red-700">Roots interpretation (High exam weight)</p>
                    </div>
                 </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-4">Recommended Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                 <button 
                    onClick={() => navigate('/video/rem1')}
                    className="p-4 border border-indigo-200 bg-indigo-50 rounded-xl text-left hover:bg-indigo-100 transition-colors"
                 >
                    <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
                       <PlayCircle size={20} />
                       Watch Remedial Video
                    </div>
                    <p className="text-xs text-indigo-600">Generated based on your wrong answers.</p>
                 </button>
                 
                 <button 
                    onClick={() => navigate('/timetable')}
                    className="p-4 border border-gray-200 rounded-xl text-left hover:border-gray-400 transition-colors"
                 >
                    <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold">
                       <RefreshCw size={20} />
                       Add to Timetable
                    </div>
                    <p className="text-xs text-slate-500">Schedule extra revision for weak topics.</p>
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  const question = MOCK_QUESTIONS[currentQ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
       <div className="mb-6 flex items-center justify-between text-sm text-gray-500 font-medium">
          <span>Question {currentQ + 1} of {MOCK_QUESTIONS.length}</span>
          <span>{Math.round(((currentQ) / MOCK_QUESTIONS.length) * 100)}% Completed</span>
       </div>
       
       <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQ) / MOCK_QUESTIONS.length) * 100}%` }}></div>
       </div>

       <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
             {question.question}
          </h2>

          <div className="space-y-3">
             {question.options.map((opt, idx) => (
               <button
                 key={idx}
                 onClick={() => handleAnswer(idx)}
                 className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-slate-700 flex items-center justify-between group"
               >
                 <span>{opt}</span>
                 <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
               </button>
             ))}
          </div>
       </div>
    </div>
  );
};