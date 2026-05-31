import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Users, Shield, BookOpen, Clock, CalendarDays, Award } from 'lucide-react';

export default function HrPage() {
  const employees = [
    { name: 'Admin User', role: 'Super Admin', email: 'admin@codexa.com', status: 'Present' },
    { name: 'Jane Doe', role: 'Manager (Sales)', email: 'jane@codexa.com', status: 'On Leave' },
    { name: 'Alice Miller', role: 'Executive (Marketing)', email: 'alice@codexa.com', status: 'Present' },
    { name: 'Bob Smith', role: 'Developer (Eng)', email: 'bob@codexa.com', status: 'Present' }
  ];

  return (
    <DashboardLayout title="Employee & Corporate HR Directory">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Directory Grid */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-[24px] p-6 space-y-6">
          <h3 className="font-bold text-lg text-white">Active Corporate Directory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employees.map((emp) => (
              <div
                key={emp.email}
                className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-start gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{emp.name}</h4>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-semibold mt-1 inline-block">
                    {emp.role}
                  </span>
                  <div className="text-xs text-slate-500 mt-2 font-normal">{emp.email}</div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide mt-2 inline-block ${
                    emp.status === 'Present' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    • {emp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HR Operations Sidebar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-[24px] p-6 space-y-6">
          <h4 className="font-bold text-white text-base">HR Workflows</h4>
          <div className="space-y-4">
            <button className="w-full bg-slate-800 hover:bg-slate-700/60 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3 transition-colors text-left">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs font-bold text-white block">Request Time Off</span>
                <span className="text-[10px] text-slate-400 font-normal mt-0.5">Submit sick leaves or holidays.</span>
              </div>
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700/60 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3 transition-colors text-left">
              <Clock className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-xs font-bold text-white block">Shift Schedule Planner</span>
                <span className="text-[10px] text-slate-400 font-normal mt-0.5">Review assigned calendar slots.</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
