import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Calendar, Plus, Clock, Users, X, Check, Trash2, CalendarDays } from 'lucide-react';
import api from '../lib/axios';

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  staff: string;
  date: string;
  timeSlot: string;
  status: 'scheduled' | 'rescheduled' | 'cancelled';
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    service: 'Consultation Session',
    staff: 'Jane Doe (Senior Consultant)',
    date: '',
    timeSlot: '09:00 AM'
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data.success) setBookings(res.data.bookings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/bookings', form);
      setIsModalOpen(false);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete booking slot?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardLayout title="Appointment Booking & Calendars">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800 rounded-[20px] p-4">
        <div>
          <h3 className="font-bold text-lg text-white">Client Bookings</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage schedules, consultations, and staff assignments.</p>
        </div>
        <button
          onClick={() => {
            setForm({ customerName: '', customerEmail: '', service: 'Consultation Session', staff: 'Jane Doe (Senior Consultant)', date: '', timeSlot: '09:00 AM' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl h-10 px-4 text-sm text-white font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading schedules...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Slots Table */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-[24px] overflow-hidden shadow-lg">
            <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-200 uppercase tracking-wider">Scheduled Bookings</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Client</th>
                    <th className="p-4">Service & Staff</th>
                    <th className="p-4">Time Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No scheduled bookings found.</td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-semibold text-white">{booking.customerName}</div>
                          <div className="text-xs text-slate-400">{booking.customerEmail}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-300 font-semibold">{booking.service}</div>
                          <div className="text-xs text-slate-500">{booking.staff}</div>
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                            <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{booking.timeSlot}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                            booking.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            booking.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          {booking.status === 'scheduled' && (
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                              className="text-xs text-rose-400 hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="text-slate-400 hover:text-rose-400 inline-block align-middle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats sidebar widget */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-[24px] p-6 space-y-6">
            <h4 className="font-bold text-white text-base">Schedule Analytics</h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total slots booked</span>
                <span className="text-lg font-bold text-white">{bookings.length}</span>
              </div>
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Active today</span>
                <span className="text-lg font-bold text-blue-400">{bookings.filter(b => b.status === 'scheduled').length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Create Booking Appointment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-slate-400">Client Name</label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="e.g. Charlie"
                  className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-slate-400">Client Email</label>
                <input
                  type="email"
                  required
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  placeholder="e.g. client@email.com"
                  className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-400">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-400">Time Slot</label>
                  <select
                    value={form.timeSlot}
                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-3 text-sm text-slate-300 focus:outline-none"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
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
                  className="bg-blue-600 hover:bg-blue-500 rounded-xl h-11 px-5 text-sm text-white font-semibold shadow-lg shadow-blue-600/20"
                >
                  Book Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
