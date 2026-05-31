import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { BarChart3, TrendingUp, DollarSign, Target, Calendar, MessageSquare, Send, Sparkles, BrainCircuit } from 'lucide-react';
import api from '../lib/axios';

interface SummaryData {
  leadsCount: number;
  dealsCount: number;
  totalRevenue: number;
  pendingRevenue: number;
  projectsCount: number;
  projectProgress: number;
  tasksCount: number;
  completedTasks: number;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<SummaryData>({
    leadsCount: 0,
    dealsCount: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    projectsCount: 0,
    projectProgress: 0,
    tasksCount: 0,
    completedTasks: 0
  });

  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello! I am your CODEXA Workspace AI. Ask me about your leads conversion, deal value status, active projects timeline, or suggest optimization plans.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/summary');
      if (res.data.success) {
        setSummary(res.data.summary);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setPrompt('');
    setChatLogs(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await api.post('/analytics/ai-chat', { prompt: userMsg });
      if (res.data.success) {
        setChatLogs(prev => [...prev, { sender: 'ai', text: res.data.response }]);
      }
    } catch (error) {
      setChatLogs(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting to the analytics server right now.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <DashboardLayout title="Business Intelligence & AI Copilot">
      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-6 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Closed Won Revenue</p>
            <h4 className="text-xl font-bold mt-1 text-white">${summary.totalRevenue.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-6 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Pipeline Deals value</p>
            <h4 className="text-xl font-bold mt-1 text-white">${summary.pendingRevenue.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-6 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Active Leads</p>
            <h4 className="text-xl font-bold mt-1 text-white">{summary.leadsCount} leads</h4>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-6 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Project Progress</p>
            <h4 className="text-xl font-bold mt-1 text-white">{summary.projectProgress}% Achieved</h4>
          </div>
        </div>
      </div>

      {/* Analytics Visualization and AI Assistant side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Summary and bar charts */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-[24px] p-6 lg:col-span-3 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-white mb-2">Live Workspace Health</h3>
            <p className="text-sm text-slate-400">Database synchronization stats aggregated dynamically.</p>
          </div>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Completed Deliverables</span>
                <span className="font-semibold text-white">
                  {summary.completedTasks} / {summary.tasksCount} Tasks ({summary.tasksCount ? Math.round((summary.completedTasks / summary.tasksCount) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${summary.tasksCount ? (summary.completedTasks / summary.tasksCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Active Project Success Rate</span>
                <span className="font-semibold text-white">{summary.projectProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${summary.projectProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Sales Closing Ratio (Won / Total deals)</span>
                <span className="font-semibold text-white">
                  {summary.dealsCount ? Math.round((summary.totalRevenue / (summary.totalRevenue + summary.pendingRevenue || 1)) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${summary.dealsCount ? (summary.totalRevenue / (summary.totalRevenue + summary.pendingRevenue || 1)) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-slate-300">Live BI indicators synced. Use AI Copilot for pipeline predictions.</span>
            </div>
            <button
              onClick={fetchSummary}
              className="text-xs font-semibold text-blue-500 hover:underline"
            >
              Refresh Stats
            </button>
          </div>
        </div>

        {/* Right Side: Interactive AI Assistant */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-[24px] p-6 lg:col-span-2 flex flex-col justify-between h-[450px]">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">AI Workspace Copilot</h3>
          </div>

          {/* Chat Logs Area */}
          <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1 text-xs scrollbar-thin">
            {chatLogs.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl max-w-[85%] font-medium leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white ml-auto rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 mr-auto rounded-tl-none border border-slate-700/40 whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="bg-slate-800 text-slate-400 mr-auto p-3 rounded-xl max-w-[80%] rounded-tl-none border border-slate-700/40 animate-pulse">
                AI Copilot is analyzing workspace stats...
              </div>
            )}
          </div>

          {/* Form input */}
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about workspace performance..."
              className="flex-1 bg-slate-800 border border-slate-700/60 rounded-xl h-10 px-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 rounded-xl flex items-center justify-center text-white transition-all shadow-md shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
