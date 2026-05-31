import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Plus, Search, Folder, Clock, Calendar, CheckSquare, Edit2, Trash2, X, AlertCircle, Play, User, ClipboardList, CheckCircle } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

interface Project {
  _id: string;
  title: string;
  client?: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  dueDate?: string;
  description?: string;
  progress?: number;
  tasksCount?: number;
  completedTasks?: number;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  project: string | { _id: string; title: string };
  status: 'todo' | 'inprogress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface AttendanceLog {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: 'present' | 'absent' | 'late' | 'leave';
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'attendance'>('projects');
  
  // Data lists
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [attendance, setAttendance] = useState<AttendanceLog[]>([]);

  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');

  // Loading & Modals
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project' | 'task'>('project');
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    client: '',
    status: 'Planning',
    dueDate: '',
    description: '',
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    project: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  // Fetch all resources
  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, taskRes, attRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
        user?.role === 'admin' || user?.role === 'manager' ? api.get('/attendance/all') : api.get('/attendance/my'),
      ]);
      if (projRes.data.success) setProjects(projRes.data.projects);
      if (taskRes.data.success) setTasks(taskRes.data.tasks);
      if (attRes.data.success) setAttendance(attRes.data.logs || attRes.data.record || []);
    } catch (error) {
      console.error('Error fetching project management data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Clock In / Out handlers
  const handleClockIn = async () => {
    try {
      await api.post('/attendance/clockin');
      alert('Clocked In successfully!');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error clocking in');
    }
  };

  const handleClockOut = async () => {
    try {
      await api.post('/attendance/clockout');
      alert('Clocked Out successfully!');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error clocking out');
    }
  };

  // Modals / Form submissions
  const handleOpenAddModal = (type: 'project' | 'task') => {
    setModalType(type);
    setEditId(null);
    if (type === 'project') {
      setProjectForm({ title: '', client: '', status: 'Planning', dueDate: '', description: '' });
    } else {
      setTaskForm({ title: '', description: '', project: projects[0]?._id || '', status: 'todo', priority: 'medium', dueDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (type: 'project' | 'task', item: any) => {
    setModalType(type);
    setEditId(item._id);
    if (type === 'project') {
      setProjectForm({
        title: item.title,
        client: item.client || '',
        status: item.status,
        dueDate: item.dueDate ? item.dueDate.split('T')[0] : '',
        description: item.description || '',
      });
    } else {
      setTaskForm({
        title: item.title,
        description: item.description || '',
        project: typeof item.project === 'object' ? item.project?._id : item.project || '',
        status: item.status,
        priority: item.priority,
        dueDate: item.dueDate ? item.dueDate.split('T')[0] : '',
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (type: 'project' | 'task', id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      await api.delete(`/${type}s/${id}`);
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'project') {
        if (editId) {
          await api.put(`/projects/${editId}`, projectForm);
        } else {
          await api.post('/projects', projectForm);
        }
      } else {
        if (editId) {
          await api.put(`/tasks/${editId}`, taskForm);
        } else {
          await api.post('/tasks', taskForm);
        }
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Filters
  const filteredProjects = projects.filter((p) => {
    return p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const filteredTasks = tasks.filter((t) => {
    const taskProject = typeof t.project === 'object' ? t.project?._id : t.project;
    const matchesProject = selectedProjectFilter === 'all' || taskProject === selectedProjectFilter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const taskStages: { key: Task['status']; label: string }[] = [
    { key: 'todo', label: 'To Do' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'review', label: 'In Review' },
    { key: 'done', label: 'Completed' },
  ];

  return (
    <DashboardLayout title="Projects & Task Management">
      {/* Top Tabs */}
      <div className="flex border-b border-slate-800 space-x-8 mb-6">
        <button
          onClick={() => { setActiveTab('projects'); setSearchQuery(''); }}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'projects' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Active Projects
        </button>
        <button
          onClick={() => { setActiveTab('tasks'); setSearchQuery(''); }}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'tasks' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Task Kanban
        </button>
        <button
          onClick={() => { setActiveTab('attendance'); setSearchQuery(''); }}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'attendance' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Attendance Portal
        </button>
      </div>

      {/* Control Bar */}
      {activeTab !== 'attendance' && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 border border-slate-800 rounded-[20px] p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-10 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {activeTab === 'tasks' && (
              <select
                value={selectedProjectFilter}
                onChange={(e) => setSelectedProjectFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700/60 rounded-xl h-10 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all font-medium"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={() => handleOpenAddModal(activeTab === 'projects' ? 'project' : 'task')}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl h-10 px-4 text-sm text-white font-semibold shadow-lg shadow-blue-600/20 transition-all w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === 'projects' ? 'Project' : 'Task'}</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400">Syncing with server workspace...</div>
      ) : (
        <>
          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500">No projects found. Add a project to start tracking.</div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-[24px] shadow-lg transition-all duration-300 group flex flex-col justify-between h-76"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                          <Folder className="w-5 h-5" />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditModal('project', project)}
                            className="text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('project', project._id)}
                            className="text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors line-clamp-1">
                          {project.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">Client: {project.client || 'Internal'}</p>
                        {project.description && <p className="text-xs text-slate-500 line-clamp-2 pt-1 font-normal">{project.description}</p>}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800/80 mt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                          <span className={`px-2 py-0.5 text-[10px] rounded border font-semibold ${getStatusClass(project.status)}`}>{project.status}</span>
                          <span className="text-white font-semibold">{project.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No limit'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                          <span>{project.completedTasks || 0}/{project.tasksCount || 0} Tasks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TASK KANBAN */}
          {activeTab === 'tasks' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
              {taskStages.map((stage) => {
                const stageTasks = filteredTasks.filter((t) => t.status === stage.key);

                return (
                  <div key={stage.key} className="flex flex-col bg-slate-900/50 border border-slate-800 rounded-[20px] p-4 min-w-[250px] h-[550px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-sm tracking-wide text-white uppercase">{stage.label}</h3>
                      <span className="bg-slate-800 text-xs px-2 py-0.5 rounded-full text-slate-400">{stageTasks.length}</span>
                    </div>

                    <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                      {stageTasks.map((task) => {
                        const taskProject = typeof task.project === 'object' ? task.project : projects.find(p => p._id === task.project);
                        return (
                          <div
                            key={task._id}
                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl shadow-md transition-all space-y-3 group"
                          >
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-bold text-sm text-slate-100 line-clamp-2">{task.title}</h4>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1.5 transition-opacity">
                                <button
                                  onClick={() => handleOpenEditModal('task', task)}
                                  className="text-slate-400 hover:text-blue-400"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem('task', task._id)}
                                  className="text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {task.description && (
                              <p className="text-xs text-slate-500 line-clamp-2 font-normal">{task.description}</p>
                            )}

                            {taskProject && (
                              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-semibold self-start inline-block">
                                {taskProject.title}
                              </span>
                            )}

                            <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 gap-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>

                              <select
                                value={task.status}
                                onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value as Task['status'])}
                                className="bg-slate-800 border border-slate-700/60 text-[10px] px-1 py-0.5 rounded text-slate-300 focus:outline-none"
                              >
                                <option value="todo">To Do</option>
                                <option value="inprogress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Completed</option>
                              </select>
                            </div>
                          </div>
                        );
                      })}

                      {stageTasks.length === 0 && (
                        <div className="border border-dashed border-slate-800/60 rounded-xl py-12 text-center text-xs text-slate-600">
                          No tasks in {stage.label}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              {/* Daily Action Portal */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                <div className="space-y-2 z-10 text-center md:text-left">
                  <h3 className="font-bold text-xl text-white">Daily Attendance Portal</h3>
                  <p className="text-sm text-slate-400">Clock in daily before 09:15 AM to register a "Present" status.</p>
                </div>
                <div className="flex gap-4 z-10 w-full md:w-auto">
                  <button
                    onClick={handleClockIn}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-2xl h-12 px-6 text-sm text-white font-bold shadow-lg shadow-blue-600/20 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Clock In</span>
                  </button>
                  <button
                    onClick={handleClockOut}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-2xl h-12 px-6 text-sm text-slate-300 font-bold transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Clock Out</span>
                  </button>
                </div>
              </div>

              {/* Attendance Log Table */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-[24px] overflow-hidden shadow-lg">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center">
                  <h3 className="font-bold text-base text-white">
                    {user?.role === 'admin' || user?.role === 'manager' ? 'All Employee Logs' : 'My Attendance History'}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="p-5 pl-8">Date</th>
                        <th className="p-5">User</th>
                        <th className="p-5">Clock In</th>
                        <th className="p-5">Clock Out</th>
                        <th className="p-5 pr-8">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm">
                      {attendance.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">No attendance registered yet.</td>
                        </tr>
                      ) : (
                        attendance.map((log) => {
                          const logUser = typeof log.user === 'object' ? log.user : { name: user?.name, email: user?.email };
                          return (
                            <tr key={log._id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="p-5 pl-8 font-semibold text-white">{log.date}</td>
                              <td className="p-5">
                                <div className="font-semibold text-white">{logUser?.name}</div>
                                <div className="text-xs text-slate-400">{logUser?.email}</div>
                              </td>
                              <td className="p-5 text-slate-300">
                                {log.clockIn ? new Date(log.clockIn).toLocaleTimeString() : '-'}
                              </td>
                              <td className="p-5 text-slate-300">
                                {log.clockOut ? new Date(log.clockOut).toLocaleTimeString() : '-'}
                              </td>
                              <td className="p-5 pr-8">
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border uppercase tracking-wider ${
                                  log.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  log.status === 'late' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* FORM MODAL FOR PROJECT & TASK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editId ? 'Edit' : 'Add'} {modalType === 'project' ? 'Project' : 'Task'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalType === 'project' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Project Title</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Website Redesign"
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Client Name</label>
                      <input
                        type="text"
                        value={projectForm.client}
                        onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                        placeholder="e.g. Nova Corp"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label>
                      <select
                        value={projectForm.status}
                        onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Due Date</label>
                    <input
                      type="date"
                      value={projectForm.dueDate}
                      onChange={(e) => setProjectForm({ ...projectForm, dueDate: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Project details..."
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {modalType === 'task' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Task Title</label>
                    <input
                      type="text"
                      required
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      placeholder="e.g. Design UI prototypes"
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Associated Project</label>
                      <select
                        required
                        value={taskForm.project}
                        onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                      >
                        <option value="" disabled>Select a project</option>
                        {projects.map((p) => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Priority</label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label>
                      <select
                        value={taskForm.status}
                        onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                      >
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Completed</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Due Date</label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      placeholder="Task expectations..."
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 border border-slate-700/60 hover:bg-slate-700/60 rounded-xl h-11 px-5 text-sm text-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 rounded-xl h-11 px-5 text-sm text-white font-semibold shadow-lg shadow-blue-600/20 transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
