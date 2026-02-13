import React, { useState } from 'react';
import { Card, Button } from '@/app/components/ui/Base';
import { useNavigate } from 'react-router-dom';
import { FileText, BrainCircuit, PlayCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const RevisionMode = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const steps = [
    { title: 'Quick Recap Notes', icon: FileText },
    { title: 'Mini Quiz', icon: BrainCircuit },
    { title: 'Revision Video', icon: PlayCircle },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress */}
      <div className="flex justify-between items-center mb-8 px-4">
         {steps.map((s, i) => (
             <div key={i} className={`flex flex-col items-center gap-2 ${i + 1 === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${i + 1 === step ? 'border-indigo-600 bg-indigo-50' : i + 1 < step ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-200'}`}>
                     {i + 1 < step ? <CheckCircle size={20} /> : <s.icon size={20} />}
                 </div>
                 <span className="text-xs font-medium">{s.title}</span>
             </div>
         ))}
      </div>

      <Card className="p-8 min-h-[400px] flex flex-col">
        {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Quick Recap: Thermodynamics</h2>
                <ul className="space-y-3 text-slate-700">
                    <li className="flex gap-3">
                        <span className="text-indigo-600 font-bold">•</span>
                        First Law: Energy cannot be created or destroyed.
                    </li>
                    <li className="flex gap-3">
                        <span className="text-indigo-600 font-bold">•</span>
                        Entropy of an isolated system always increases.
                    </li>
                    <li className="flex gap-3">
                        <span className="text-indigo-600 font-bold">•</span>
                        PV = nRT is the ideal gas law equation.
                    </li>
                </ul>
            </motion.div>
        )}

        {step === 2 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Mini Quiz (3 Questions)</h2>
                <div className="space-y-4">
                    <p className="font-medium text-slate-900">1. What represents Entropy?</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-left text-sm">S</button>
                        <button className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-left text-sm">H</button>
                    </div>
                </div>
            </motion.div>
        )}

        {step === 3 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Revision Video</h2>
                <div className="bg-black aspect-video rounded-xl flex items-center justify-center relative overflow-hidden">
                    <PlayCircle className="text-white w-16 h-16 opacity-80" />
                </div>
            </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            {step < 3 ? (
                 <Button onClick={() => setStep(s => s + 1)} className="gap-2">
                    Next Step <ArrowRight size={18} />
                </Button>
            ) : (
                <Button onClick={() => navigate('/dashboard')} className="gap-2 bg-green-600 hover:bg-green-700">
                    Complete Revision <CheckCircle size={18} />
                </Button>
            )}
        </div>
      </Card>
    </div>
  );
};
