import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { ChevronRight, PlayCircle, CheckCircle, Clock, Plus, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { Subject, Topic } from '@/app/types';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';

export const LessonsPage = () => {
  const { subjects, topics } = useApp();
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState<string>(subjects[0].id);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [customTopicName, setCustomTopicName] = useState('');
  const [customTopicDesc, setCustomTopicDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredTopics = topics.filter(t => t.subjectId === activeSubject);

  const handleCreateCustomTopic = () => {
    if (!customTopicName.trim()) {
      toast.error('Please enter a topic name');
      return;
    }

    setIsGenerating(true);
    setShowCreateDialog(false);

    // Simulate AI generation
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2500)),
      {
        loading: 'Generating notes and video for this topic...',
        success: () => {
          setIsGenerating(false);
          setCustomTopicName('');
          setCustomTopicDesc('');
          // Navigate to a new custom topic (in real app, would create and get new ID)
          setTimeout(() => {
            navigate('/lessons/t1'); // Navigate to mock topic
          }, 500);
          return 'Custom topic created successfully!';
        },
        error: 'Failed to generate content'
      }
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Your Subjects</h1>
      
      {/* Subject Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {subjects.map(subject => (
          <button
            key={subject.id}
            onClick={() => setActiveSubject(subject.id)}
            className={clsx(
              "p-4 rounded-xl border text-left transition-all relative overflow-hidden",
              activeSubject === subject.id 
                ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500" 
                : "bg-white border-slate-200 hover:border-indigo-300"
            )}
          >
             <div className={clsx("w-2 h-full absolute left-0 top-0", subject.color)}></div>
             <h3 className="font-bold text-slate-800 mb-1">{subject.name}</h3>
             <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
               <div className={clsx("h-1.5 rounded-full", subject.color)} style={{ width: `${subject.progress}%` }}></div>
             </div>
             <p className="text-xs text-gray-500 mt-1">{subject.progress}% Complete</p>
          </button>
        ))}
      </div>

      {/* Topic List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">Topics for {subjects.find(s => s.id === activeSubject)?.name}</h2>
          <button 
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Add Custom Topic
          </button>
        </div>
        <div className="divide-y divide-slate-100">
           {filteredTopics.map(topic => (
             <div 
               key={topic.id} 
               className="p-4 hover:bg-indigo-50/30 transition-colors flex items-center justify-between group cursor-pointer"
               onClick={() => navigate(`/lessons/${topic.id}`)}
             >
                <div className="flex-1">
                   <div className="flex items-center gap-2">
                     <h3 className="font-medium text-slate-900">{topic.name}</h3>
                     {topic.status === 'Mastered' && <CheckCircle size={16} className="text-green-500" />}
                   </div>
                   <div className="flex items-center gap-3 mt-1">
                      <span className={clsx(
                        "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
                        topic.status === 'Not started' && "bg-gray-100 text-gray-500",
                        topic.status === 'In progress' && "bg-blue-100 text-blue-600",
                        topic.status === 'Mastered' && "bg-green-100 text-green-600",
                      )}>
                        {topic.status}
                      </span>
                      {topic.examRelevance && (
                        <span className="text-xs text-orange-600 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          {topic.examRelevance}
                        </span>
                      )}
                   </div>
                </div>
                
                <div className="flex items-center gap-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                   {topic.hasRemedialVideo && (
                     <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded-md flex items-center gap-1">
                       <PlayCircle size={14} /> Remedial Video
                     </span>
                   )}
                   <ChevronRight size={20} className="text-gray-300" />
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Create Custom Topic Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} />
              Create Custom Topic
            </DialogTitle>
            <DialogDescription>
              Enter a topic name and AI will generate study content and an explanation video
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topicName">Topic Name <span className="text-red-500">*</span></Label>
              <Input 
                id="topicName"
                value={customTopicName}
                onChange={(e) => setCustomTopicName(e.target.value)}
                placeholder="e.g., Advanced Integration Techniques"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topicDesc">Short Description (Optional)</Label>
              <Textarea 
                id="topicDesc"
                value={customTopicDesc}
                onChange={(e) => setCustomTopicDesc(e.target.value)}
                placeholder="Describe what you want to focus on in this topic..."
                rows={3}
              />
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm">
              <p className="font-medium text-indigo-900 mb-1">What happens next?</p>
              <ul className="text-indigo-700 space-y-1 text-xs">
                <li>• AI generates structured study content with explanations</li>
                <li>• Key concepts, formulas, and examples are created</li>
                <li>• An explanation video is automatically generated</li>
                <li>• The topic is added to your subject's topic list</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleCreateCustomTopic}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                Generate Content with AI
              </Button>
              <Button 
                onClick={() => setShowCreateDialog(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};