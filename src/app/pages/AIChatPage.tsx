import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Send, Mic, ArrowLeft, Bot, User } from 'lucide-react';
import { clsx } from 'clsx';

export const AIChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { chatHistory, sendMessage, createNewChat } = useApp();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  // If no chatId, create one
  useEffect(() => {
    if (!chatId) {
      const newId = createNewChat();
      navigate(`/chat/${newId}`, { replace: true });
    }
  }, [chatId, createNewChat, navigate]);

  const currentChat = chatHistory.find(c => c.id === chatId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && chatId) {
      sendMessage(chatId, input);
      setInput('');
    }
  };

  if (!currentChat) return <div className="p-8">Loading chat...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-100px)] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-3">
         <button onClick={() => navigate('/dashboard')} className="md:hidden p-2 -ml-2 text-gray-500">
           <ArrowLeft size={20} />
         </button>
         <div>
            <h2 className="font-bold text-slate-800">{currentChat.title}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">
               <Bot size={12} className="text-indigo-500" /> AI Study Assistant
            </p>
         </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
         {currentChat.messages.length === 0 && (
           <div className="text-center py-10">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Bot size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">How can I help you study?</h3>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                 {["Explain this concept", "Give me practice questions", "Summarize notes"].map(suggestion => (
                   <button 
                     key={suggestion}
                     onClick={() => setInput(suggestion)}
                     className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                   >
                     {suggestion}
                   </button>
                 ))}
              </div>
           </div>
         )}
         
         {currentChat.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={clsx(
                "flex gap-4 max-w-3xl",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
               <div className={clsx(
                 "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                 msg.role === 'user' ? "bg-indigo-100 text-indigo-700" : "bg-white border border-gray-200 text-green-600"
               )}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
               </div>
               <div className={clsx(
                 "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                 msg.role === 'user' 
                   ? "bg-indigo-600 text-white rounded-br-none" 
                   : "bg-white border border-gray-100 text-slate-700 rounded-bl-none"
               )}>
                  {msg.content}
               </div>
            </div>
         ))}
         <div ref={endRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
         <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
            <button type="button" className="text-gray-400 hover:text-indigo-600 transition-colors">
               <Mic size={20} />
            </button>
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-gray-400"
              placeholder="Type your doubt here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
               <Send size={16} />
            </button>
         </div>
      </form>
    </div>
  );
};
