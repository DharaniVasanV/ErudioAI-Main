import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '@/app/components/ui/Base';
import { Send, Mic, User, Bot, Paperclip } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { cn } from '@/app/components/ui/Base';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
};

export const AIChat = () => {
  const { user, addToHistory } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: `Hi ${user?.name.split(' ')[0] || 'there'}! I'm your ErudioAI companion. How can I help you study today?`, time: 'Now' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      time: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: "That's a great question about Quadratic Equations. To solve for x, you can use the quadratic formula. Would you like me to walk through an example?",
        time: 'Now'
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      
      // Add to history only on first interaction of session? For now just mock.
      if (messages.length === 1) {
        addToHistory({
            id: Date.now().toString(),
            title: 'Chat about ' + userMsg.text.slice(0, 20) + '...',
            type: 'Chat',
            subject: 'General',
            date: new Date().toISOString(),
            timestamp: 'Just now'
        });
      }
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">ErudioAI Assistant</h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-4 max-w-3xl", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs",
              msg.role === 'assistant' ? "bg-indigo-600" : "bg-slate-400"
            )}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl max-w-[80%]",
              msg.role === 'assistant' ? "bg-white border border-slate-200 text-slate-700 rounded-tl-none" : "bg-indigo-600 text-white rounded-tr-none"
            )}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={cn("text-[10px] mt-2 opacity-70", msg.role === 'assistant' ? "text-slate-400" : "text-indigo-200")}>{msg.time}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4 max-w-3xl">
             <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-indigo-600 text-white">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        {messages.length < 2 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
             {['Explain Quadratic Formula', 'Generate a quiz for Physics', 'Summarize World War II'].map(prompt => (
               <button key={prompt} onClick={() => setInput(prompt)} className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                 {prompt}
               </button>
             ))}
          </div>
        )}
        
        <div className="relative flex items-center gap-2">
          <Button variant="ghost" className="p-2 text-slate-400 hover:text-slate-600">
            <Paperclip size={20} />
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a doubt or request a summary..." 
            className="flex-1 pr-12 rounded-full"
          />
          <Button 
            onClick={input ? handleSend : undefined} // mic if empty
            className={cn("absolute right-1 w-8 h-8 p-0 rounded-full", input ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}
          >
            {input ? <Send size={16} /> : <Mic size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};