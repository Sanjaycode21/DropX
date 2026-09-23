import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWater } from '../../context/WaterContext';
import { 
  LayoutDashboard, 
  Droplet, 
  ShieldAlert, 
  TrendingUp, 
  IndianRupee, 
  Sparkles, 
  BarChart3, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  X,
  Gauge,
  Cpu
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { notifications, detectedAnomaly, valveState } = useWater();

  const unreadAlerts = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'usage', label: 'Water Usage', icon: Droplet },
    { 
      id: 'leaks', 
      label: 'Leak Detection', 
      icon: ShieldAlert,
      badge: detectedAnomaly ? 'ALERT' : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    { id: 'prediction', label: 'Prediction & AI', icon: TrendingUp },
    { id: 'costs', label: 'Cost Estimation (₹)', icon: IndianRupee },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
    { id: 'comparison', label: 'Comparison', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell,
      badge: unreadAlerts > 0 ? unreadAlerts : null,
      badgeColor: 'bg-cyan-500 text-slate-950 font-bold'
    },
    { id: 'settings', label: 'Settings & Hardware', icon: Settings },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  const content = (
    <div className="flex flex-col h-full justify-between bg-slate-950/95 lg:bg-slate-900/60 lg:backdrop-blur-xl border-r border-slate-800/80 p-4">
      {/* Top Nav section */}
      <div>
        {/* Mobile close bar */}
        <div className="flex lg:hidden items-center justify-between pb-4 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            <span className="font-bold text-base text-white">DROP X Menu</span>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meter Tag */}
        <div className="hidden lg:block mb-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono">
              <Cpu className="w-3.5 h-3.5" />
              {currentUser?.meterId || 'ESP32-NODE-01'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {valveState}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400 truncate">
            {currentUser?.property || 'Residential Smart Node'}
          </p>
        </div>

        {/* Nav links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-sky-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: User Card & Logout */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        {/* Role identifier badge */}
        <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full ring-1 ring-cyan-500/40 object-cover" 
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-cyan-400 capitalize truncate">{currentUser?.title || currentUser?.role}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
