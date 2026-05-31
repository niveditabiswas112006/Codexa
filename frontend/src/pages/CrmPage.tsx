import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Plus, Search, Filter, Mail, Phone, Calendar, ArrowRight, UserCheck, Briefcase, Trash2, Edit2, X, DollarSign, CheckCircle } from 'lucide-react';
import api from '../lib/axios';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes?: string;
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
}

interface Deal {
  _id: string;
  title: string;
  lead?: Lead | string;
  value: number;
  stage: 'new' | 'proposal' | 'negotiation' | 'won' | 'lost';
  notes?: string;
}

export default function CrmPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'contacts' | 'deals'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Loading & Modals
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'lead' | 'contact' | 'deal'>('lead');
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    notes: '',
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    notes: '',
  });

  const [dealForm, setDealForm] = useState({
    title: '',
    lead: '',
    value: 0,
    stage: 'new',
    notes: '',
  });

  // Fetch all resources
  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, contactsRes, dealsRes] = await Promise.all([
        api.get('/leads'),
        api.get('/contacts'),
        api.get('/deals'),
      ]);
      if (leadsRes.data.success) setLeads(leadsRes.data.leads);
      if (contactsRes.data.success) setContacts(contactsRes.data.contacts);
      if (dealsRes.data.success) setDeals(dealsRes.data.deals);
    } catch (error) {
      console.error('Error fetching CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleOpenAddModal = (type: 'lead' | 'contact' | 'deal') => {
    setModalType(type);
    setEditId(null);
    if (type === 'lead') {
      setLeadForm({ name: '', email: '', phone: '', company: '', status: 'new', notes: '' });
    } else if (type === 'contact') {
      setContactForm({ name: '', email: '', phone: '', company: '', position: '', notes: '' });
    } else {
      setDealForm({ title: '', lead: leads[0]?._id || '', value: 0, stage: 'new', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (type: 'lead' | 'contact' | 'deal', item: any) => {
    setModalType(type);
    setEditId(item._id);
    if (type === 'lead') {
      setLeadForm({
        name: item.name,
        email: item.email,
        phone: item.phone || '',
        company: item.company || '',
        status: item.status,
        notes: item.notes || '',
      });
    } else if (type === 'contact') {
      setContactForm({
        name: item.name,
        email: item.email || '',
        phone: item.phone || '',
        company: item.company || '',
        position: item.position || '',
        notes: item.notes || '',
      });
    } else {
      setDealForm({
        title: item.title,
        lead: typeof item.lead === 'object' ? item.lead?._id : item.lead || '',
        value: item.value,
        stage: item.stage,
        notes: item.notes || '',
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (type: 'lead' | 'contact' | 'deal', id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/${type}s/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'lead') {
        if (editId) {
          await api.put(`/leads/${editId}`, leadForm);
        } else {
          await api.post('/leads', leadForm);
        }
      } else if (modalType === 'contact') {
        if (editId) {
          await api.put(`/contacts/${editId}`, contactForm);
        } else {
          await api.post('/contacts', contactForm);
        }
      } else {
        if (editId) {
          await api.put(`/deals/${editId}`, dealForm);
        } else {
          await api.post('/deals', dealForm);
        }
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleUpdateDealStage = async (dealId: string, newStage: Deal['stage']) => {
    try {
      await api.put(`/deals/${dealId}`, { stage: newStage });
      fetchData();
    } catch (error) {
      console.error('Error updating deal stage:', error);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'contacted':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'qualified':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'converted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  // Filtered lists
  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredContacts = contacts.filter((c) => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Kanban Stage Setup
  const dealStages: { key: Deal['stage']; label: string; color: string }[] = [
    { key: 'new', label: 'New', color: 'border-blue-500/30 text-blue-400' },
    { key: 'proposal', label: 'Proposal', color: 'border-amber-500/30 text-amber-400' },
    { key: 'negotiation', label: 'Negotiation', color: 'border-purple-500/30 text-purple-400' },
    { key: 'won', label: 'Won', color: 'border-emerald-500/30 text-emerald-400' },
    { key: 'lost', label: 'Lost', color: 'border-rose-500/30 text-rose-400' },
  ];

  return (
    <DashboardLayout title="CRM & Pipeline Management">
      {/* Top Tabs */}
      <div className="flex border-b border-slate-800 space-x-8 mb-6">
        <button
          onClick={() => { setActiveTab('leads'); setSearchQuery(''); }}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'leads' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Leads
        </button>
        <button
          onClick={() => { setActiveTab('contacts'); setSearchQuery(''); }}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'contacts' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Contacts
        </button>
        <button
          onClick={() => { setActiveTab('deals'); setSearchQuery(''); }}
          className={`pb-4 text-sm font-semibold tracking-wide transition-all ${activeTab === 'deals' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Deals Pipeline
        </button>
      </div>

      {/* Control Bar */}
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

          {activeTab === 'leads' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700/60 rounded-xl h-10 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          )}
        </div>

        <button
          onClick={() => handleOpenAddModal(activeTab === 'leads' ? 'lead' : activeTab === 'contacts' ? 'contact' : 'deal')}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl h-10 px-4 text-sm text-white font-semibold shadow-lg shadow-blue-600/20 transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add {activeTab === 'leads' ? 'Lead' : activeTab === 'contacts' ? 'Contact' : 'Deal'}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading data from workspace server...</div>
      ) : (
        <>
          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-[24px] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="p-5 pl-8">Name</th>
                      <th className="p-5">Company</th>
                      <th className="p-5">Contact Details</th>
                      <th className="p-5">Status</th>
                      <th className="p-5">Created Date</th>
                      <th className="p-5 pr-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">No leads found. Add a lead to get started!</td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-5 pl-8 font-semibold text-white">
                            <div>{lead.name}</div>
                            {lead.notes && <div className="text-xs text-slate-500 font-normal mt-0.5">{lead.notes}</div>}
                          </td>
                          <td className="p-5 text-slate-300">{lead.company || '-'}</td>
                          <td className="p-5 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Mail className="w-3.5 h-3.5" />
                              <span>{lead.email}</span>
                            </div>
                            {lead.phone && (
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-5">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border uppercase tracking-wider ${getStatusBadgeClass(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="p-5 text-slate-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="p-5 pr-8 text-right space-x-3">
                            <button
                              onClick={() => handleOpenEditModal('lead', lead)}
                              className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem('lead', lead._id)}
                              className="text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONTACTS TAB */}
          {activeTab === 'contacts' && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-[24px] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="p-5 pl-8">Name</th>
                      <th className="p-5">Position & Company</th>
                      <th className="p-5">Contact Details</th>
                      <th className="p-5">Notes</th>
                      <th className="p-5 pr-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No contacts found. Add a contact to get started!</td>
                      </tr>
                    ) : (
                      filteredContacts.map((contact) => (
                        <tr key={contact._id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-5 pl-8 font-semibold text-white">{contact.name}</td>
                          <td className="p-5 text-slate-300">
                            {contact.position && <span className="text-white font-medium">{contact.position}</span>}
                            {contact.position && contact.company && <span> at </span>}
                            {contact.company && <span className="text-slate-400">{contact.company}</span>}
                            {!contact.position && !contact.company && '-'}
                          </td>
                          <td className="p-5 space-y-1">
                            {contact.email && (
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{contact.email}</span>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-5 text-slate-400 max-w-xs truncate">{contact.notes || '-'}</td>
                          <td className="p-5 pr-8 text-right space-x-3">
                            <button
                              onClick={() => handleOpenEditModal('contact', contact)}
                              className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem('contact', contact._id)}
                              className="text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DEALS PIPELINE (KANBAN BOARD) */}
          {activeTab === 'deals' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
              {dealStages.map((stage) => {
                const stageDeals = deals.filter((d) => d.stage === stage.key);
                const totalValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);

                return (
                  <div key={stage.key} className="flex flex-col bg-slate-900/50 border border-slate-800 rounded-[20px] p-4 min-w-[240px] h-[600px] overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-sm tracking-wide text-white uppercase">{stage.label}</h3>
                      <span className="bg-slate-800 text-xs px-2 py-0.5 rounded-full text-slate-400">{stageDeals.length}</span>
                    </div>

                    {/* Total Value */}
                    <div className="text-xs text-blue-400 font-semibold mb-4 bg-blue-500/10 px-2 py-1 rounded-lg inline-flex items-center gap-1 self-start">
                      <DollarSign className="w-3 h-3" />
                      <span>{totalValue.toLocaleString()}</span>
                    </div>

                    {/* Deal Cards */}
                    <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                      {stageDeals.map((deal) => {
                        const dealLead = typeof deal.lead === 'object' ? deal.lead : leads.find(l => l._id === deal.lead);
                        return (
                          <div
                            key={deal._id}
                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3 rounded-xl shadow-md transition-all space-y-2 group"
                          >
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-semibold text-sm text-slate-100 line-clamp-1">{deal.title}</h4>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1.5 transition-opacity">
                                <button
                                  onClick={() => handleOpenEditModal('deal', deal)}
                                  className="text-slate-400 hover:text-blue-400"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem('deal', deal._id)}
                                  className="text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {dealLead && (
                              <div className="text-xs text-slate-400 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                                <span className="truncate">{dealLead.name}</span>
                              </div>
                            )}

                            <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                              <span className="text-emerald-400 font-bold text-sm">${deal.value.toLocaleString()}</span>
                              
                              {/* Custom stage switcher selector for premium user experience */}
                              <select
                                value={deal.stage}
                                onChange={(e) => handleUpdateDealStage(deal._id, e.target.value as Deal['stage'])}
                                className="bg-slate-800 border border-slate-700/60 text-[10px] px-1 py-0.5 rounded text-slate-300 focus:outline-none"
                              >
                                <option value="new">New</option>
                                <option value="proposal">Proposal</option>
                                <option value="negotiation">Negotiation</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                              </select>
                            </div>
                          </div>
                        );
                      })}

                      {stageDeals.length === 0 && (
                        <div className="border border-dashed border-slate-800/80 rounded-xl py-8 text-center text-xs text-slate-600">
                          Empty
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editId ? 'Edit' : 'Add'} {modalType === 'lead' ? 'Lead' : modalType === 'contact' ? 'Contact' : 'Deal'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalType === 'lead' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Name</label>
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="e.g. Alice Smith"
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
                      <input
                        type="email"
                        required
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        placeholder="e.g. alice@vertex.com"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</label>
                      <input
                        type="text"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        placeholder="e.g. +1 555-0199"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Company</label>
                      <input
                        type="text"
                        value={leadForm.company}
                        onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                        placeholder="e.g. Vertex Solutions"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label>
                      <select
                        value={leadForm.status}
                        onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes</label>
                    <textarea
                      value={leadForm.notes}
                      onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                      placeholder="Add description or meeting details..."
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {modalType === 'contact' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Charlie Brown"
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="e.g. charlie@lumen.co"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</label>
                      <input
                        type="text"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="e.g. +1 555-0122"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Company</label>
                      <input
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        placeholder="e.g. Lumen Digital"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Position</label>
                      <input
                        type="text"
                        value={contactForm.position}
                        onChange={(e) => setContactForm({ ...contactForm, position: e.target.value })}
                        placeholder="e.g. Product Manager"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes</label>
                    <textarea
                      value={contactForm.notes}
                      onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                      placeholder="Notes about the contact..."
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {modalType === 'deal' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Deal Title</label>
                    <input
                      type="text"
                      required
                      value={dealForm.title}
                      onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                      placeholder="e.g. Enterprise License Deal"
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Associated Lead</label>
                      <select
                        value={dealForm.lead}
                        onChange={(e) => setDealForm({ ...dealForm, lead: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">None</option>
                        {leads.map(l => (
                          <option key={l._id} value={l._id}>{l.name} ({l.company || 'No Company'})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Deal Value ($)</label>
                      <input
                        type="number"
                        required
                        value={dealForm.value}
                        onChange={(e) => setDealForm({ ...dealForm, value: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 5000"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stage</label>
                    <select
                      value={dealForm.stage}
                      onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value as any })}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes</label>
                    <textarea
                      value={dealForm.notes}
                      onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
                      placeholder="Notes about the deal negotiations..."
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
