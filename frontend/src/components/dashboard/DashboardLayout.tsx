import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar title={title} />

        {/* Inner Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-950/40">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
