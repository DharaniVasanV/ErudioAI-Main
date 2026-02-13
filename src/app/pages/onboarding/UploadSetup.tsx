import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '@/app/components/ui/Base';
import { UploadCloud, Calendar, Clock, CheckCircle2, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/app/context/AppContext';
import { cn } from '@/app/components/ui/Base';

export const UploadSetup = () => {
  const navigate = useNavigate();
  const { regeneratePlan } = useApp();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock State for inputs
  const [files, setFiles] = useState<string[]>([]);
  const [exams, setExams] = useState([{ name: 'Math Midterm', date: '2024-03-10' }]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      regeneratePlan();
      setIsGenerating(false);
      navigate('/timetable'); // Or a summary screen
    }, 2500);
  };

  const Step1Syllabus = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
        onClick={() => setFiles([...files, "Syllabus_2024.pdf"])}
      >
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
          <UploadCloud size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Click to upload syllabus</h3>
        <p className="text-slate-500 text-sm max-w-xs">Upload your PDF course syllabus or drag and drop it here.</p>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded flex items-center justify-center font-bold text-xs">PDF</div>
                <span className="text-sm font-medium text-slate-700">{f}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)); }} className="text-slate-400 hover:text-red-500">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Board / University</label>
           <select className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm">
             <option>CBSE</option>
             <option>ICSE</option>
             <option>State Board</option>
             <option>Other</option>
           </select>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Grade / Semester</label>
           <select className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm">
             <option>Grade 10</option>
             <option>Grade 12</option>
             <option>Sem 1</option>
             <option>Sem 2</option>
           </select>
        </div>
      </div>
    </div>
  );

  const Step2Calendar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Upcoming Exams</h3>
        <Button size="sm" variant="secondary" onClick={() => setExams([...exams, { name: '', date: '' }])}>
          <Plus size={16} className="mr-1" /> Add Exam
        </Button>
      </div>
      
      <div className="space-y-3">
        {exams.map((exam, i) => (
          <div key={i} className="flex gap-3">
            <Input 
              placeholder="Exam Name" 
              value={exam.name} 
              onChange={(e) => {
                const newExams = [...exams];
                newExams[i].name = e.target.value;
                setExams(newExams);
              }}
              className="flex-1"
            />
            <Input 
              type="date"
              value={exam.date}
              onChange={(e) => {
                const newExams = [...exams];
                newExams[i].date = e.target.value;
                setExams(newExams);
              }} 
              className="w-40"
            />
             <button onClick={() => setExams(exams.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 px-2">
                <X size={18} />
              </button>
          </div>
        ))}
      </div>
    </div>
  );

  const Step3Timetable = () => (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">Tap the blocks when you are BUSY with school/college classes.</p>
      
      <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-slate-400 mb-2">
        <div></div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
      </div>
      
      <div className="space-y-2">
        {['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'].map((time) => (
          <div key={time} className="grid grid-cols-6 gap-2">
            <div className="text-xs text-slate-400 flex items-center justify-end pr-2">{time}</div>
            {[1, 2, 3, 4, 5].map((day) => {
                const [active, setActive] = useState(false);
                return (
                    <div 
                        key={day} 
                        onClick={() => setActive(!active)}
                        className={cn(
                            "h-10 rounded border cursor-pointer transition-colors",
                            active 
                                ? "bg-slate-800 border-slate-900" 
                                : "bg-white border-slate-200 hover:bg-slate-50"
                        )}
                    />
                );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const Step4Availability = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Daily Study Goal</label>
        <div className="grid grid-cols-3 gap-3">
          {['2 Hours', '4 Hours', '6+ Hours'].map((opt) => (
            <button key={opt} className="py-3 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-medium text-slate-600 transition-all focus:ring-2 ring-indigo-500 ring-offset-1">
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
          <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
          <span className="text-sm text-slate-700">No study after 10 PM</span>
        </label>
        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
          <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" defaultChecked />
          <span className="text-sm text-slate-700">Keep weekends lighter</span>
        </label>
      </div>
    </div>
  );

  if (isGenerating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Creating your personalized plan...</h2>
        <p className="text-slate-500 max-w-md">We are analyzing your syllabus, cross-referencing with your exam dates, and building the optimal timeline.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">
                {step === 1 && 'Upload Syllabus'}
                {step === 2 && 'Exam Dates'}
                {step === 3 && 'School Timetable'}
                {step === 4 && 'Study Preferences'}
            </h1>
            <span className="text-sm font-medium text-slate-500">Step {step} of 4</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 md:p-8 min-h-[400px] flex flex-col">
        <div className="flex-1">
            {step === 1 && <Step1Syllabus />}
            {step === 2 && <Step2Calendar />}
            {step === 3 && <Step3Timetable />}
            {step === 4 && <Step4Availability />}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <Button variant="ghost" onClick={prevStep}>Back</Button>
          ) : (
            <div />
          )}
          
          {step < 4 ? (
            <Button onClick={nextStep} className="gap-2">
                Next <ChevronRight size={18} />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                Generate Plan <BrainCircuit size={18} />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
