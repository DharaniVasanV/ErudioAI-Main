import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, RotateCcw, Play, Sparkles, X } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { Button } from "@/app/components/ui/button";

export const RemedialVideoPage = () => {
  const navigate = useNavigate();
  const { videoId } = useParams();

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
       <div className="p-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <ArrowLeft size={24} />
          </button>
          <div>
             <h1 className="font-bold text-lg">Fix your weak spot: Quadratic Equations</h1>
             <p className="text-xs text-slate-400">Generated based on your last quiz</p>
          </div>
       </div>

       <div className="flex-1 flex items-center justify-center bg-black relative">
          {/* Mock Player */}
          <div className="w-full max-w-4xl aspect-video bg-slate-800 rounded-lg overflow-hidden relative group cursor-pointer">
             <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform">
                   <Play size={40} fill="white" className="ml-2" />
                </div>
             </div>
             
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="h-1 bg-gray-600 rounded-full mb-4">
                   <div className="h-full w-1/3 bg-indigo-500 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                   </div>
                </div>
                <div className="flex justify-between text-sm font-medium">
                   <span>04:20</span>
                   <span>12:45</span>
                </div>
             </div>
          </div>
       </div>

       <div className="p-6 bg-slate-800">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
             <p className="text-sm text-slate-300">
               <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs font-bold mr-2 uppercase tracking-wide">Note</span>
               This video will also appear in your revision sessions for this topic.
             </p>
             <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Drawer>
                  <DrawerTrigger asChild>
                    <button 
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
                    >
                       <Sparkles size={18} /> AI Short Notes
                    </button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-slate-900 border-t border-slate-700 text-white">
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle className="flex items-center justify-center gap-2">
                          <Sparkles className="text-indigo-400" size={18} /> 
                          AI Summary
                        </DrawerTitle>
                        <DrawerDescription className="text-slate-400">
                          Key takeaways generated from this video topic.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-0">
                        <div className="bg-slate-800 rounded-xl p-4 space-y-3 border border-slate-700">
                          <div className="flex gap-3">
                            <span className="text-indigo-400 font-bold">•</span>
                            <p className="text-sm text-slate-300">The quadratic formula <span className="font-mono bg-slate-700 px-1 rounded text-indigo-300">x = (-b ± √Δ) / 2a</span> is used to find roots of any quadratic equation.</p>
                          </div>
                          <div className="flex gap-3">
                            <span className="text-indigo-400 font-bold">•</span>
                            <p className="text-sm text-slate-300">The discriminant <span className="font-mono bg-slate-700 px-1 rounded text-indigo-300">Δ = b² - 4ac</span> determines the nature of the roots.</p>
                          </div>
                          <div className="flex gap-3">
                            <span className="text-indigo-400 font-bold">•</span>
                            <p className="text-sm text-slate-300">If Δ &gt; 0, two real roots exist. If Δ = 0, one real root exists. If Δ &lt; 0, no real roots exist.</p>
                          </div>
                          <div className="flex gap-3">
                            <span className="text-indigo-400 font-bold">•</span>
                            <p className="text-sm text-slate-300">Always rearrange the equation to standard form <span className="font-mono bg-slate-700 px-1 rounded text-indigo-300">ax² + bx + c = 0</span> before applying the formula.</p>
                          </div>
                        </div>
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                            Close
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>

                <button 
                  onClick={() => navigate('/quiz')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                   <RotateCcw size={18} /> Retake Quiz
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                >
                   <CheckCircle size={18} /> Mark as Understood
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};