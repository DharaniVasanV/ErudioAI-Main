import React from 'react';
import { Card, Button, Badge } from '@/app/components/ui/Base';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, RotateCcw, CheckCircle, ChevronLeft } from 'lucide-react';

export const RemedialVideo = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0">
        <ChevronLeft size={18} className="mr-2" /> Back
      </Button>

      <div className="bg-black aspect-video rounded-2xl relative overflow-hidden group mb-6">
        <img 
            src="https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-60"
            alt="Video thumbnail"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <Play size={32} className="text-white ml-1" />
            </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <Badge variant="warning" className="mb-2">Remedial Lesson</Badge>
            <h1 className="text-2xl font-bold text-white">Fix your weak spot: Quadratic Roots</h1>
            <p className="text-slate-300 text-sm">Generated based on your last quiz results</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Video Transcript & Notes</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                    In this session, we focus on why you might be confusing the discriminant sign. Remember, if b^2 - 4ac is positive, you have two real roots. If it's zero, one real root. If negative, imaginary roots.
                </p>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <p className="text-sm font-medium text-indigo-900"><strong>Key Takeaway:</strong> Always calculate the discriminant first before applying the full quadratic formula.</p>
                </div>
            </Card>
        </div>
        
        <div className="space-y-4">
            <Button className="w-full py-6" onClick={() => navigate(`/quiz/${topicId || 'demo'}`)}>
                <RotateCcw size={18} className="mr-2" /> Retake Quiz
            </Button>
            <Button variant="outline" className="w-full py-6" onClick={() => navigate('/dashboard')}>
                <CheckCircle size={18} className="mr-2" /> Mark as Understood
            </Button>
            <Card className="p-4 bg-slate-50">
                <p className="text-xs text-slate-500 text-center">This video has been added to your revision library.</p>
            </Card>
        </div>
      </div>
    </div>
  );
};
