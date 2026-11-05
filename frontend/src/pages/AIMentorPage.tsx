import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DigitalCareerTwin, ChatMessage } from '../types';
import { 
  MessageSquareCode, Send, Sparkles, Bot, User, Trash2, 
  Wrench, CheckCircle2, ChevronRight, RefreshCw, HelpCircle,
  AlertCircle
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "Which career track best fits my verified competencies?",
  "What is the biggest skill bottleneck blocking my readiness?",
  "Compare AI/ML Engineer vs Cloud DevOps Architect for my profile.",
  "What capstone project should I build to improve my employability?",
  "How can I bridge my system design gap in the next 30 days?"
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
        const hasSkills = Object.keys(twinData.skills || {}).length > 0;
        
        setMessages([
          {
            id: 'msg-0',
            role: 'assistant',
            content: hasSkills 
              ? `Hello ${twinData.name || 'there'}! I am your Career Intelligence Advisor. I have calibrated against your Digital Twin profile (${Object.keys(twinData.skills).length} competencies tracked, target: ${twinData.career_goals.join(', ') || 'AI/ML'}).\n\nAsk me anything regarding your readiness trajectory, skill gap remediation, or tailored learning paths.`
              : `Hello ${twinData.name || 'there'}! I am your Career Intelligence Advisor.\n\nYour Digital Twin is currently at baseline. Complete your profile onboarding to calibrate your personalized competency benchmark, or ask general questions about modern tech tracks.`,
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
          content: "I encountered a momentary issue processing that request. Please try again or select one of the suggested prompts below.",
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
        content: `Conversation history cleared. How can I assist your career planning today, ${twin.name || 'there'}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (loading || !twin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Initializing AI Career Advisor...</p>
        </div>
      </div>
    );
  }

  const hasConfiguredTwin = Object.keys(twin.skills || {}).length > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-1">
            <MessageSquareCode className="w-4 h-4" />
            <span>Deterministic Agentic Career Advisor</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Career Mentor</h1>
          <p className="text-xs text-slate-500 mt-1">
            Grounded in your measured competencies, with access to structured career evaluation tools.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-subtle transition-colors shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Conversation</span>
        </button>
      </div>

      {/* Grounded Twin Metadata Card */}
      <div className="p-3.5 rounded-xl bg-white border border-surface-border shadow-subtle flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-medium text-slate-900">
            {twin.name || 'User Profile'}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">
            {twin.academic_year || 'Undergraduate'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span>
            Target Goal:{' '}
            <strong className="text-slate-900 font-medium">
              {twin.career_goals?.[0] ? twin.career_goals[0].replace(/-/g, ' ').toUpperCase() : 'Not Set'}
            </strong>
          </span>
          <span>
            Readiness:{' '}
            <strong className="text-primary-700 font-mono font-bold">
              {twin.primary_readiness_score}%
            </strong>
          </span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="h-[480px] rounded-xl bg-white border border-surface-border shadow-subtle p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col">
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
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isUser
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-1.5 min-w-0">
                <div
                  className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Tool Invocation Badge */}
                {msg.tool_executed && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-primary-200 text-[10px] text-primary-700 font-mono shadow-subtle">
                    <Wrench className="w-3 h-3 text-primary-600" />
                    <span>Tool Invoked: {msg.tool_executed.tool}()</span>
                  </div>
                )}

                <p className="text-[10px] text-slate-400 px-1">{msg.timestamp}</p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary-600 animate-pulse" />
              <span>Analyzing twin data & executing tools...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="space-y-2">
        <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-slate-400" /> Suggested queries based on your profile:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-subtle text-left"
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
          placeholder="Ask a strategic question about your skills, bottlenecks, or career tracks..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-subtle transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-subtle disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
