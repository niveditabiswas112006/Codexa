import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Mail, MessageSquare, Send, Sparkles, Users, TrendingUp, BarChart } from 'lucide-react';

export default function MarketingPage() {
  const [channels, setChannels] = useState([
    { name: 'Email Marketing', sent: 12400, opened: 8200, clicked: 3100, active: true },
    { name: 'WhatsApp Campaigns', sent: 5000, opened: 4800, clicked: 1200, active: true },
    { name: 'SMS Blasts', sent: 8000, opened: 7200, clicked: 400, active: false }
  ]);

  return (
    <DashboardLayout title="Omnichannel Marketing & Campaigns">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-6 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Messages Dispatched</p>
            <h4 className="text-xl font-bold mt-1 text-white">25,400</h4>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-6 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Marketing Audience</p>
            <h4 className="text-xl font-bold mt-1 text-white">12,500 contacts</h4>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-6 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Avg Click-Through Rate (CTR)</p>
            <h4 className="text-xl font-bold mt-1 text-white">18.5%</h4>
          </div>
        </div>
      </div>

      {/* Campaigns Listing */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-[24px] p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-white">Campaign Channels Performance</h3>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl h-10 px-4 text-sm text-white font-semibold transition-all">
            <Send className="w-4 h-4" />
            <span>Launch Campaign</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((chan) => (
            <div
              key={chan.name}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{chan.name}</span>
                <span className={`px-2 py-0.5 text-[10px] rounded border font-semibold ${
                  chan.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700/50'
                }`}>
                  {chan.active ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-800/80 pt-3">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Sent</div>
                  <div className="text-sm font-extrabold text-white mt-1">{chan.sent.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Opened</div>
                  <div className="text-sm font-extrabold text-blue-400 mt-1">{chan.opened.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Clicked</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-1">{chan.clicked.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
