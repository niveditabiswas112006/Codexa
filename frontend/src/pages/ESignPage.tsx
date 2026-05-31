import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { FileSignature, Plus, Mail, Check, X, Shield, Lock } from 'lucide-react';
import api from '../lib/axios';

interface ESignDocument {
  _id: string;
  title: string;
  type: string;
  status: 'draft' | 'pending_signature' | 'signed';
  createdAt: string;
}

export default function ESignPage() {
  const [docs, setDocs] = useState<ESignDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'contract',
    status: 'pending_signature'
  });

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      if (res.data.success) {
        // Filter contracts or sign requests
        setDocs(res.data.documents.filter((d: any) => d.type === 'contract'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/documents', form);
      setIsModalOpen(false);
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSign = async (id: string) => {
    try {
      await api.put(`/documents/${id}`, { status: 'signed' });
      fetchDocs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardLayout title="Digital E-Signatures & Contracts">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800 rounded-[20px] p-4">
        <div>
          <h3 className="font-bold text-lg text-white">E-Sign Workflows</h3>
          <p className="text-xs text-slate-400 mt-0.5">Send documents for employee and vendor signature approvals.</p>
        </div>
        <button
          onClick={() => {
            setForm({ title: '', type: 'contract', status: 'pending_signature' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl h-10 px-4 text-sm text-white font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Request Signature</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading signature pipelines...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contracts Table */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-[24px] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Document Title</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {docs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">No documents found in signature queue.</td>
                    </tr>
                  ) : (
                    docs.map((doc) => (
                      <tr key={doc._id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-white flex items-center gap-2">
                            <FileSignature className="w-4 h-4 text-blue-500" />
                            <span>{doc.title}</span>
                          </div>
                          <div className="text-[10px] text-slate-550 mt-0.5">Created: {new Date(doc.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4 text-slate-300 font-semibold capitalize">{doc.type}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${
                            doc.status === 'signed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {doc.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          {doc.status !== 'signed' && (
                            <button
                              onClick={() => handleSign(doc._id)}
                              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg transition-all"
                            >
                              Sign Document
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Audits */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-[24px] p-6 space-y-6">
            <h4 className="font-bold text-white text-base">Security & Compliance</h4>
            <div className="space-y-4">
              <div className="flex gap-3 text-xs">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Audit Trail Integrity</span>
                  <span className="text-slate-400 mt-0.5 block leading-normal">Every signature is time-stamped and logged with unique user IDs.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Request Signature</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-slate-400">Document Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Sales Master Agreement.pdf"
                  className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700/60 rounded-xl h-11 px-5 text-sm text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 rounded-xl h-11 px-5 text-sm text-white font-semibold"
                >
                  Request Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
