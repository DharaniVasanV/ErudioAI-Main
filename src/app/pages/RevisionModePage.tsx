import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, FileText, Play, BrainCircuit } from 'lucide-react';
import { clsx } from 'clsx';
import { useApp } from '@/app/context/AppContext';
import { toast } from 'sonner';

const REVISION_STEPS = [
  { id: 'notes', title: 'Quick Recap', icon: FileText },
  { id: 'quiz', title: 'Flash Quiz', icon: BrainCircuit },
  { id: 'video', title: 'Video Review', icon: Play },
];

export const RevisionModePage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { topics } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < REVISION_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.success('Revision session complete!');
      navigate('/dashboard');
    }
  };

  const step = REVISION_STEPS[currentStep];
  const topic = topics.find(t => t.id === topicId);
  const cachedContent = localStorage.getItem(`topic_content_${topicId}`);
  const topicData = cachedContent ? JSON.parse(cachedContent) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium">
          <ArrowLeft size={20} /> <span className="hidden sm:inline">Exit Revision: {topic?.name}</span>
        </button>
        <div className="flex items-center gap-2">
          {REVISION_STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                idx === currentStep ? "bg-indigo-600 text-white" : idx < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              )}>
                {idx < currentStep ? <Check size={14} /> : idx + 1}
              </div>
              {idx < REVISION_STEPS.length - 1 && (
                <div className={clsx("w-8 h-0.5 mx-1", idx < currentStep ? "bg-green-500" : "bg-gray-200")}></div>
              )}
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] flex flex-col">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <step.icon size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{step.title}</h1>
          </div>

          <div className="flex-1">
            {step.id === 'notes' && (
              <div className="prose max-w-none text-slate-600">
                {topicData ? (
                  <ul className="space-y-4 list-disc pl-5">
                    <li><strong>Introduction:</strong> {topicData.introduction}</li>
                    {topicData.key_concepts.map((concept: string, i: number) => (
                      <li key={i}>{concept}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Recapping the fundamental principles of {topic?.name || 'this topic'}...</p>
                )}
              </div>
            )}

            {step.id === 'quiz' && (
              <div className="space-y-6">
                <p className="font-medium text-lg text-slate-900">{topicData?.quiz_question || "What is the condition for real and equal roots?"}</p>
                <div className="space-y-3">
                  {["b² - 4ac > 0", "b² - 4ac = 0", "b² - 4ac < 0", "b² = ac"].map((opt, i) => (
                    <button key={i} className="w-full text-left p-4 border rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step.id === 'video' && (
              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative group cursor-pointer overflow-hidden">
                <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border-2 border-white group-hover:scale-110 transition-transform z-10">
                  <Play size={32} fill="currentColor" />
                </div>
                <p className="absolute bottom-4 left-4 text-white font-medium text-sm">Review: Quadratic Roots</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-200"
            >
              {currentStep === REVISION_STEPS.length - 1 ? 'Finish Revision' : 'Next Step'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};