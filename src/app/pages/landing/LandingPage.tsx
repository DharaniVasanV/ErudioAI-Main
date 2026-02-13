import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@/app/components/ui/Base';
import { ArrowRight, CheckCircle2, Zap, BookOpen, CalendarDays } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { Navigate } from 'react-router-dom';

export const LandingPage = () => {
  const { isAuthenticated } = useApp();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
          <span className="font-bold text-xl text-slate-900">ErudioAI Companion</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:py-24 max-w-7xl mx-auto gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Your personal <span className="text-indigo-600">AI Tutor</span> for every exam.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-lg mx-auto md:mx-0">
            Upload your syllabus, get a personalized study plan, and master concepts with AI-powered quizzes, chats, and videos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Get started <ArrowRight size={20} />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              How it works
            </Button>
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-md md:max-w-xl">
          <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-3xl opacity-50 z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=2070" 
            alt="Student studying" 
            className="relative z-10 rounded-2xl shadow-2xl border border-slate-100"
          />
        </div>
      </section>

      {/* Trending Topics */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Trending topics students are mastering</h3>
          <div className="flex flex-wrap gap-4">
            {['Quadratic Equations', 'Arrays in Java', 'Organic Chemistry Basics', 'Newton’s Laws', 'Photosynthesis'].map(topic => (
              <span key={topic} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-700 text-sm font-medium shadow-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">How ErudioAI works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Upload Syllabus', desc: 'Drag and drop your syllabus PDF. We parse it instantly.', icon: <BookOpen className="text-indigo-600" size={32} /> },
            { title: 'Get Your Plan', desc: 'AI generates a tailored timeline leading up to your exams.', icon: <CalendarDays className="text-indigo-600" size={32} /> },
            { title: 'Learn & Revise', desc: 'Chat with AI, take quizzes, and watch remedial videos.', icon: <Zap className="text-indigo-600" size={32} /> },
          ].map((step, i) => (
            <Card key={i} className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-600">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};