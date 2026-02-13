import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Badge } from '@/app/components/ui/Base';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/app/context/AppContext';

// Mock Questions
const QUESTIONS = [
  {
    id: 1,
    question: "What is the discriminant of a quadratic equation ax² + bx + c = 0?",
    options: ["b² - 4ac", "b² + 4ac", "2ax + b", "None of these"],
    correct: 0,
    explanation: "The discriminant is Δ = b² - 4ac, which determines the nature of the roots."
  },
  {
    id: 2,
    question: "If the discriminant is zero, the roots are:",
    options: ["Real and distinct", "Real and equal", "Imaginary", "Undefined"],
    correct: 1,
    explanation: "When Δ = 0, the quadratic formula yields a single repeated real root."
  },
  {
    id: 3,
    question: "Which of these is the quadratic formula?",
    options: ["x = -b ± √(b² - 4ac)", "x = (-b ± √(b² - 4ac)) / 2a", "x = -b / 2a", "x = (-b ± √(b² + 4ac)) / 2a"],
    correct: 1,
    explanation: "The correct formula is x = (-b ± √(b² - 4ac)) / 2a."
  }
];

export const Quiz = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const { updateTopicStatus } = useApp();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleOptionSelect = (idx: number) => {
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === QUESTIONS[currentQ].correct) {
      setScore(s => s + 1);
    }
    const newAnswers = [...answers, selected as number];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
    } else {
      setShowResult(true);
      // Determine score percentage
      const finalScore = Math.round(((score + (selected === QUESTIONS[currentQ].correct ? 1 : 0)) / QUESTIONS.length) * 100);
      // Dummy subject ID 'math' used here, would normally come from route or context lookup
      updateTopicStatus('math', topicId || 't1', finalScore === 100 ? 'mastered' : 'in-progress', finalScore);
    }
  };

  if (showResult) {
    const finalScorePercent = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="p-8 text-center mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Quiz Complete!</h1>
            <p className="text-slate-500">Here is how you performed</p>
          </div>
          
          <div className="w-32 h-32 rounded-full border-8 border-indigo-100 flex items-center justify-center mx-auto mb-6 relative">
            <span className="text-3xl font-bold text-indigo-600">{finalScorePercent}%</span>
          </div>

          <div className="flex gap-4 justify-center mb-8">
            <Badge variant="success" className="px-3 py-1">{score} Correct</Badge>
            <Badge variant="danger" className="px-3 py-1">{QUESTIONS.length - score} Incorrect</Badge>
          </div>

          <div className="space-y-3 max-w-sm mx-auto">
             <Button className="w-full gap-2" onClick={() => navigate(`/video/${topicId || 'demo'}`)}>
               <PlayCircle size={18} /> Watch Remedial Video
             </Button>
             <Button variant="outline" className="w-full" onClick={() => navigate('/timetable')}>
               Schedule Extra Revision
             </Button>
             <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard')}>
               Back to Dashboard
             </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 h-full flex flex-col">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span>Topic: Quadratic Equations</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="flex-1 p-6 md:p-8 flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 mb-6">{QUESTIONS[currentQ].question}</h2>
        
        <div className="space-y-3 flex-1">
          {QUESTIONS[currentQ].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all font-medium",
                selected === idx 
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                  : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs",
                  selected === idx ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {opt}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <Button disabled={selected === null} onClick={handleNext} className="gap-2 px-8">
            {currentQ === QUESTIONS.length - 1 ? 'Submit' : 'Next'} <ArrowRight size={18} />
          </Button>
        </div>
      </Card>
    </div>
  );
};
