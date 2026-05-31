import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Plus, Search, Archive, Tag, DollarSign, Layers, Edit3, Trash2, X } from 'lucide-react';
import api from '../lib/axios';

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  warehouse: string;
  stock: number;
  price: number;
  supplier?: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Hardware',
    warehouse: 'Main Warehouse',
    stock: 0,
    price: 0,
    supplier: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      if (res.data.success) setProducts(res.data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', form);
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete item from inventory stock?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardLayout title="Shop & Warehouse Inventory">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800 rounded-[20px] p-4">
        <div>
          <h3 className="font-bold text-lg text-white">Stock Management</h3>
          <p className="text-xs text-slate-400 mt-0.5">Track warehouse levels, SKUs, and pricing margins.</p>
        </div>
        <button
          onClick={() => {
            const randomSKU = 'SKU-' + Math.floor(100000 + Math.random() * 900000);
            setForm({ name: '', sku: randomSKU, category: 'Hardware', warehouse: 'Main Warehouse', stock: 0, price: 0, supplier: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl h-10 px-4 text-sm text-white font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading catalog...</div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-[24px] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Product & SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Warehouse Location</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No inventory products registered.</td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-white flex items-center gap-2">
                          <Archive className="w-4 h-4 text-blue-500" />
                          <span>{prod.name}</span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{prod.sku}</div>
                      </td>
                      <td className="p-4 text-slate-300">{prod.category}</td>
                      <td className="p-4 text-slate-400">{prod.warehouse}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          prod.stock > 10 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-4 text-emerald-400 font-bold">${prod.price.toLocaleString()}</td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="text-slate-400 hover:text-rose-400 transition-colors"
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
      )}

      {/* New Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-slate-400">Product Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Next-Gen Server Rack"
                  className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-400">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-400">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-3 text-sm text-slate-300 focus:outline-none"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software License">Software License</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-400">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-400">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700/60 rounded-xl h-11 px-4 text-sm text-white focus:outline-none"
                  />
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
