import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { DigitalCareerTwin, ChatMessage } from '../types';
import { 
  MessageSquareCode, Send, Sparkles, Bot, User, Trash2, 
  Wrench, CheckCircle2, ChevronRight, RefreshCw, HelpCircle 
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "Which career suits my current skills best?",
  "Why am I not ready for AI/ML engineering yet?",
  "Compare AI/ML Engineer vs Cybersecurity Engineer for me.",
  "Which practical portfolio project should I build next?",
  "Generate an 8-week structured learning roadmap for AI/ML."
];

export const AIMentorPage: React.FC = () => {
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const twinData = await api.getTwin();
        setTwin(twinData);
        // Initial welcome message from mentor
        setMessages([
          {
            id: 'msg-0',
            role: 'assistant',
            content: `Hello **${twinData.name}**! I am your **CareerTwin Agentic AI Mentor**.\n\nI have direct access to your Digital Career Twin data (${Object.keys(twinData.skills).length} skills logged, target goals: **${twinData.career_goals.join(', ')}**).\n\nAsk me anything about your skill readiness, alternative career paths, or practical project roadmaps!`,
            provider: 'agentic-core',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await api.chatWithAgent(query, historyPayload);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.reply,
        tool_executed: response.tool_executed,
        provider: response.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: "I ran into a temporary issue analyzing your twin. Please ask again or try one of the suggested prompts below.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (!twin) return;
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. I am ready to advise you on your career twin, **${twin.name}**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (loading || !twin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Python Tool-Using Agentic Mentor</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Career Twin Mentor</h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in your measured competencies, with access to 8 deterministic career analysis tools
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-light border border-surface-border text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Grounded Twin Metadata Pill */}
      <div className="p-3.5 rounded-xl bg-surface border border-surface-border flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
          <span>Active Context: <strong className="text-white">{twin.name}</strong> ({twin.academic_year})</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>AI/ML Readiness: <strong className="text-brand-cyan">{twin.readiness_by_career['ai-ml-engineer']?.score || twin.primary_readiness_score}%</strong></span>
          <span>Cyber Readiness: <strong className="text-brand-indigo">{twin.readiness_by_career['cybersecurity-engineer']?.score || 32}%</strong></span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="h-[480px] rounded-2xl bg-surface border border-surface-border p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-brand-blue/20 border-brand-blue/40 text-brand-cyan'
                    : 'bg-brand-indigo/20 border-brand-indigo/40 text-brand-indigo shadow-glow-indigo'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1.5">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-brand-blue text-white rounded-tr-none'
                      : 'bg-surface-light border border-surface-border text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                </div>

                {/* If a tool was executed, display the tool execution pill! */}
                {msg.tool_executed && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface border border-brand-cyan/20 text-[10px] text-brand-cyan font-mono">
                    <Wrench className="w-3 h-3" />
                    <span>Agent Tool Invoked: {msg.tool_executed.tool}()</span>
                  </div>
                )}

                <p className="text-[10px] text-slate-500 px-1">{msg.timestamp}</p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-8 h-8 rounded-xl bg-brand-indigo/20 border border-brand-indigo/40 flex items-center justify-center text-brand-indigo">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-surface-light border border-surface-border text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
              <span>Analyzing digital twin & evaluating tools...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> Suggested queries grounded in your twin:
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-lg text-xs bg-surface-light border border-surface-border text-slate-300 hover:text-white hover:border-brand-cyan/30 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a strategic question about your skills, goals, or roadmaps..."
          className="flex-1 px-4 py-3 rounded-xl bg-surface border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-5 py-3 rounded-xl bg-brand-cyan text-slate-950 font-bold hover:bg-brand-cyan/90 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-glow-cyan"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
};
