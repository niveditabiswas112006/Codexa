import React from 'react';
import { Bell, Search, Calendar } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { user } = useAuth();
  const displayUser = user || { name: 'User' };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between text-white shrink-0">
      {/* Page Title & Breadcrumb */}
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {getGreeting()}, <span className="text-slate-200 font-semibold">{displayUser.name.split(' ')[0]}</span>
        </p>
      </div>

      {/* Quick Actions & Meta */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workspace..."
            className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-10 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Date Display */}
        <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-800/40 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-center transition-all">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 border-2 border-slate-900 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
