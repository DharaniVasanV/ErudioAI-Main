import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, ArrowRight, Upload, Calendar, Clock, Check, Loader2, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { useApp } from '@/app/context/AppContext';

const steps = [
  { id: 1, title: 'Syllabus', icon: BookOpen },
  { id: 2, title: 'Calendar', icon: Calendar },
  { id: 3, title: 'Timetable', icon: Clock },
  { id: 4, title: 'Setup', icon: Check },
];

export const UploadFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { generateLessonPlan } = useApp();

  // Mock state for form data
  const [files, setFiles] = useState<File[]>([]);
  
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      generateLessonPlan({});
      setIsGenerating(false);
      navigate('/timetable'); // Or to a specific "Plan Ready" summary page
    }, 2500);
  };

  // Dropzone setup
  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Timetable Dropzone setup
  const [timetableFiles, setTimetableFiles] = useState<File[]>([]);
  const onDropTimetable = (acceptedFiles: File[]) => {
    setTimetableFiles(prev => [...prev, ...acceptedFiles]);
  };
  const { 
    getRootProps: getTimetableRootProps, 
    getInputProps: getTimetableInputProps, 
    isDragActive: isTimetableDragActive 
  } = useDropzone({ onDrop: onDropTimetable });

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 size={64} className="text-indigo-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Creating your personalized lesson plan...</h2>
        <p className="text-slate-500 max-w-md">Our AI is analyzing your syllabus and scheduling study blocks around your exams.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-slate-800">Upload & Setup</span>
        </div>
        <div className="text-sm text-gray-500 font-medium">Step {currentStep} of 4</div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-0"></div>
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={clsx(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white",
                currentStep >= step.id 
                  ? "border-indigo-600 text-indigo-600" 
                  : "border-gray-300 text-gray-300"
              )}
            >
              <step.icon size={18} strokeWidth={2.5} />
              {currentStep > step.id && <div className="absolute inset-0 rounded-full bg-indigo-600 flex items-center justify-center text-white"><Check size={16} /></div>}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px] flex flex-col">
          
          {currentStep === 1 && (
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Upload your Syllabus</h2>
              <p className="text-gray-500 mb-6">Upload your course syllabus PDF or images. We'll extract topics automatically.</p>
              
              <div 
                {...getRootProps()} 
                className={clsx(
                  "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50",
                  isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"
                )}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-600 mb-4">
                  <Upload size={32} />
                </div>
                <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-1">PDF, PNG, JPG (max 10MB)</p>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Uploaded files:</p>
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600 truncate">{file.name}</span>
                      <button className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Academic Calendar</h2>
              <p className="text-gray-500 mb-6">When are your key exams? Add them manually or upload a schedule.</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" placeholder="Midterm Math" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" className="w-full border rounded-lg px-3 py-2" />
                  </div>
                </div>
                <button className="text-indigo-600 text-sm font-semibold hover:underline">+ Add another exam</button>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                   <p className="text-sm text-gray-500 mb-3">Or upload calendar file</p>
                   <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500 bg-gray-50 cursor-pointer hover:bg-gray-100">
                     Upload Calendar (PDF/Image)
                   </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
             <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">School Timetable</h2>
                <p className="text-gray-500 mb-6">Upload your class schedule or timetable so we can plan around your classes.</p>
                
                <div 
                  {...getTimetableRootProps()} 
                  className={clsx(
                    "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50",
                    isTimetableDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"
                  )}
                >
                  <input {...getTimetableInputProps()} />
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-600 mb-4">
                    <Upload size={32} />
                  </div>
                  <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, PNG, JPG (max 10MB)</p>
                </div>

                {timetableFiles.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Uploaded timetable:</p>
                    {timetableFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-600 truncate">{file.name}</span>
                        <button className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          )}

          {currentStep === 4 && (
             <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Study Availability</h2>
                <p className="text-gray-500 mb-6">How many hours can you dedicate to self-study?</p>
                
                <div className="space-y-6">
                   <div>
                      <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>Weekdays</span>
                        <span className="text-indigo-600 font-bold">2 hrs</span>
                      </label>
                      <input type="range" min="0" max="8" defaultValue="2" className="w-full accent-indigo-600" />
                   </div>
                   
                   <div>
                      <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>Weekends</span>
                        <span className="text-indigo-600 font-bold">4 hrs</span>
                      </label>
                      <input type="range" min="0" max="12" defaultValue="4" className="w-full accent-indigo-600" />
                   </div>

                   <div className="pt-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" defaultChecked />
                        <span className="text-slate-700">No study after 10 PM</span>
                      </label>
                   </div>
                </div>
             </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
             <button 
               onClick={handleNext}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-indigo-100"
             >
               {currentStep === 4 ? 'Generate Plan' : 'Next Step'}
               {currentStep < 4 && <ArrowRight size={18} />}
             </button>
          </div>
        </div>
      </main>
    </div>
  );
};
