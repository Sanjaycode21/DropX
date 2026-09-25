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
    <div className="flex flex-col h-full justify-between bg-white border-r border-slate-200/80 p-4 shadow-sm">
      {/* Top Nav section */}
      <div>
        {/* Mobile close bar */}
        <div className="flex lg:hidden items-center justify-between pb-4 mb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-cyan-600 fill-cyan-600" />
            <span className="font-bold text-base text-slate-900">DROP X Menu</span>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meter Tag */}
        <div className="hidden lg:block mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-cyan-700 font-semibold font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-600" />
              {currentUser?.meterId || 'ESP32-NODE-01'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 font-semibold">
              ULTRASONIC
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500 truncate">
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-600/20'
                    : 'text-slate-600 hover:text-cyan-700 hover:bg-cyan-50/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: User Card & Logout */}
      <div className="pt-4 border-t border-slate-200/80 space-y-3">
        {/* Role identifier badge */}
        <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full ring-2 ring-cyan-500/30 object-cover" 
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-cyan-700 font-medium capitalize truncate">{currentUser?.title || currentUser?.role}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
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
