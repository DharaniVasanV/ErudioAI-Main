import { useState, useRef, useEffect } from 'react';
import { Button, Input } from '@/app/components/ui/Base';
import { Send, Mic, User, Bot, Paperclip, Copy, Check } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { cn } from '@/app/components/ui/Base';
import { config } from '@/lib/config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  suggestedTopic?: string;
  showSuggestion?: boolean;
};

export const AIChat = () => {
  const { user, addRecentActivity } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: `Hi ${user?.name.split(' ')[0] || 'there'}! I'm your ErudioAI companion. How can I help you study today?`,
      time: 'Now',
    },
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      time: 'Now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${config.api.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error('API Error:', res.status, error);
        throw new Error(`API Error: ${res.status}`);
      }

      const data: {
        reply_text: string;
        suggested_topic?: string;
        conversation_id: string;
      } = await res.json();

      setConversationId(data.conversation_id);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply_text,
        time: 'Now',
        suggestedTopic: data.suggested_topic,
        showSuggestion: !!data.suggested_topic,
      };

      setMessages(prev => [...prev, aiMsg]);

      if (messages.length === 1) {
        addRecentActivity({
          id: data.conversation_id,
          title: 'Chat about ' + userMsg.text.slice(0, 20) + '...',
          type: 'Chat',
          timestamp: 'Just now',
          refId: data.conversation_id,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddToPlan = async (messageId: string, topic: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${config.api.baseUrl}/chat/add-to-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic_name: topic,
          conversation_id: conversationId,
        }),
      });

      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, showSuggestion: false } : m
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleIgnoreSuggestion = (messageId: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId ? { ...m, showSuggestion: false } : m
      )
    );
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
          <div
            key={msg.id}
            className={cn(
              'flex flex-col gap-2 max-w-3xl',
              msg.role === 'user' ? 'ml-auto items-end' : 'items-start'
            )}
          >
            <div
              className={cn(
                'flex gap-4 w-full',
                msg.role === 'user' ? 'flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs',
                  msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-slate-400'
                )}
              >
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div
                className={cn(
                  'p-4 rounded-2xl max-w-[80%]',
                  msg.role === 'assistant'
                    ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                )}
              >
                {msg.role === 'user' ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="text-sm leading-relaxed prose prose-slate max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const [copied, setCopied] = useState(false);
                          const match = /language-(\w+)/.exec(className || '');

                          const handleCopy = () => {
                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          };

                          return !inline && match ? (
                            <div className="relative group my-4">
                              <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={handleCopy}
                                  className="p-1.5 rounded-md bg-slate-800/50 text-slate-200 hover:bg-slate-800 transition-colors"
                                  title="Copy code"
                                >
                                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                </button>
                              </div>
                              <SyntaxHighlighter
                                {...props}
                                children={String(children).replace(/\n$/, '')}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-xl !m-0 !bg-slate-900 border border-slate-800"
                                customStyle={{ fontSize: '13px', padding: '1.25rem' }}
                              />
                            </div>
                          ) : (
                            <code {...props} className={cn("px-1.5 py-0.5 rounded-md bg-slate-100 text-indigo-600 font-medium", className)}>
                              {children}
                            </code>
                          );
                        },
                        h1: ({ children }) => <h1 className="text-xl font-bold text-slate-900 mb-4 mt-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-bold text-slate-900 mb-3 mt-4">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-bold text-slate-900 mb-2 mt-3">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="pl-1">{children}</li>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg">
                            <table className="w-full text-left border-collapse">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>,
                        th: ({ children }) => <th className="px-4 py-2 font-semibold text-slate-700">{children}</th>,
                        td: ({ children }) => <td className="px-4 py-2 border-b border-slate-100 text-slate-600">{children}</td>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 px-4 py-2 italic my-4 rounded-r-lg text-slate-600">
                            {children}
                          </blockquote>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}
                <p
                  className={cn(
                    'text-[10px] mt-2 opacity-70',
                    msg.role === 'assistant' ? 'text-slate-400' : 'text-indigo-200'
                  )}
                >
                  {msg.time}
                </p>
              </div>
            </div>

            {msg.role === 'assistant' && msg.showSuggestion && msg.suggestedTopic && (
              <div className="ml-12 mt-1 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-xs text-slate-700 flex flex-wrap items-center gap-2">
                <span>
                  Add "<span className="font-semibold">{msg.suggestedTopic}</span>" to
                  your lessons & timetable?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToPlan(msg.id, msg.suggestedTopic!)}
                    className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
                  >
                    Yes, add
                  </button>
                  <button
                    onClick={() => handleIgnoreSuggestion(msg.id)}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200"
                  >
                    No, just explain
                  </button>
                </div>
              </div>
            )}
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
            {['Explain Quadratic Formula', 'Generate a quiz for Physics', 'Summarize World War II'].map(
              prompt => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  {prompt}
                </button>
              )
            )}
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
            onClick={input ? handleSend : undefined}
            className={cn(
              'absolute right-1 w-8 h-8 p-0 rounded-full',
              input ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            )}
          >
            {input ? <Send size={16} /> : <Mic size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};
