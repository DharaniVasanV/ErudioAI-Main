import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, PlayCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { config } from '@/lib/config';

type Question = {
   id: number;
   question: string;
   options: string[];
   correct: number;
};

export const QuizPage = () => {
   const location = useLocation();
   const state = location.state || {};
   const { topicId, topicName, testType } = state;

   const [questions, setQuestions] = useState<Question[]>([]);
   const [currentQ, setCurrentQ] = useState(0);
   const [answers, setAnswers] = useState<number[]>([]);
   const [isFinished, setIsFinished] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const navigate = useNavigate();
   const { updateTopicStatus } = useApp();

   useEffect(() => {
      const fetchQuiz = async () => {
         try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${config.api.baseUrl}/chat/generate-quiz`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify({ topic_name: topicName || 'General Knowledge' })
            });
            const data = await res.json();
            setQuestions(data.questions.map((q: any, i: number) => ({ ...q, id: i + 1 })));
         } catch (error) {
            console.error('Failed to generate quiz:', error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchQuiz();
   }, [topicName]);

   const handleAnswer = (idx: number) => {
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);

      if (currentQ < questions.length - 1) {
         setCurrentQ(prev => prev + 1);
      } else {
         setIsFinished(true);
         // Calculate score and update topic status
         const finalScore = newAnswers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correct ? 1 : 0), 0);
         const finalPercentage = Math.round((finalScore / questions.length) * 100);

         // Update topic status if topicId exists
         if (topicId) {
            updateTopicStatus(topicId, finalPercentage);
         }

         // Save to localStorage for Reports/Exams history
         const result = {
            topicId,
            topicName: topicName || 'General Practice',
            score: finalPercentage,
            timestamp: new Date().toISOString(),
            testType: testType || 'practice'
         };
         const existingResults = JSON.parse(localStorage.getItem('quiz_results') || '[]');
         localStorage.setItem('quiz_results', JSON.stringify([result, ...existingResults]));
      }
   };

   const score = answers.reduce((acc, ans, idx) => acc + (ans === (questions[idx]?.correct ?? -1) ? 1 : 0), 0);
   const percentage = Math.round((score / (questions.length || 1)) * 100);

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Generating AI quiz...</h2>
            <p className="text-slate-500">Creating custom questions for {topicName || 'your session'}</p>
         </div>
      );
   }

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
                        <CheckCircle2 size={48} className="text-green-600 shrink-0" />
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

   const question = questions[currentQ];

   return (
      <div className="max-w-2xl mx-auto py-8 px-4">
         <div className="mb-6 flex items-center justify-between text-sm text-gray-500 font-medium">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(((currentQ) / questions.length) * 100)}% Completed</span>
         </div>

         <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQ) / questions.length) * 100}%` }}></div>
         </div>

         <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
               {question?.question}
            </h2>

            <div className="space-y-3">
               {question?.options.map((opt: string, idx: number) => (
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