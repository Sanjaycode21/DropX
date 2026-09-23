import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWater } from '../../context/WaterContext';
import { 
  Droplet, 
  Bell, 
  Wifi, 
  ShieldAlert, 
  Power, 
  User, 
  ChevronDown, 
  LogOut, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Sliders
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onToggleMobileMenu }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { 
    valveState, 
    toggleValve, 
    emergencyShutoff, 
    notifications, 
    markAllRead,
    flowRate 
  } = useWater();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3">
        
        {/* Mobile menu trigger & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
              <Droplet className="w-6 h-6 fill-white stroke-white animate-pulse-subtle" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
                  DROP <span className="text-cyan-400">X</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                  {isAdmin ? 'ADMIN CONSOLE' : 'V2.4 PRO'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block leading-none">
                Smart Water & Conservation Grid
              </p>
            </div>
          </div>
        </div>

        {/* Live Telemetry Pill & Clock */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          {/* Live Clock */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 font-mono flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>
              {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-cyan-400 font-semibold">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* IoT Gateway Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/20 text-emerald-400">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-medium text-[11px]">ESP32 Gateway: ONLINE</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
              99.8% RSSI
            </span>
          </div>
        </div>

        {/* Action Controls & User Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Emergency Main Valve Cutoff Button */}
          <button
            onClick={valveState === 'OPEN' ? emergencyShutoff : toggleValve}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition shadow-sm ${
              valveState === 'OPEN'
                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 glow-cyan'
            }`}
            title="Click to actuate motorized solenoid shutoff"
          >
            <Power className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              Valve: <strong className="uppercase">{valveState}</strong>
            </span>
            <span className="sm:hidden font-mono uppercase">{valveState}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl p-3 text-slate-200 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-sm">IoT Alerts & System Events</span>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2 pt-2">
                  {notifications.length === 0 ? (
                    <p className="text-center py-4 text-xs text-slate-400">No active alerts</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-lg border text-xs transition ${
                          n.type === 'critical' 
                            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200' 
                            : n.type === 'warning'
                            ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                        } ${!n.read ? 'ring-1 ring-cyan-500/30' : ''}`}
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span className="flex items-center gap-1.5">
                            {n.type === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                            {n.type === 'warning' && <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            {n.type === 'info' && <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                            {n.type === 'tip' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-800 text-center">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('notifications');
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    View All Notifications &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition"
            >
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt={currentUser?.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-500/40" 
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight flex items-center gap-1">
                  {currentUser?.name || 'Omkar Sharma'}
                </p>
                <p className="text-[10px] text-cyan-400 capitalize">
                  {currentUser?.role || 'user'} • {currentUser?.meterId || 'M-01'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl p-2 text-slate-200 z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Role: {currentUser?.role}
                  </span>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-300 rounded-lg transition"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    IoT Gateway & Settings
                  </button>
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
