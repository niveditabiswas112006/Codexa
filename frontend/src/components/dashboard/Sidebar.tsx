import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FolderKanban, BarChart3, LogOut, 
  Calendar, Cpu,
  Briefcase, Sparkles, BookOpen, 
  FileSignature, Compass, Search, ChevronDown, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayUser = user || { name: 'User', role: 'Employee' };
  const [searchTerm, setSearchTerm] = useState('');
  
  // Collapse states for sidebar folders
  const [groups, setGroups] = useState({
    core: true,
    sales: true,
    operations: true,
    enterprise: true,
  });

  const toggleGroup = (key: keyof typeof groups) => {
    setGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 25+ dynamic Bitrix24 inspired navigation paths
  const menuConfig = [
    {
      group: 'Core Workspace',
      key: 'core',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { title: 'Collaboration Feed', icon: Compass, href: '/collab' },
        { title: 'Analytics AI', icon: BarChart3, href: '/analytics' },
      ]
    },
    {
      group: 'Sales & Store',
      key: 'sales',
      items: [
        { title: 'CRM Pipelines', icon: Users, href: '/crm' },
        { title: 'Appointment Bookings', icon: Calendar, href: '/bookings' },
        { title: 'Shop Inventory', icon: Briefcase, href: '/inventory' },
      ]
    },
    {
      group: 'Operations',
      key: 'operations',
      items: [
        { title: 'Projects Kanban', icon: FolderKanban, href: '/projects' },
        { title: 'Marketing Engine', icon: Sparkles, href: '/marketing' },
      ]
    },
    {
      group: 'HR & Automation',
      key: 'enterprise',
      items: [
        { title: 'RPA Flows', icon: Cpu, href: '/rpa' },
        { title: 'E-Signatures', icon: FileSignature, href: '/esign' },
        { title: 'HR Directory', icon: BookOpen, href: '/hr' },
      ]
    }
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 text-white overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <img src="/codexa-logo.png" alt="CODEXA Logo" className="w-8 h-8 filter brightness-0 invert" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CODEXA OS
          </span>
        </div>

        {/* Sidebar Search Bar */}
        <div className="relative mb-5 px-2">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Quick search modules..."
            className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-8 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Menu Groups */}
        <nav className="space-y-4">
          {menuConfig.map((group) => {
            // Filter items based on search term
            const filteredItems = group.items.filter(item => 
              item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredItems.length === 0) return null;
            const isCollapsed = !groups[group.key as keyof typeof groups];

            return (
              <div key={group.group} className="space-y-1.5">
                <button
                  onClick={() => toggleGroup(group.key as keyof typeof groups)}
                  className="w-full flex items-center justify-between px-2 text-[10px] uppercase font-bold tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span>{group.group}</span>
                  {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {filteredItems.map((item) => (
                      <NavLink
                        key={item.title}
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User Section / Logout */}
      <div className="border-t border-slate-800 pt-4 mt-6 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md uppercase text-sm">
            {displayUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate leading-tight">{displayUser.name}</p>
            <p className="text-[10px] text-slate-400 capitalize truncate leading-none mt-1">{displayUser.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
