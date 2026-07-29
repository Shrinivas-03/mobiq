"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Smartphone, 
  LogOut, 
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Menu,
  X,
  Eye,
  Star,
  Trash2,
  Plus,
  Film,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('analytics');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actualAmount, setActualAmount] = useState<string>('');
  const [inventory, setInventory] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [queryFilter, setQueryFilter] = useState('all');
  const [invSearchQuery, setInvSearchQuery] = useState('');
  const [invStatusFilter, setInvStatusFilter] = useState('all');
  const [invBrandFilter, setInvBrandFilter] = useState('all');

  // Testimonials tab states
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newInstagramUrl, setNewInstagramUrl] = useState('');
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);

  // Catalog tab states
  const [catalogBrands, setCatalogBrands] = useState<any[]>([]);
  const [catalogModels, setCatalogModels] = useState<any[]>([]);
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<string>('all');
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [isEditingModel, setIsEditingModel] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [brandForm, setBrandForm] = useState({ id: '', name: '', logo_url: '/apple.png' });

  const DEFAULT_PRICING_CONFIG = {
    battery: {
      type: 'android',
      deductions: { High: 0, Average: 1200, Poor: 3000 },
      iphoneDeductions: { "95_100": 0, "90_94": 800, "85_89": 1800, "80_84": 3500, "75_79": 5500, "below_75": 8000 }
    },
    variantMultipliers: { "6_128": 0.85, "8_128": 0.90, "8_256": 1.00, "12_256": 1.08, "12_512": 1.15 },
    ageDeductions: { "0_3": 0.05, "3_6": 0.12, "6_11": 0.22, "11_plus": 0.38 },
    hardware: { screen: 3000, dead: 3500, body: 1200, panel: 2400, touch: 2700, button: 1000, bent: 2000, loose: 1500 },
    software: { wifi: 1200, mic: 1200, faceid: 2500, charge: 1200, camera: 2000, bluetooth: 1000, fingerprint: 1200 },
    accessories: { box: 500, charger: 300, invoice: 400, warranty: 800 }
  };

  const [modelForm, setModelForm] = useState({
    id: '',
    brand_id: 'apple',
    name: '',
    base_price: 30000,
    pricing_config: JSON.parse(JSON.stringify(DEFAULT_PRICING_CONFIG))
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/brands/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setBrandForm((prev) => ({ ...prev, logo_url: data.url }));
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      alert('Failed to upload logo image.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const fetchCatalogBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      const data = await res.json();
      if (data.success) setCatalogBrands(data.brands || []);
    } catch (err) {
      console.error('Error fetching admin brands', err);
    }
  };

  const fetchCatalogModels = async () => {
    try {
      const res = await fetch('/api/admin/models');
      const data = await res.json();
      if (data.success) setCatalogModels(data.models || []);
    } catch (err) {
      console.error('Error fetching admin models', err);
    }
  };

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (data.success) {
          setIsAdmin(true);
          fetchLeads();
          fetchInventory();
          fetchQueries();
          fetchTestimonials();
          fetchCatalogBrands();
          fetchCatalogModels();
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/sell/submit');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      if (data.success) setInventory(data.items || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const fetchQueries = async (status = 'all') => {
    try {
      const res = await fetch(`/api/contact?status=${status}`);
      const data = await res.json();
      if (data.success) setQueries(data.queries || []);
    } catch (err) { console.error('Error fetching queries:', err); }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newModelName.trim() || !newInstagramUrl.trim()) {
      alert("All fields are required");
      return;
    }
    setIsSubmittingTestimonial(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: newClientName,
          model_name: newModelName,
          instagram_url: newInstagramUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewClientName('');
        setNewModelName('');
        setNewInstagramUrl('');
        fetchTestimonials();
        alert("Testimonial added successfully!");
      } else {
        alert(data.error || "Failed to add testimonial");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setIsSubmittingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
      } else {
        alert(data.error || "Failed to delete testimonial");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const updateQueryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setQueries(q => q.map(i => i.id === id ? { ...i, status } : i));
      }
    } catch (err) { console.error(err); }
  };

  const updateInventoryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInventory(inv => inv.map(i => i.id === id ? { ...i, status: newStatus } : i));
      } else {
        alert(data.error || 'Failed to update inventory status');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string, amount?: number) => {
    setIsUpdatingStatus(true);
    try {
      const body: Record<string, unknown> = { id, status: newStatus };
      if (amount !== undefined) body.actualAmount = amount;

      const res = await fetch('/api/sell/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        const updatedLead = { ...( leads.find(l => l.id === id) ?? {}), status: newStatus, actual_amount: amount ?? null };
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus, actual_amount: amount ?? l.actual_amount } : l));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus, actual_amount: amount ?? selectedLead.actual_amount });
        }
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error(error);
      alert('Network error while updating status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Inventory filter state
  const uniqueInvBrands = Array.from(new Set(inventory.map((i: any) => i.brand_name))).filter(Boolean);
  const filteredInventory = inventory.filter((item: any) => {
    const matchStatus = invStatusFilter === 'all' || item.status === invStatusFilter;
    const matchBrand  = invBrandFilter === 'all'  || item.brand_name === invBrandFilter;
    const q = invSearchQuery.toLowerCase();
    const matchSearch = !q ||
      item.model_name?.toLowerCase().includes(q) ||
      item.brand_name?.toLowerCase().includes(q) ||
      item.variant_name?.toLowerCase().includes(q) ||
      item.condition_summary?.toLowerCase().includes(q);
    return matchStatus && matchBrand && matchSearch;
  });

  // Leads filter state
  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter]   = useState('all');

  // Filtered leads
  const uniqueBrands = Array.from(new Set(leads.map((l: any) => l.brand_name))).filter(Boolean);
  const filteredLeads = leads.filter((lead: any) => {
    const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchBrand  = brandFilter === 'all'  || lead.brand_name === brandFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      lead.customer_name?.toLowerCase().includes(q) ||
      lead.customer_phone?.includes(q) ||
      lead.model_name?.toLowerCase().includes(q) ||
      lead.city?.toLowerCase().includes(q);
    return matchStatus && matchBrand && matchSearch;
  });

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'leads', label: 'Leads View', icon: Users },
    { id: 'queries', label: 'Support Queries', icon: MessageSquare },
    { id: 'catalog', label: 'Sell Catalog (Brands/Models)', icon: Database },
    { id: 'models', label: 'Models in Stock', icon: Smartphone },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
  ];

  // Analytics computations
  const totalLeads      = leads.length;
  const pendingLeads    = leads.filter(l => l.status === 'pending').length;
  const contactedLeads  = leads.filter(l => l.status === 'contacted').length;
  const pickedUpLeads   = leads.filter(l => l.status === 'picked_up').length;
  const completedLeads  = leads.filter(l => l.status === 'completed').length;
  const cancelledLeads  = leads.filter(l => l.status === 'cancelled').length;
  const totalQuotedValue   = leads.reduce((acc, curr) => acc + (curr.quoted_price  || 0), 0);
  const totalActualValue   = leads.filter(l => l.actual_amount).reduce((acc, curr) => acc + (curr.actual_amount || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`fixed md:relative z-20 w-64 bg-zinc-950 text-white min-h-screen transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">MobiQ Admin</h1>
          <button className="md:hidden text-zinc-400" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col min-h-screen">
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-zinc-600" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-zinc-800 capitalize">{activeTab.replace('_', ' ')}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 overflow-auto">
          <AnimatePresence mode="wait">
            
            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Row 1 — Overview numbers */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                  {[
                    { label: 'Total Leads',  value: totalLeads,     color: 'blue',   icon: '📋' },
                    { label: 'Pending',       value: pendingLeads,   color: 'amber',  icon: '⏳' },
                    { label: 'Contacted',     value: contactedLeads, color: 'indigo', icon: '📞' },
                    { label: 'Cancelled',     value: cancelledLeads, color: 'red',    icon: '✕' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-3">
                      <span className="text-2xl">{stat.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-3xl font-black text-zinc-900 mt-0.5">{stat.value}</h3>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 2 — Pipeline status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200 flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🛵</div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Scheduled Pickup</p>
                      <h3 className="text-4xl font-black text-zinc-900">{pickedUpLeads}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200 flex items-center gap-5">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">✅</div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Completed</p>
                      <h3 className="text-4xl font-black text-zinc-900">{completedLeads}</h3>
                    </div>
                  </div>
                </div>

                {/* Row 3 — Financial summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Total Quoted Value</p>
                    <h3 className="text-3xl font-black text-zinc-900">₹{totalQuotedValue.toLocaleString('en-IN')}</h3>
                    <p className="text-xs text-blue-400 mt-1">Across all {totalLeads} leads</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Total Actual Paid</p>
                    <h3 className="text-3xl font-black text-zinc-900">₹{totalActualValue.toLocaleString('en-IN')}</h3>
                    <p className="text-xs text-green-500 mt-1">From {completedLeads} completed orders</p>
                  </div>
                </div>

                {/* Pipeline Progress Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                  <h4 className="text-sm font-bold text-zinc-700 mb-4">Lead Pipeline Overview</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Pending',     count: pendingLeads,   total: totalLeads || 1, color: 'bg-amber-400'  },
                      { label: 'Contacted',   count: contactedLeads, total: totalLeads || 1, color: 'bg-indigo-400' },
                      { label: 'Pickup',      count: pickedUpLeads,  total: totalLeads || 1, color: 'bg-orange-400' },
                      { label: 'Completed',   count: completedLeads, total: totalLeads || 1, color: 'bg-green-500'  },
                    ].map(row => (
                      <div key={row.label} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-zinc-500 w-20 shrink-0">{row.label}</span>
                        <div className="flex-1 bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`${row.color} h-2.5 rounded-full transition-all duration-700`}
                            style={{ width: `${Math.round((row.count / row.total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-zinc-700 w-6 text-right">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LEADS TAB */}
            {activeTab === 'leads' && (
              <motion.div key="leads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                  <div className="p-5 border-b border-zinc-200">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                      <h3 className="text-lg font-bold text-zinc-800">Sell Leads
                        <span className="ml-2 text-sm font-medium text-zinc-400">({filteredLeads.length} of {leads.length})</span>
                      </h3>
                      <div className="flex flex-wrap gap-2 items-center">
                        {/* Search */}
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                          <input
                            type="text"
                            placeholder="Name, phone, model, city..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-52"
                          />
                        </div>
                        {/* Status filter */}
                        <select
                          value={statusFilter}
                          onChange={e => setStatusFilter(e.target.value)}
                          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="picked_up">Scheduled Pickup</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {/* Brand filter */}
                        <select
                          value={brandFilter}
                          onChange={e => setBrandFilter(e.target.value)}
                          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="all">All Brands</option>
                          {uniqueBrands.map(b => <option key={String(b)} value={String(b)}>{String(b)}</option>)}
                        </select>
                        {/* Clear */}
                        {(searchQuery || statusFilter !== 'all' || brandFilter !== 'all') && (
                          <button
                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setBrandFilter('all'); }}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-2 rounded-lg hover:bg-red-50 transition-all"
                          >✕ Clear</button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600">
                      <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-6 py-4">Lead ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Device</th>
                          <th className="px-6 py-4">City</th>
                          <th className="px-6 py-4">Quoted Price</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {filteredLeads.map((lead: any) => (
                          <tr key={lead.id} className="hover:bg-zinc-50">
                            <td className="px-6 py-4">
                              <p className="font-mono text-zinc-900 text-sm">{lead.id.substring(0, 8)}...</p>
                              <p className="text-xs text-zinc-400 mt-0.5">{new Date(lead.created_at).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-zinc-900">{lead.customer_name}</p>
                              <p className="text-xs text-zinc-500 mt-0.5">{lead.customer_phone}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-zinc-800">{lead.brand_name} {lead.model_name}</span>
                              <br/>
                              <span className="text-xs text-zinc-500">{lead.variant_name}</span>
                            </td>
                            <td className="px-6 py-4">{lead.city}</td>
                            <td className="px-6 py-4 font-bold text-green-600">₹{lead.quoted_price?.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                lead.status === 'completed' ? 'bg-green-100 text-green-700' :
                                lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                lead.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-zinc-100 text-zinc-700'
                              }`}>
                                {lead.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => setSelectedLead(lead)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                <Eye className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {leads.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                              No sell leads available yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* QUERIES TAB */}
            {activeTab === 'queries' && (
              <motion.div key="queries" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                  <div className="p-5 border-b border-zinc-200">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-800">Contact Queries
                          <span className="ml-2 text-sm font-medium text-zinc-400">({queries.length})</span>
                        </h3>
                        <p className="text-zinc-500 text-xs mt-0.5">Customer support requests from the Contact Us form.</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {(['all','new','in_progress','resolved','closed'] as const).map(s => (
                          <button key={s}
                            onClick={() => { setQueryFilter(s); fetchQueries(s); }}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${queryFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-zinc-500 border-zinc-300 hover:border-blue-400'}`}
                          >
                            {s === 'all' ? 'All' : s.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </button>
                        ))}
                        <button onClick={() => fetchQueries(queryFilter)} className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-all">↻ Refresh</button>
                      </div>
                    </div>
                  </div>

                  {queries.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 bg-zinc-50">
                      <MessageSquare className="w-10 h-10 mx-auto text-zinc-300 mb-3" />
                      <p className="font-medium">No queries found.</p>
                      <p className="text-xs mt-1">Queries submitted via the Contact Us form will appear here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100">
                      {queries.map((q: any) => (
                        <div key={q.id} className="p-5 hover:bg-zinc-50 transition-colors">
                          <div className="flex flex-wrap gap-3 items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-bold text-zinc-900">{q.name}</span>
                                <span className="text-zinc-400 text-xs">·</span>
                                <a href={`mailto:${q.email}`} className="text-blue-600 text-sm hover:underline">{q.email}</a>
                                <span className="text-zinc-400 text-xs">·</span>
                                <span className="text-zinc-400 text-xs">{new Date(q.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-sm font-semibold text-zinc-800 mb-1">{q.subject}</p>
                              <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">{q.message}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <select
                                value={q.status}
                                onChange={e => updateQueryStatus(q.id, e.target.value)}
                                className={`text-xs font-bold border rounded-lg px-3 py-1.5 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500
                                  ${q.status === 'new'         ? 'bg-blue-50   border-blue-200   text-blue-700'   :
                                    q.status === 'in_progress' ? 'bg-amber-50  border-amber-200  text-amber-700'  :
                                    q.status === 'resolved'    ? 'bg-green-50  border-green-200  text-green-700'  :
                                    'bg-zinc-100 border-zinc-200 text-zinc-500'}`}
                              >
                                <option value="new">New</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                              </select>
                              <a href={`mailto:${q.email}?subject=Re: ${encodeURIComponent(q.subject)}`}
                                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                              >Reply</a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SELL CATALOG (BRANDS & MODELS) TAB */}
            {activeTab === 'catalog' && (
              <motion.div key="catalog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Brands Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-800">Phone Brands</h3>
                      <p className="text-sm text-zinc-500">Manage brands available on the sell page</p>
                    </div>
                    <button
                      onClick={() => setIsAddingBrand(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all shadow-md text-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Brand
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {catalogBrands.map((b) => (
                      <div key={b.id} className="p-3 border border-zinc-200 rounded-xl bg-zinc-50/50 flex flex-col items-center justify-between text-center relative group">
                        <img src={b.logo_url} alt={b.name} className="h-10 w-10 object-contain mb-2" />
                        <span className="font-semibold text-xs text-zinc-800">{b.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono mb-2">id: {b.id}</span>
                        
                        <div className="flex items-center gap-1.5 w-full justify-center">
                          <button
                            onClick={async () => {
                              await fetch('/api/admin/brands', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: b.id, is_active: !b.is_active }),
                              });
                              fetchCatalogBrands();
                            }}
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-600'}`}
                          >
                            {b.is_active ? 'Active' : 'Disabled'}
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete brand ${b.name}?`)) {
                                await fetch(`/api/admin/brands?id=${b.id}`, { method: 'DELETE' });
                                fetchCatalogBrands();
                              }
                            }}
                            className="p-1 text-zinc-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Models Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                  <div className="p-5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-800">Phone Models & Base Pricing</h3>
                      <p className="text-sm text-zinc-500">Manage device models and base pricing quotes stored in Supabase DB</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedCatalogBrand}
                        onChange={(e) => setSelectedCatalogBrand(e.target.value)}
                        className="bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-2 rounded-xl"
                      >
                        <option value="all">All Brands</option>
                        {catalogBrands.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setModelForm({
                            id: '',
                            brand_id: catalogBrands[0]?.id || 'apple',
                            name: '',
                            base_price: 30000,
                            pricing_config: { ...DEFAULT_PRICING_CONFIG }
                          });
                          setIsEditingModel(false);
                          setIsAddingModel(true);
                        }}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl transition-all shadow-md text-sm"
                      >
                        <Plus className="w-4 h-4" /> Add Model
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600">
                      <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase font-semibold border-b border-zinc-200">
                        <tr>
                          <th className="px-6 py-4">Brand</th>
                          <th className="px-6 py-4">Model Name</th>
                          <th className="px-6 py-4">Model ID</th>
                          <th className="px-6 py-4">Base Price Quote</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {catalogModels
                          .filter((m) => selectedCatalogBrand === 'all' || m.brand_id === selectedCatalogBrand)
                          .map((m) => (
                            <tr key={m.id} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-zinc-800 uppercase text-xs">{m.brand_id}</td>
                              <td className="px-6 py-4 font-bold text-zinc-900">{m.name}</td>
                              <td className="px-6 py-4 font-mono text-xs text-zinc-500">{m.id}</td>
                              <td className="px-6 py-4 font-semibold text-green-600">₹{m.base_price?.toLocaleString('en-IN')}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${m.is_active ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-600'}`}>
                                  {m.is_active ? 'Active' : 'Disabled'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button
                                  onClick={() => {
                                  const dbConfig = m.pricing_config || {};
                                  const mergedConfig = {
                                    ...DEFAULT_PRICING_CONFIG,
                                    ...dbConfig,
                                    battery: {
                                      ...DEFAULT_PRICING_CONFIG.battery,
                                      ...(dbConfig.battery || {})
                                    },
                                    accessories: {
                                      ...DEFAULT_PRICING_CONFIG.accessories,
                                      ...(dbConfig.accessories || {})
                                    }
                                  };
                                  setModelForm({
                                    id: m.id,
                                    brand_id: m.brand_id,
                                    name: m.name,
                                    base_price: m.base_price,
                                    pricing_config: mergedConfig
                                  });
                                  setIsEditingModel(true);
                                  setIsAddingModel(true);
                                }}
                                  className="text-xs text-indigo-600 hover:underline font-semibold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    await fetch('/api/admin/models', {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: m.id, is_active: !m.is_active }),
                                    });
                                    fetchCatalogModels();
                                  }}
                                  className="text-xs text-blue-600 hover:underline font-medium"
                                >
                                  Toggle Status
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`Delete model ${m.name}?`)) {
                                      await fetch(`/api/admin/models?id=${m.id}`, { method: 'DELETE' });
                                      fetchCatalogModels();
                                    }
                                  }}
                                  className="text-xs text-red-600 hover:underline font-medium"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Brand Modal */}
                {isAddingBrand && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                      <h4 className="text-lg font-bold text-zinc-900">Add New Phone Brand</h4>
                      <div>
                        <label className="text-xs font-semibold text-zinc-600">Brand Unique ID (slug)</label>
                        <input
                          type="text"
                          placeholder="e.g. google, nothing, xiaomi"
                          value={brandForm.id}
                          onChange={(e) => setBrandForm({ ...brandForm, id: e.target.value })}
                          className="w-full border border-zinc-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-600">Display Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Google, Nothing, Xiaomi"
                          value={brandForm.name}
                          onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                          className="w-full border border-zinc-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-600 block mb-1">Brand Logo Image</label>
                        <div className="flex items-center gap-3 bg-zinc-50 border border-dashed border-zinc-300 rounded-xl p-3">
                          {brandForm.logo_url ? (
                            <img src={brandForm.logo_url} alt="Logo preview" className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-zinc-200" />
                          ) : (
                            <div className="w-12 h-12 bg-zinc-200 rounded-lg flex items-center justify-center text-xs text-zinc-500 font-medium">Logo</div>
                          )}
                          <div className="flex-1">
                            <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs rounded-lg cursor-pointer transition-colors border border-blue-200">
                              <span>{isUploadingLogo ? 'Uploading to Supabase...' : 'Upload from Mobile / PC'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={isUploadingLogo}
                                className="hidden"
                              />
                            </label>
                            <p className="text-[11px] text-zinc-400 mt-1">PNG, JPG, SVG supported. Stored in Supabase.</p>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Or paste image URL (e.g. /apple.png)"
                          value={brandForm.logo_url}
                          onChange={(e) => setBrandForm({ ...brandForm, logo_url: e.target.value })}
                          className="w-full border border-zinc-200 rounded-lg p-2 text-xs mt-2 text-zinc-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setIsAddingBrand(false)}
                          className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            if (!brandForm.id || !brandForm.name) return alert('ID and Name required');
                            await fetch('/api/admin/brands', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(brandForm),
                            });
                            setIsAddingBrand(false);
                            setBrandForm({ id: '', name: '', logo_url: '/apple.png' });
                            fetchCatalogBrands();
                          }}
                          className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow"
                        >
                          Save Brand
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                 {/* Add / Edit Model Modal */}
                {isAddingModel && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                        <h4 className="text-lg font-bold text-zinc-900">
                          {isEditingModel ? 'Edit Phone Model' : 'Add New Phone Model'}
                        </h4>
                        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">Pricing Config Enabled</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Column 1: Basic Info */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-semibold text-zinc-600">Select Brand</label>
                            <select
                              value={modelForm.brand_id}
                              onChange={(e) => {
                                const isApple = e.target.value === 'apple';
                                setModelForm({
                                  ...modelForm,
                                  brand_id: e.target.value,
                                  pricing_config: {
                                    ...modelForm.pricing_config,
                                    battery: { type: isApple ? 'iphone' : 'android' }
                                  }
                                });
                              }}
                              disabled={isEditingModel}
                              className="w-full border border-zinc-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                            >
                              {catalogBrands.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-zinc-600">Model Unique ID (slug)</label>
                            <input
                              type="text"
                              placeholder="e.g. p8p, s24u, ip16pm"
                              value={modelForm.id}
                              onChange={(e) => setModelForm({ ...modelForm, id: e.target.value.toLowerCase().trim() })}
                              disabled={isEditingModel}
                              className="w-full border border-zinc-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-zinc-600">Model Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Pixel 8 Pro, Galaxy S24 Ultra"
                              value={modelForm.name}
                              onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                              className="w-full border border-zinc-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-zinc-600">Base Price Quote (₹)</label>
                            <input
                              type="number"
                              placeholder="50000"
                              value={modelForm.base_price}
                              onChange={(e) => setModelForm({ ...modelForm, base_price: Number(e.target.value) })}
                              className="w-full border border-zinc-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-zinc-600">Battery Health Deductions Type</label>
                            <select
                              value={modelForm.pricing_config.battery.type}
                              onChange={(e) => setModelForm({
                                ...modelForm,
                                pricing_config: {
                                  ...modelForm.pricing_config,
                                  battery: { type: e.target.value as 'iphone' | 'android' }
                                }
                              })}
                              className="w-full border border-zinc-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="android">Android (Quality Grade: High/Average/Poor)</option>
                              <option value="iphone">iPhone (Percentage-based curve)</option>
                            </select>
                          </div>
                        </div>

                        {/* Column 2: Multipliers & Age Depreciation */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-zinc-700 block mb-1">Variant Multipliers</label>
                            <div className="grid grid-cols-2 gap-2 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                              {Object.keys(DEFAULT_PRICING_CONFIG.variantMultipliers).map((variantKey) => (
                                <div key={variantKey} className="flex flex-col">
                                  <span className="text-[10px] text-zinc-500 font-medium">{variantKey.replace('_', 'GB / ')}GB</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={modelForm.pricing_config.variantMultipliers[variantKey as keyof typeof DEFAULT_PRICING_CONFIG.variantMultipliers]}
                                    onChange={(e) => setModelForm({
                                      ...modelForm,
                                      pricing_config: {
                                        ...modelForm.pricing_config,
                                        variantMultipliers: {
                                          ...modelForm.pricing_config.variantMultipliers,
                                          [variantKey]: Number(e.target.value)
                                        }
                                      }
                                    })}
                                    className="border border-zinc-300 rounded p-1 text-xs mt-0.5 focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-zinc-700 block mb-1">Age Depreciation Deductions</label>
                            <div className="grid grid-cols-2 gap-2 border border-zinc-200 rounded-xl p-3 bg-zinc-50/50">
                              {Object.keys(DEFAULT_PRICING_CONFIG.ageDeductions).map((ageKey) => (
                                <div key={ageKey} className="flex flex-col">
                                  <span className="text-[10px] text-zinc-500 font-medium">
                                    {ageKey === '0_3' ? '0-3 Months' : ageKey === '3_6' ? '3-6 Months' : ageKey === '6_11' ? '6-11 Months' : 'Above 11 Months'}
                                  </span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={modelForm.pricing_config.ageDeductions[ageKey as keyof typeof DEFAULT_PRICING_CONFIG.ageDeductions]}
                                    onChange={(e) => setModelForm({
                                      ...modelForm,
                                      pricing_config: {
                                        ...modelForm.pricing_config,
                                        ageDeductions: {
                                          ...modelForm.pricing_config.ageDeductions,
                                          [ageKey]: Number(e.target.value)
                                        }
                                      }
                                    })}
                                    className="border border-zinc-300 rounded p-1 text-xs mt-0.5"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Hardware & Software Repair Deductions */}
                      <div className="border-t border-zinc-200 pt-4">
                        <label className="text-xs font-bold text-zinc-800 block mb-2">Hardware Repair Cost Deductions (₹)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-zinc-200 rounded-xl p-3.5 bg-zinc-50/50">
                          {Object.keys(DEFAULT_PRICING_CONFIG.hardware).map((hwKey) => (
                            <div key={hwKey} className="flex flex-col">
                              <span className="text-[10px] text-zinc-600 font-medium capitalize">{hwKey} Issue</span>
                              <input
                                type="number"
                                value={modelForm.pricing_config.hardware[hwKey as keyof typeof DEFAULT_PRICING_CONFIG.hardware]}
                                onChange={(e) => setModelForm({
                                  ...modelForm,
                                  pricing_config: {
                                    ...modelForm.pricing_config,
                                    hardware: {
                                      ...modelForm.pricing_config.hardware,
                                      [hwKey]: Number(e.target.value)
                                    }
                                  }
                                })}
                                className="border border-zinc-300 rounded p-1.5 text-xs mt-0.5"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-zinc-200 pt-4">
                        <label className="text-xs font-bold text-zinc-800 block mb-2">Software Issue Cost Deductions (₹)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-zinc-200 rounded-xl p-3.5 bg-zinc-50/50">
                          {Object.keys(DEFAULT_PRICING_CONFIG.software).map((swKey) => (
                            <div key={swKey} className="flex flex-col">
                              <span className="text-[10px] text-zinc-600 font-medium capitalize">{swKey === 'faceid' ? 'Face ID / Fingerprint' : swKey}</span>
                              <input
                                type="number"
                                value={modelForm.pricing_config.software[swKey as keyof typeof DEFAULT_PRICING_CONFIG.software]}
                                onChange={(e) => setModelForm({
                                  ...modelForm,
                                  pricing_config: {
                                    ...modelForm.pricing_config,
                                    software: {
                                      ...modelForm.pricing_config.software,
                                      [swKey]: Number(e.target.value)
                                    }
                                  }
                                })}
                                className="border border-zinc-300 rounded p-1.5 text-xs mt-0.5"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Accessories Section */}
                      <div className="border-t border-zinc-200 pt-4">
                        <label className="text-xs font-bold text-zinc-800 block mb-2">Accessory Bonuses (₹ added to price)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-zinc-200 rounded-xl p-3.5 bg-zinc-50/50">
                          {Object.keys(DEFAULT_PRICING_CONFIG.accessories).map((accKey) => (
                            <div key={accKey} className="flex flex-col">
                              <span className="text-[10px] text-zinc-600 font-medium capitalize">Has {accKey}</span>
                              <input
                                type="number"
                                value={modelForm.pricing_config.accessories?.[accKey as keyof typeof DEFAULT_PRICING_CONFIG.accessories] ?? 0}
                                onChange={(e) => setModelForm({
                                  ...modelForm,
                                  pricing_config: {
                                    ...modelForm.pricing_config,
                                    accessories: {
                                      ...(modelForm.pricing_config.accessories || {}),
                                      [accKey]: Number(e.target.value)
                                    }
                                  }
                                })}
                                className="border border-zinc-300 rounded p-1.5 text-xs mt-0.5"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Battery Deductions Detail Section */}
                      <div className="border-t border-zinc-200 pt-4">
                        <label className="text-xs font-bold text-zinc-800 block mb-2">
                          Battery Health Deductions Details (₹)
                        </label>
                        {modelForm.pricing_config.battery.type === 'iphone' ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border border-zinc-200 rounded-xl p-3.5 bg-zinc-50/50">
                            {Object.keys(DEFAULT_PRICING_CONFIG.battery.iphoneDeductions).map((curveKey) => (
                              <div key={curveKey} className="flex flex-col">
                                <span className="text-[10px] text-zinc-600 font-medium">
                                  {curveKey === 'below_75' ? 'Below 75%' : `${curveKey.replace('_', ' - ')}%`}
                                </span>
                                <input
                                  type="number"
                                  value={modelForm.pricing_config.battery.iphoneDeductions?.[curveKey] ?? 0}
                                  onChange={(e) => setModelForm({
                                    ...modelForm,
                                    pricing_config: {
                                      ...modelForm.pricing_config,
                                      battery: {
                                        ...modelForm.pricing_config.battery,
                                        iphoneDeductions: {
                                          ...(modelForm.pricing_config.battery.iphoneDeductions || {}),
                                          [curveKey]: Number(e.target.value)
                                        }
                                      }
                                    }
                                  })}
                                  className="border border-zinc-300 rounded p-1.5 text-xs mt-0.5"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3 border border-zinc-200 rounded-xl p-3.5 bg-zinc-50/50">
                            {Object.keys(DEFAULT_PRICING_CONFIG.battery.deductions).map((condKey) => (
                              <div key={condKey} className="flex flex-col">
                                <span className="text-[10px] text-zinc-600 font-medium capitalize">{condKey} Grade</span>
                                <input
                                  type="number"
                                  value={modelForm.pricing_config.battery.deductions?.[condKey] ?? 0}
                                  onChange={(e) => setModelForm({
                                    ...modelForm,
                                    pricing_config: {
                                      ...modelForm.pricing_config,
                                      battery: {
                                        ...modelForm.pricing_config.battery,
                                        deductions: {
                                          ...(modelForm.pricing_config.battery.deductions || {}),
                                          [condKey]: Number(e.target.value)
                                        }
                                      }
                                    }
                                  })}
                                  className="border border-zinc-300 rounded p-1.5 text-xs mt-0.5"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200">
                        <button
                          onClick={() => setIsAddingModel(false)}
                          className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            if (!modelForm.id || !modelForm.name || !modelForm.base_price) return alert('All fields required');
                            
                            const method = isEditingModel ? 'PUT' : 'POST';
                            await fetch('/api/admin/models', {
                              method,
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(modelForm),
                            });

                            setIsAddingModel(false);
                            setModelForm({
                              id: '',
                              brand_id: 'apple',
                              name: '',
                              base_price: 30000,
                              pricing_config: JSON.parse(JSON.stringify(DEFAULT_PRICING_CONFIG))
                            });
                            fetchCatalogModels();
                          }}
                          className="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium shadow"
                        >
                          {isEditingModel ? 'Save Changes' : 'Create Model'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* MODELS IN STOCK TAB */}
            {activeTab === 'models' && (
              <motion.div key="models" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                  <div className="p-5 border-b border-zinc-200">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-800">Device Inventory
                          <span className="ml-2 text-sm font-medium text-zinc-400">({filteredInventory.length} of {inventory.length})</span>
                        </h3>
                        <p className="text-sm text-zinc-500 mt-0.5">Devices acquired from completed sell leads. Update status after selling.</p>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        {/* Search */}
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                          <input
                            type="text"
                            placeholder="Model, variant, condition..."
                            value={invSearchQuery}
                            onChange={e => setInvSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-52"
                          />
                        </div>
                        {/* Status filter */}
                        <select
                          value={invStatusFilter}
                          onChange={e => setInvStatusFilter(e.target.value)}
                          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="all">All Statuses</option>
                          <option value="in_stock">In Stock</option>
                          <option value="refurbishing">Refurbishing</option>
                          <option value="sold">Sold</option>
                          <option value="disposed">Disposed</option>
                        </select>
                        {/* Brand filter */}
                        <select
                          value={invBrandFilter}
                          onChange={e => setInvBrandFilter(e.target.value)}
                          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="all">All Brands</option>
                          {uniqueInvBrands.map(b => <option key={String(b)} value={String(b)}>{String(b)}</option>)}
                        </select>
                        
                        <button onClick={fetchInventory} className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
                          ↻ Refresh
                        </button>

                        {/* Clear */}
                        {(invSearchQuery || invStatusFilter !== 'all' || invBrandFilter !== 'all') && (
                          <button
                            onClick={() => { setInvSearchQuery(''); setInvStatusFilter('all'); setInvBrandFilter('all'); }}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-2 rounded-lg hover:bg-red-50 transition-all"
                          >✕ Clear</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary Pills */}
                  <div className="px-6 py-4 bg-zinc-50/60 border-b border-zinc-200 flex flex-wrap gap-3">
                    {(['in_stock','refurbishing','sold','disposed'] as const).map(s => {
                      const count = inventory.filter(i => i.status === s).length;
                      const styles: Record<string, string> = {
                        in_stock: 'bg-green-100 text-green-700',
                        refurbishing: 'bg-amber-100 text-amber-700',
                        sold: 'bg-blue-100 text-blue-700',
                        disposed: 'bg-zinc-200 text-zinc-600',
                      };
                      return (
                        <span key={s} className={`px-3 py-1 rounded-full text-xs font-bold ${styles[s]}`}>
                          {s.replace('_', ' ').toUpperCase()} ({count})
                        </span>
                      );
                    })}
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 ml-auto">
                      TOTAL: {inventory.length}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600">
                      <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-6 py-4">Brand / Model</th>
                          <th className="px-6 py-4">Variant</th>
                          <th className="px-6 py-4">Acquired Price</th>
                          <th className="px-6 py-4">Condition</th>
                          <th className="px-6 py-4">Acquired On</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {filteredInventory.map((item: any) => (
                          <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">{item.brand_name}</p>
                              <p className="font-semibold text-zinc-900">{item.model_name}</p>
                            </td>
                            <td className="px-6 py-4 text-zinc-700">{item.variant_name}</td>
                            <td className="px-6 py-4 font-bold text-green-700">₹{item.acquired_price?.toLocaleString()}</td>
                            <td className="px-6 py-4 max-w-[200px]">
                              <p className="text-xs text-zinc-500 truncate" title={item.condition_summary}>{item.condition_summary}</p>
                            </td>
                            <td className="px-6 py-4 text-zinc-500 text-xs">
                              {new Date(item.acquired_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={item.status}
                                onChange={(e) => updateInventoryStatus(item.id, e.target.value)}
                                className={`text-xs font-bold border rounded-lg px-3 py-1.5 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 ${
                                  item.status === 'in_stock'     ? 'bg-green-50  border-green-200  text-green-700' :
                                  item.status === 'refurbishing' ? 'bg-amber-50  border-amber-200  text-amber-700' :
                                  item.status === 'sold'         ? 'bg-blue-50   border-blue-200   text-blue-700'  :
                                  'bg-zinc-100 border-zinc-200 text-zinc-600'
                                }`}
                              >
                                <option value="in_stock">In Stock</option>
                                <option value="refurbishing">Refurbishing</option>
                                <option value="sold">Sold</option>
                                <option value="disposed">Disposed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                        {filteredInventory.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center">
                              <Smartphone className="w-10 h-10 mx-auto text-zinc-300 mb-3" />
                              <p className="text-zinc-500 font-medium">
                                {inventory.length === 0 ? 'No devices in inventory yet.' : 'No devices match your filters.'}
                              </p>
                              {inventory.length === 0 && <p className="text-xs text-zinc-400 mt-1">Devices appear here automatically when a sell lead is marked as Completed.</p>}
                              {inventory.length > 0 && <button onClick={() => { setInvSearchQuery(''); setInvStatusFilter('all'); setInvBrandFilter('all'); }} className="text-xs text-blue-500 mt-2 hover:underline">Clear filters</button>}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <motion.div key="testimonials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Form */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 h-fit">
                    <h3 className="text-lg font-bold text-zinc-800 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-blue-600" />
                      Add Testimonial
                    </h3>
                    <form onSubmit={handleAddTestimonial} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Client Name</label>
                        <input
                          type="text"
                          required
                          value={newClientName}
                          onChange={e => setNewClientName(e.target.value)}
                          placeholder="e.g. Shrinivas"
                          className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Phone Model Sold</label>
                        <input
                          type="text"
                          required
                          value={newModelName}
                          onChange={e => setNewModelName(e.target.value)}
                          placeholder="e.g. iPhone 13 Pro Max"
                          className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Instagram Reel Link</label>
                        <input
                          type="url"
                          required
                          value={newInstagramUrl}
                          onChange={e => setNewInstagramUrl(e.target.value)}
                          placeholder="e.g. https://www.instagram.com/reel/CtO..."
                          className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingTestimonial}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmittingTestimonial ? 'Adding...' : 'Add Testimonial'}
                      </button>
                    </form>
                  </div>

                  {/* Right Column: List */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                    <div className="p-5 border-b border-zinc-200">
                      <h3 className="text-lg font-bold text-zinc-800">
                        Testimonials List
                        <span className="ml-2 text-sm font-medium text-zinc-400">({testimonials.length})</span>
                      </h3>
                      <p className="text-zinc-500 text-xs mt-0.5">Manage customer video reviews showing up on the public testimonials page.</p>
                    </div>

                    {testimonials.length === 0 ? (
                      <div className="p-12 text-center text-zinc-500 bg-zinc-50/50">
                        <Film className="w-10 h-10 mx-auto text-zinc-300 mb-3" />
                        <p className="font-medium">No testimonials found.</p>
                        <p className="text-xs mt-1">Use the form on the left to add your first client testimonial.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-600">
                          <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs font-semibold">
                            <tr>
                              <th className="px-6 py-4">Client</th>
                              <th className="px-6 py-4">Device Model</th>
                              <th className="px-6 py-4">Instagram Link</th>
                              <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            {testimonials.map((t: any) => (
                              <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-zinc-900">{t.client_name}</td>
                                <td className="px-6 py-4 text-zinc-700 font-medium">{t.model_name}</td>
                                <td className="px-6 py-4">
                                  <a
                                    href={t.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-xs truncate max-w-[200px] block"
                                  >
                                    {t.instagram_url}
                                  </a>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleDeleteTestimonial(t.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Testimonial"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Lead Details Modal */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-200"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/80">
                  <h3 className="text-xl font-bold text-zinc-800 flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    Lead Details <span className="text-zinc-400 font-mono text-sm ml-2">#{selectedLead.id.substring(0, 8)}</span>
                  </h3>
                  <button onClick={() => setSelectedLead(null)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 p-2 rounded-full transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Col: Customer & Status */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Customer Information</h4>
                        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 space-y-3 shadow-sm">
                          <p className="flex justify-between items-center"><span className="text-zinc-500 text-sm">Name:</span> <span className="font-semibold text-zinc-900">{selectedLead.customer_name}</span></p>
                          <p className="flex justify-between items-center"><span className="text-zinc-500 text-sm">Phone:</span> <span className="font-semibold text-zinc-900">{selectedLead.customer_phone}</span></p>
                          {selectedLead.customer_alt_phone && (
                            <p className="flex justify-between items-center"><span className="text-zinc-500 text-sm">Alt Phone:</span> <span className="font-semibold text-zinc-900">{selectedLead.customer_alt_phone}</span></p>
                          )}
                          <p className="flex justify-between items-center"><span className="text-zinc-500 text-sm">Email:</span> <span className="font-semibold text-zinc-900">{selectedLead.customer_email}</span></p>
                          <div className="pt-3 border-t border-zinc-200 mt-3">
                            <span className="text-zinc-500 text-sm block mb-1">Pickup Address:</span>
                            <span className="font-medium text-zinc-800 leading-relaxed">{selectedLead.customer_address}, {selectedLead.city}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Update Status</h4>
                        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                          <label className="block text-sm font-semibold text-blue-900 mb-2">Current Status</label>
                          <div className="relative">
                            <select 
                              value={selectedLead.status}
                              onChange={(e) => {
                                const ns = e.target.value;
                                if (ns !== 'completed') updateLeadStatus(selectedLead.id, ns);
                                else setSelectedLead({ ...selectedLead, status: 'completed' });
                              }}
                              disabled={isUpdatingStatus}
                              className="w-full border border-blue-200 rounded-xl bg-white px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none shadow-sm disabled:opacity-50"
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted / Under Review</option>
                              <option value="picked_up">Scheduled Pickup</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {isUpdatingStatus && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                          </div>

                          {/* Actual Amount — shown when completing an order */}
                          {selectedLead.status === 'completed' && (
                            <div className="mt-4 pt-4 border-t border-blue-200">
                              <label className="block text-sm font-semibold text-green-800 mb-1">Actual Amount Paid (₹)</label>
                              <p className="text-xs text-zinc-500 mb-2">
                                Quoted: <strong className="text-zinc-700">₹{selectedLead.quoted_price?.toLocaleString()}</strong>
                                {selectedLead.actual_amount && <> · Previously saved: <strong className="text-green-700">₹{selectedLead.actual_amount?.toLocaleString()}</strong></>}
                              </p>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold text-sm">₹</span>
                                  <input
                                    type="number"
                                    min={0}
                                    placeholder={String(selectedLead.quoted_price ?? '')}
                                    value={actualAmount}
                                    onChange={(e) => setActualAmount(e.target.value)}
                                    className="w-full pl-7 pr-3 py-2.5 border border-green-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    const amt = actualAmount ? parseInt(actualAmount) : selectedLead.quoted_price;
                                    updateLeadStatus(selectedLead.id, 'completed', amt);
                                    setActualAmount('');
                                  }}
                                  disabled={isUpdatingStatus}
                                  className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all whitespace-nowrap"
                                >
                                  {isUpdatingStatus ? 'Saving...' : 'Save & Complete'}
                                </button>
                              </div>
                              <p className="text-xs text-zinc-400 mt-2">Leave blank to use the quoted price. Saving will trigger the completion email.</p>
                            </div>
                          )}

                          {selectedLead.status !== 'completed' && (
                            <p className="text-xs text-blue-600/70 mt-3">Changing status updates database logs.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Col: Device Condition */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Device Details</h4>
                        <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 p-5 rounded-2xl border border-zinc-200 flex justify-between items-center shadow-sm relative overflow-hidden">
                          <div className="absolute -right-6 -top-6 text-zinc-200 opacity-50">
                            <Smartphone className="w-32 h-32" />
                          </div>
                          <div className="relative z-10">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{selectedLead.brand_name}</p>
                            <p className="font-black text-2xl text-zinc-900">{selectedLead.model_name}</p>
                            <p className="text-zinc-600 font-medium mt-1">{selectedLead.variant_name}</p>
                            <p className="text-sm text-zinc-500 mt-2">Device Age: <span className="font-bold text-zinc-800">{selectedLead.device_age.replace('_', '-')} Months</span></p>
                          </div>
                          <div className="text-right relative z-10">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Quoted Value</p>
                            <p className="text-3xl font-black text-green-600 tracking-tight">₹{selectedLead.quoted_price?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Condition Report</h4>
                        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                          <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-zinc-600">Device Turns On:</span>
                            <span className={`px-2 py-1 rounded-md ${selectedLead.mobile_turns_on ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {selectedLead.mobile_turns_on ? 'Yes, Normal' : 'No (Dead)'}
                            </span>
                          </div>
                          
                          {(selectedLead.battery_health || selectedLead.battery_quality) && (
                            <div className="flex justify-between items-center text-sm font-medium">
                              <span className="text-zinc-600">Battery Status:</span>
                              <span className="text-zinc-900">
                                {selectedLead.battery_health ? `${selectedLead.battery_health}% Health` : selectedLead.battery_quality}
                              </span>
                            </div>
                          )}

                          <div className="pt-3 border-t border-zinc-100">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Accessories Verified</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedLead.has_original_box && <span className="px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500"/> Box</span>}
                              {selectedLead.has_original_charger && <span className="px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500"/> Charger</span>}
                              {selectedLead.has_original_invoice && <span className="px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500"/> Invoice</span>}
                              {selectedLead.under_warranty && <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Under Warranty</span>}
                              {!selectedLead.has_original_box && !selectedLead.has_original_charger && !selectedLead.has_original_invoice && 
                                <span className="text-sm text-zinc-400 italic">No original accessories reported.</span>
                              }
                            </div>
                          </div>

                          {(selectedLead.hardware_defects?.length > 0 || selectedLead.software_defects?.length > 0) && (
                            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 mt-2">
                              <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-3 flex items-center gap-1"><XCircle className="w-4 h-4" /> Reported Defects</p>
                              <ul className="list-disc pl-5 text-sm font-medium text-red-700 space-y-1.5">
                                {selectedLead.hardware_defects?.map((d:string, i:number) => <li key={`hw-${i}`}>{d.replace(/_/g, ' ')}</li>)}
                                {selectedLead.software_defects?.map((d:string, i:number) => <li key={`sw-${i}`}>{d.replace(/_/g, ' ')}</li>)}
                              </ul>
                            </div>
                          )}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
