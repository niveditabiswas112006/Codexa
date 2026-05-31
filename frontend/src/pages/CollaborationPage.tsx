import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Compass, MessageSquare, HardDrive, Edit, Trash2, Send, FolderPlus, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../lib/axios';

interface DriveFile {
  _id: string;
  title: string;
  type: string;
  createdAt: string;
  fileUrl?: string;
}

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'chat' | 'drive' | 'whiteboard'>('feed');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  // Collaborative Whiteboard Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Quick Feed Mock
  const feedPosts = [
    { author: 'Jane Doe', role: 'COO', text: 'Weekly sync rescheduled to 02:00 PM this Thursday. Please update calendars.', date: 'Today, 10:15 AM' },
    { author: 'System Alert', role: 'Automation', text: 'Enterprise client "Vertex Solutions" deals stage upgraded to Closed-Won ($85,000)! 🎉', date: 'Yesterday' }
  ];

  // Fetch documents from server
  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      if (res.data.success) setFiles(res.data.documents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'drive') fetchDocs();
  }, [activeTab]);

  // Handle file uploads
  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    try {
      await api.post('/documents', {
        title: newFileName,
        type: 'contract',
        status: 'draft'
      });
      setNewFileName('');
      fetchDocs();
    } catch (error) {
      console.error(error);
    }
  };

  // HTML5 Whiteboard Drawing logic
  useEffect(() => {
    if (activeTab === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#3b82f6'; // Neon blue styling matching dark themes
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
      }
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <DashboardLayout title="Enterprise Collaboration Rooms">
      {/* Top Tabs */}
      <div className="flex border-b border-slate-800 space-x-8 mb-6">
        <button
          onClick={() => setActiveTab('feed')}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'feed' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Activity Stream
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'chat' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Workgroup Chats
        </button>
        <button
          onClick={() => setActiveTab('drive')}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'drive' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Cloud Document Drive
        </button>
        <button
          onClick={() => setActiveTab('whiteboard')}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'whiteboard' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Interactive Whiteboard
        </button>
      </div>

      {/* ACTIVITY FEED */}
      {activeTab === 'feed' && (
        <div className="space-y-6 max-w-3xl">
          {feedPosts.map((post, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-[24px] shadow-lg relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 border border-slate-700/50">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{post.author}</h4>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">{post.role}</span>
                </div>
                <span className="ml-auto text-xs text-slate-500">{post.date}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">{post.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* CHAT CHANNELS */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[500px]">
          {/* Channels Sidebar */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Channels</h4>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-semibold">
                # general-discussion
              </button>
              <button className="w-full text-left px-3 py-2 text-slate-400 hover:text-white rounded-xl text-xs font-semibold">
                # sales-strategy
              </button>
              <button className="w-full text-left px-3 py-2 text-slate-400 hover:text-white rounded-xl text-xs font-semibold">
                # engineering-timeline
              </button>
            </div>
          </div>

          {/* Active Chat Logs */}
          <div className="md:col-span-3 bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
              <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl max-w-[80%] rounded-tl-none mr-auto">
                <span className="font-bold text-blue-400 text-[10px] block mb-1">Jane Doe</span>
                Is everyone aligned with the Q2 deliverables deadline?
              </div>
              <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl max-w-[80%] rounded-tl-none mr-auto">
                <span className="font-bold text-blue-400 text-[10px] block mb-1">Jane Doe</span>
                Please push your documents to the Drive workspace.
              </div>
            </div>
            <form className="flex gap-2 pt-4 border-t border-slate-800 mt-4">
              <input
                type="text"
                placeholder="Send secure chat announcement..."
                className="flex-1 bg-slate-800 border border-slate-700/60 rounded-xl h-10 px-4 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4 flex items-center justify-center text-white text-xs font-semibold">
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CLOUD DOCUMENT DRIVE */}
      {activeTab === 'drive' && (
        <div className="space-y-6">
          <form onSubmit={handleUploadFile} className="flex gap-3 bg-slate-900/40 border border-slate-800 rounded-xl p-4 max-w-md">
            <input
              type="text"
              required
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g. Q2 Sales Report.pdf"
              className="flex-1 bg-slate-850 border border-slate-700/60 rounded-xl h-10 px-4 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4 text-xs font-bold text-white transition-all whitespace-nowrap"
            >
              Upload File
            </button>
          </form>

          {loading ? (
            <div className="text-slate-400 text-xs">Loading Cloud documents...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <div key={file._id} className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-white line-clamp-1">{file.title}</h5>
                    <span className="text-[10px] text-slate-500">{new Date(file.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button className="bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-xl py-2 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INTERACTIVE HTML5 CANVAS WHITEBOARD */}
      {activeTab === 'whiteboard' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={clearCanvas}
              className="bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              Clear Canvas
            </button>
          </div>
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 max-w-4xl">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair w-full block"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
