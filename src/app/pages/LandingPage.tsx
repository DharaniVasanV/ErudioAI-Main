import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Brain } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 px-6 py-12 lg:py-20 max-w-7xl mx-auto w-full">
        <div className="flex-1 space-y-6 max-w-2xl">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Your personal <span className="text-indigo-600">AI study companion</span> for exams.
          </h1>
          <p className="text-lg lg:text-xl text-slate-600">
            ErudioAI helps you generate lesson plans, schedule revisions, and clear doubts instantly. Ace your school or college exams with a personalized plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-200"
            >
              Get started <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white border-2 border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 px-8 py-3 rounded-full font-semibold text-lg transition-all"
            >
              Log in
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-lg relative">
           <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-30 transform translate-y-4"></div>
           <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
            alt="Student studying with technology" 
            className="relative z-10 rounded-2xl shadow-2xl w-full object-cover aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-500"
           />
        </div>
      </section>

      {/* Trending Topics */}
      <section className="bg-slate-50 py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Trending topics students are mastering</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Quadratic Equations', 'Java Arrays', 'Organic Chemistry', 'Newton\'s Laws', 'Microeconomics'].map((topic) => (
              <span key={topic} className="bg-white px-5 py-2 rounded-full shadow-sm text-slate-700 font-medium border border-slate-200">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-center mb-12">How ErudioAI works</h2>
         <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                 <BookOpen size={24} />
               </div>
               <h3 className="text-xl font-bold mb-3">1. Upload Syllabus</h3>
               <p className="text-slate-600">Simply upload your course syllabus and academic calendar. We extract the key topics for you.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                 <Clock size={24} />
               </div>
               <h3 className="text-xl font-bold mb-3">2. Get a Plan</h3>
               <p className="text-slate-600">Our AI generates a personalized study timetable leading up to your exams, balancing study and rest.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                 <Brain size={24} />
               </div>
               <h3 className="text-xl font-bold mb-3">3. Learn & Revise</h3>
               <p className="text-slate-600">Study with AI-curated notes, take quizzes, and get smart revision reminders based on your performance.</p>
            </div>
         </div>
      </section>
    </div>
  );
};