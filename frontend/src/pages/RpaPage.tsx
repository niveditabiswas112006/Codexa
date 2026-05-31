import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Cpu, Plus, Sparkles, AlertCircle, Play, Settings, Save, Trash2, ArrowRight } from 'lucide-react';
import api from '../lib/axios';

interface Node {
  id: string;
  type: string;
  label: string;
}

interface Workflow {
  _id: string;
  title: string;
  trigger: string;
  nodes: Node[];
}

export default function RpaPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Active editing node list
  const [activeNodes, setActiveNodes] = useState<Node[]>([
    { id: '1', type: 'trigger', label: 'Trigger: Lead Created' },
    { id: '2', type: 'action', label: 'Action: Notify Manager via Email' }
  ]);

  const [workflowTitle, setWorkflowTitle] = useState('Default Lead Follow-up');

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await api.get('/workflows');
      if (res.data.success) setWorkflows(res.data.workflows);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleAddNode = (type: 'action' | 'condition') => {
    const newId = String(activeNodes.length + 1);
    const newLabel = type === 'action' ? 'Action: Send WhatsApp notification' : 'Condition: If Deal Value > $10,000';
    setActiveNodes([...activeNodes, { id: newId, type, label: newLabel }]);
  };

  const handleSaveWorkflow = async () => {
    try {
      await api.post('/workflows', {
        title: workflowTitle,
        nodes: activeNodes
      });
      alert('RPA Workflow saved to workspace!');
      fetchWorkflows();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    if (!window.confirm("Delete RPA Workflow?")) return;
    try {
      await api.delete(`/workflows/${id}`);
      fetchWorkflows();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardLayout title="Robotic Process Automation (RPA) Builder">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Workflow Canvas */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-[24px] p-6 space-y-6 flex flex-col justify-between min-h-[500px]">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <input
                type="text"
                value={workflowTitle}
                onChange={(e) => setWorkflowTitle(e.target.value)}
                className="bg-transparent border-b border-slate-800 focus:border-blue-500 text-lg font-bold text-white focus:outline-none"
              />
              <p className="text-xs text-slate-500 font-semibold">Visual node configuration editor</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveWorkflow}
                className="bg-blue-600 hover:bg-blue-500 rounded-xl h-10 px-4 text-xs text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Flow</span>
              </button>
            </div>
          </div>

          {/* Graphical Nodes Stack */}
          <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-6">
            {activeNodes.map((node, index) => (
              <React.Fragment key={node.id}>
                {index > 0 && <ArrowRight className="w-5 h-5 text-slate-600 rotate-90" />}
                <div className={`p-4 rounded-2xl border text-xs font-bold w-64 shadow-md text-center relative group ${
                  node.type === 'trigger' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                  node.type === 'condition' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-purple-500/10 text-purple-400 border-purple-500/30'
                }`}>
                  {node.label}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Node Actions Toolbar */}
          <div className="flex gap-3 border-t border-slate-800 pt-4 mt-6">
            <button
              onClick={() => handleAddNode('action')}
              className="bg-slate-850 border border-slate-800 hover:bg-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300"
            >
              + Add Action Node
            </button>
            <button
              onClick={() => handleAddNode('condition')}
              className="bg-slate-850 border border-slate-800 hover:bg-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300"
            >
              + Add Condition Guard
            </button>
          </div>
        </div>

        {/* Saved Flows Catalog */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-[24px] p-6 space-y-6">
          <h4 className="font-bold text-white text-base">Active Workflow Pipelines</h4>
          <div className="space-y-3">
            {workflows.length === 0 ? (
              <div className="text-slate-500 text-xs">No active RPA automations running.</div>
            ) : (
              workflows.map((flow) => (
                <div key={flow._id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-white">{flow.title}</h5>
                    <span className="text-[10px] text-slate-500">{flow.nodes.length} nodes configured</span>
                  </div>
                  <button
                    onClick={() => handleDeleteWorkflow(flow._id)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
