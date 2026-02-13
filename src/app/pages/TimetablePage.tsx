import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { clsx } from 'clsx';
import { 
  Clock, RefreshCw, ChevronLeft, ChevronRight, BookOpen, GraduationCap, 
  CheckCircle2, Edit3, Save, Undo, Trash2, Settings, GripVertical 
} from 'lucide-react';
import { toast } from 'sonner';
import { TimeBlock } from '@/app/types';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

export const TimetablePage = () => {
  const { timetable, updateTimeBlock, subjects, topics } = useApp();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [undoStack, setUndoStack] = useState<TimeBlock[][]>([]);

  const handleRegenerate = () => {
    setShowRegenerateModal(true);
  };

  const handleRegenerateConfirm = (option: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `AI is optimizing your schedule (${option})...`,
        success: 'Timetable updated based on your preferences!',
        error: 'Could not update timetable'
      }
    );
    setShowRegenerateModal(false);
  };

  const handleEditBlock = (block: TimeBlock) => {
    if (!isEditMode) return;
    setEditingBlock({ ...block });
  };

  const handleSaveBlock = () => {
    if (editingBlock) {
      // Save previous state for undo
      setUndoStack(prev => [...prev, [...timetable]]);
      updateTimeBlock(editingBlock);
      toast.success('Timetable updated manually');
      setEditingBlock(null);
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      // In a real app, we'd have a delete function
      toast.success('Block deleted');
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, -1));
      // Would restore previous state
      toast.success('Changes undone');
    }
  };

  const getBlocksForDay = (day: string) => timetable.filter(t => t.day === day);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Weekly Timetable</h1>
          <p className="text-slate-500">Your personalized study plan towards Midterms</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm",
              isEditMode 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            {isEditMode ? <Save size={18} /> : <Edit3 size={18} />}
            {isEditMode ? 'Done Editing' : 'Edit Timetable'}
          </button>
          <button 
            onClick={handleRegenerate}
            className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Regenerate with AI</span>
          </button>
        </div>
      </div>

      {/* Edit Mode Notice */}
      {isEditMode && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="text-indigo-600" size={20} />
            <div>
              <p className="font-medium text-indigo-900">Edit Mode Active</p>
              <p className="text-sm text-indigo-700">Click any block to edit. You can manually drag and edit any study block to customize your schedule.</p>
            </div>
          </div>
          {undoStack.length > 0 && (
            <button 
              onClick={handleUndo}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              <Undo size={16} />
              Undo Changes
            </button>
          )}
        </div>
      )}

      {/* Mobile Day Selector */}
      <div className="lg:hidden flex items-center justify-between bg-white p-2 rounded-xl border border-gray-200 mb-4 shadow-sm">
        <button 
          onClick={() => {
            const idx = DAYS.indexOf(selectedDay);
            setSelectedDay(DAYS[(idx - 1 + 7) % 7]);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-slate-800">{selectedDay}</span>
        <button 
          onClick={() => {
            const idx = DAYS.indexOf(selectedDay);
            setSelectedDay(DAYS[(idx + 1) % 7]);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Timetable Grid Container */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-8 border-b border-gray-100 bg-gray-50">
          <div className="p-4 text-xs font-semibold text-gray-400 uppercase border-r border-gray-100">Time</div>
          {DAYS.map(day => (
            <div key={day} className="p-4 text-center font-semibold text-slate-700 text-sm">{day.slice(0, 3)}</div>
          ))}
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto relative">
           {/* Desktop Grid */}
           <div className="hidden lg:grid grid-cols-8 min-w-[800px]">
             {HOURS.map(hour => (
               <React.Fragment key={hour}>
                 {/* Time Label */}
                 <div className="border-r border-b border-gray-100 p-2 text-xs text-gray-400 text-right h-24 sticky left-0 bg-white z-10">
                   {hour}:00
                 </div>
                 {/* Day Cells */}
                 {DAYS.map(day => {
                   const blocks = getBlocksForDay(day).filter(b => parseInt(b.startTime.split(':')[0]) === hour);
                   
                   return (
                     <div key={`${day}-${hour}`} className="border-b border-gray-100 border-r border-dashed h-24 relative p-1 transition-colors hover:bg-gray-50">
                        {blocks.map(block => (
                          <div 
                            key={block.id}
                            onClick={() => handleEditBlock(block)}
                            className={clsx(
                              "absolute inset-x-1 top-1 bottom-1 rounded-md p-2 text-xs shadow-sm border-l-4 overflow-hidden transition-all group",
                              block.type === 'Class' && "bg-gray-100 border-gray-400 text-gray-600",
                              block.type === 'Study' && "bg-indigo-50 border-indigo-500 text-indigo-700",
                              block.type === 'Revision' && "bg-orange-50 border-orange-500 text-orange-700",
                              isEditMode && !block.isFixed && "cursor-pointer hover:shadow-lg hover:scale-105",
                              block.isFixed && "opacity-75"
                            )}
                            style={{ 
                              height: block.startTime.endsWith('30') ? '45%' : '90%',
                              top: block.startTime.endsWith('30') ? '50%' : '5%'
                            }}
                          >
                             {isEditMode && !block.isFixed && (
                               <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <GripVertical size={14} />
                               </div>
                             )}
                             <div className="font-bold truncate">{block.title}</div>
                             <div className="opacity-75">{block.startTime} - {block.endTime}</div>
                          </div>
                        ))}
                     </div>
                   );
                 })}
               </React.Fragment>
             ))}
           </div>

           {/* Mobile View */}
           <div className="lg:hidden p-4 space-y-3">
              {getBlocksForDay(selectedDay).length > 0 ? (
                getBlocksForDay(selectedDay)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(block => (
                    <div 
                      key={block.id}
                      onClick={() => handleEditBlock(block)}
                      className={clsx(
                        "p-4 rounded-xl border-l-4 shadow-sm border border-gray-100 flex gap-4 relative",
                        block.type === 'Class' && "bg-white border-l-gray-400",
                        block.type === 'Study' && "bg-indigo-50 border-l-indigo-500",
                        block.type === 'Revision' && "bg-orange-50 border-l-orange-500",
                        isEditMode && !block.isFixed && "cursor-pointer hover:shadow-md"
                      )}
                    >
                       {isEditMode && !block.isFixed && (
                         <div className="absolute top-2 right-2">
                           <Edit3 size={16} className="text-gray-400" />
                         </div>
                       )}
                       <div className="flex flex-col items-center justify-center text-xs font-bold text-gray-500 w-14 shrink-0">
                          <span>{block.startTime}</span>
                          <div className="w-0.5 h-3 bg-gray-300 my-0.5"></div>
                          <span>{block.endTime}</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800">{block.title}</h4>
                          <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                             {block.type === 'Class' && <GraduationCap size={14} />}
                             {block.type === 'Study' && <BookOpen size={14} />}
                             {block.type === 'Revision' && <CheckCircle2 size={14} />}
                             {block.type}
                          </p>
                       </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-10 text-gray-400">
                   No activities scheduled for this day.
                </div>
              )}
           </div>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-400 mt-4">
        {isEditMode 
          ? "Click any study/revision block to edit. Drag to move, or use the edit dialog to change details." 
          : "Enable Edit Mode to customize your timetable. Changes influence future AI plans."
        }
      </p>

      {/* Edit Block Dialog */}
      <Dialog open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Time Block</DialogTitle>
            <DialogDescription>
              Customize this study or revision block according to your needs
            </DialogDescription>
          </DialogHeader>
          
          {editingBlock && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Block Title</Label>
                <Input 
                  id="title"
                  value={editingBlock.title}
                  onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                  placeholder="e.g., Math Study Session"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Block Type</Label>
                <Select 
                  value={editingBlock.type} 
                  onValueChange={(value) => setEditingBlock({ ...editingBlock, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Study">Study</SelectItem>
                    <SelectItem value="Revision">Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime"
                    type="time"
                    value={editingBlock.startTime}
                    onChange={(e) => setEditingBlock({ ...editingBlock, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime"
                    type="time"
                    value={editingBlock.endTime}
                    onChange={(e) => setEditingBlock({ ...editingBlock, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select 
                  value={editingBlock.day} 
                  onValueChange={(value) => setEditingBlock({ ...editingBlock, day: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSaveBlock}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </Button>
                <Button 
                  onClick={() => handleDeleteBlock(editingBlock.id)}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Regenerate Options Modal */}
      <Dialog open={showRegenerateModal} onOpenChange={setShowRegenerateModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Regenerate Timetable with AI</DialogTitle>
            <DialogDescription>
              Choose how you want AI to optimize your study schedule
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <button 
              onClick={() => handleRegenerateConfirm('Focus on weak topics')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
            >
              <h4 className="font-bold text-slate-900 mb-1">Focus on Weak Topics</h4>
              <p className="text-sm text-slate-600">Prioritize topics where you scored low on quizzes</p>
            </button>

            <button 
              onClick={() => handleRegenerateConfirm('Reduce daily load')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
            >
              <h4 className="font-bold text-slate-900 mb-1">Reduce Daily Load</h4>
              <p className="text-sm text-slate-600">Spread study sessions more evenly across the week</p>
            </button>

            <button 
              onClick={() => handleRegenerateConfirm('Prioritize upcoming exams')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
            >
              <h4 className="font-bold text-slate-900 mb-1">Prioritize Upcoming Exams</h4>
              <p className="text-sm text-slate-600">Focus more time on subjects with near-term exams</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
