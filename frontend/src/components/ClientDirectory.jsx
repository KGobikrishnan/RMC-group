import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';

const INITIAL_CLIENTS = [
  {
    id: 'cli-001',
    name: 'Er. M. Jahir Hussain',
    company: 'RM Construction & Consultancy',
    role: 'Managing Partner / Structural Er',
    phone: '+91 9489141122',
    altPhone: '+91 9111493336',
    email: 'jahir.rmc@gmail.com',
    location: 'Building Doctor Complex, Uthamapalayam - 625533',
    city: 'Theni District',
    status: 'Active',
    projectsCount: 3,
    activeProject: 'Residential Villa G+2',
    totalContractValue: '₹ 26,43,619',
    joinedDate: '12-Jan-2025'
  },
  {
    id: 'cli-002',
    name: 'Dr. K. Senthil Kumar',
    company: 'Sri Meenakshi Healthcare',
    role: 'Client / Land Owner',
    phone: '+91 9842109876',
    email: 'senthil.healthcare@gmail.com',
    location: 'Bypass Road, Opp Bus Stand, Periyakulam',
    city: 'Theni District',
    status: 'In Progress',
    projectsCount: 1,
    activeProject: 'Commercial Clinic & Residence',
    totalContractValue: '₹ 48,20,000',
    joinedDate: '04-Mar-2026'
  },
  {
    id: 'cli-003',
    name: 'Alhaj. Mohamed Ibrahim',
    company: 'Star Agro Impex',
    role: 'Managing Director',
    phone: '+91 9750012345',
    email: 'staragro.ibrahim@yahoo.com',
    location: 'Main Bazaar, Chinnamanur',
    city: 'Theni District',
    status: 'Completed',
    projectsCount: 2,
    activeProject: 'Modern Duplex Bungalow',
    totalContractValue: '₹ 38,90,000',
    joinedDate: '18-Aug-2025'
  },
  {
    id: 'cli-004',
    name: 'Mrs. Jayalakshmi Anand',
    company: 'Anand Tex Mills',
    role: 'Proprietor',
    phone: '+91 9443276543',
    email: 'anandtex.j@gmail.com',
    location: 'Near Cotton Market, Cumbum',
    city: 'Theni District',
    status: 'Prospect / Quoting',
    projectsCount: 1,
    activeProject: 'Proposed 3BHK Independent Villa',
    totalContractValue: '₹ 32,50,000',
    joinedDate: '01-Nov-2026'
  }
];

export function ClientDirectoryPage({ setActiveTab, onSelectClient }) {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    role: 'Client / Owner',
    phone: '',
    email: '',
    location: '',
    city: 'Theni',
    activeProject: 'New Residential Villa',
    totalContractValue: '₹ 25,00,000'
  });

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.phone) return;
    const added = {
      ...newClient,
      id: `cli-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      projectsCount: 1,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setClients([added, ...clients]);
    setShowAddModal(false);
    setNewClient({
      name: '',
      company: '',
      role: 'Client / Owner',
      phone: '',
      email: '',
      location: '',
      city: 'Theni',
      activeProject: 'New Residential Villa',
      totalContractValue: '₹ 25,00,000'
    });
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
            Manage clients, contact profiles, site locations, and linked project estimations
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

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, site, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-400 font-semibold mr-1">Status:</span>
          {['ALL', 'Active', 'In Progress', 'Completed', 'Prospect / Quoting'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {c.name}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      c.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' :
                      c.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400' :
                      c.status === 'Completed' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400' :
                      'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {c.company} • <span className="text-slate-400">{c.role}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Contract</span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {c.totalContractValue}
                  </span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="pt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{c.phone} {c.altPhone && <span className="text-slate-400 font-normal">/ {c.altPhone}</span>}</span>
                </div>
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{c.location}</span>
                </div>
              </div>
            </div>

            {/* Linked Project Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Estimation</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {c.activeProject}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectClient) onSelectClient(c);
                    setActiveTab('quotation');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-bold transition-colors flex items-center gap-1 text-[11px]"
                  title="Open Client Quotation"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Quote</span>
                </button>
                <button
                  onClick={() => {
                    if (onSelectClient) onSelectClient(c);
                    setActiveTab('inputs');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center gap-1 text-[11px]"
                  title="Open Estimation Inputs"
                >
                  <span>Open Calc</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Register New Client</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                  <label className="text-slate-500 font-semibold block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. RM Construction"
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Role / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Land Owner"
                    value={newClient.role}
                    onChange={(e) => setNewClient({ ...newClient, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Primary Phone Number *</label>
                  <input
                    type="text"
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
                  <label className="text-slate-500 font-semibold block mb-1">Active Project Title</label>
                  <input
                    type="text"
                    value={newClient.activeProject}
                    onChange={(e) => setNewClient({ ...newClient, activeProject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Estimated Budget (₹)</label>
                  <input
                    type="text"
                    value={newClient.totalContractValue}
                    onChange={(e) => setNewClient({ ...newClient, totalContractValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md transition-colors"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

