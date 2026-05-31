import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { DollarSign, UserPlus, Folder, TrendingUp, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '$124,850', change: '+14.2%', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { label: 'New Leads', value: '3,842', change: '+8.1%', icon: UserPlus, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { label: 'Active Projects', value: '18', change: '0.0%', icon: Folder, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { label: 'Conversion Rate', value: '24.8%', change: '+4.3%', icon: TrendingUp, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
];

const recentActivity = [
  { id: 1, user: 'John Doe', action: 'converted lead to deal', details: 'Acme Corp Contract', time: '2 hours ago' },
  { id: 2, user: 'Sarah Smith', action: 'created task', details: 'Design landing page mockup', time: '4 hours ago' },
  { id: 3, user: 'Mike Johnson', action: 'closed deal', details: 'Stellar LLC - $24,000', time: '1 day ago' },
  { id: 4, user: 'Emma Watson', action: 'joined project team', details: 'Alpha Platform Redesign', time: '2 days ago' }
];

export default function DashboardPage() {
  return (
    <DashboardLayout title="Workspace Overview">
      {/* Welcome Banner */}
      <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-800 p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(125,207,255,0.15),transparent_40%)]" />
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">CODEXA CRM</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Control Center</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage your leads, close deals, track project workflows, and analyze business performance from a unified workspace.
          </p>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-6 hover:bg-slate-900 hover:border-slate-700/60 transition-all duration-300 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={stat.change.startsWith('+') ? 'text-emerald-400 font-semibold' : 'text-slate-500 font-medium'}>
                  {stat.change}
                </span>
                <span className="text-slate-500">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Activity */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-[24px] p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg tracking-tight">Recent Activity</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              <span>View all</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">
                    <span className="font-semibold text-white">{activity.user}</span> {activity.action}{' '}
                    <span className="text-blue-400 font-medium">{activity.details}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Platform Status */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-[24px] p-6 space-y-6">
          <h3 className="font-bold text-lg tracking-tight">System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <span className="text-sm text-slate-400 font-medium">Database Status</span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <span className="text-sm text-slate-400 font-medium">Socket Connection</span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <span className="text-sm text-slate-400 font-medium">API Server</span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                Healthy
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
