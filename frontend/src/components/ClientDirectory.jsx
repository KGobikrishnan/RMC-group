import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  FileText,
  Loader2,
  Database
} from 'lucide-react';
import { fetchClients, saveClientToBackend, deleteClientFromBackend } from '../api/rmcApi';

export function ClientDirectoryPage({ setActiveTab, onSelectClient }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    role: 'Client / Owner',
    phone: '',
    altPhone: '',
    email: '',
    location: '',
    city: 'Theni',
    status: 'Active',
    address: ''
  });

  // Load clients from PostgreSQL database RMC
  const loadClients = async () => {
    try {
      setLoading(true);
      const res = await fetchClients();
      if (res.success) {
        setClients(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching clients from PostgreSQL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(c => {
    const clientName = c.name || '';
    const company = c.company || '';
    const location = c.location || '';
    const phone = c.phone || '';

    const matchesSearch = clientName.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || (c.status || 'Active') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.phone) return;
    try {
      setIsSubmitting(true);
      const payload = {
        name: newClient.name,
        company: newClient.company,
        role: newClient.role,
        phone: newClient.phone,
        altPhone: newClient.altPhone,
        email: newClient.email,
        location: newClient.location,
        city: newClient.city,
        status: newClient.status,
        address: newClient.address
      };
      const res = await saveClientToBackend(payload);
      if (res.success) {
        await loadClients();
        setShowAddModal(false);
        setNewClient({
          name: '',
          company: '',
          role: 'Client / Owner',
          phone: '',
          altPhone: '',
          email: '',
          location: '',
          city: 'Theni',
          status: 'Active',
          address: ''
        });
      }
    } catch (err) {
      console.error('Failed to save client to PostgreSQL:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this client record from database?')) return;
    try {
      const res = await deleteClientFromBackend(id);
      if (res.success) {
        setClients(clients.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete client:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Client Directory & CRM</h2>
          </div>
          <p className="text-xs text-indigo-200/80">
            Real-time client records stored in PostgreSQL Database <span className="font-mono font-bold text-amber-300">RMC</span>
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, site, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-medium outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-bold">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Status:</span>
          {['ALL', 'Active', 'In Progress', 'Completed', 'Prospect / Quoting'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-[11px] ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-semibold">Loading clients from PostgreSQL database RMC...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Clients Found in Database</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All static mock clients have been removed. Click below to add your first real client to PostgreSQL.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Client</span>
          </button>
        </div>
      ) : (
        /* Client Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((client) => {
            const contractVal = Number(client.total_portfolio_value) || 0;
            return (
              <div
                key={client.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 relative group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                        {client.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        client.status === 'Completed'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                          : client.status === 'In Progress'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : client.status === 'Prospect / Quoting'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {client.status || 'Active'}
                      </span>
                    </div>
                    {(client.company || client.role) && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {client.company} {client.role && `• ${client.role}`}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Contract</span>
                    <span className="text-base font-black text-blue-600 dark:text-blue-400">
                      ₹ {contractVal > 0 ? contractVal.toLocaleString('en-IN') : '0'}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {client.phone} {client.alt_phone && ` / ${client.alt_phone}`}
                      </span>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {(client.location || client.address) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{client.location || client.address}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400">
                    Projects: <b className="text-slate-700 dark:text-slate-300">{client.project_count || 0}</b>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteClient(client.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      title="Delete Client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (onSelectClient) onSelectClient(client);
                        if (setActiveTab) setActiveTab('inputs');
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm transition-all"
                    >
                      <span>Open Calc</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Add New Client to PostgreSQL</h3>
                  <p className="text-xs text-slate-400">Creates client in database RMC</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Er. M. Jahir Hussain"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Company / Firm</label>
                  <input
                    type="text"
                    placeholder="e.g. RM Construction"
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Designation / Role</label>
                  <input
                    type="text"
                    value={newClient.role}
                    onChange={(e) => setNewClient({ ...newClient, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Primary Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9489141122"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Site / Office Location</label>
                <input
                  type="text"
                  placeholder="e.g. Building Doctor Complex, Uthamapalayam"
                  value={newClient.location}
                  onChange={(e) => setNewClient({ ...newClient, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">City / District</label>
                  <input
                    type="text"
                    value={newClient.city}
                    onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Status</label>
                  <select
                    value={newClient.status}
                    onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Prospect / Quoting">Prospect / Quoting</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to DB...' : 'Save to PostgreSQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
