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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        
        {/* Mobile menu trigger & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/30">
              <Droplet className="w-6 h-6 fill-white stroke-white animate-pulse-subtle" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  DROP <span className="text-cyan-600">X</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-700">
                  {isAdmin ? 'ADMIN CONSOLE' : 'V2.4 ULTRASONIC'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block leading-none">
                Smart Water Telemetry & Conservation Grid
              </p>
            </div>
          </div>
        </div>

        {/* Live Telemetry Pill & Clock */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          {/* Live Clock */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-mono flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>
              {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-cyan-700 font-semibold">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* IoT Gateway Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="font-semibold text-[11px]">ESP32 Ultrasonic Node: ONLINE</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-medium">
              99.8% RSSI
            </span>
          </div>
        </div>

        {/* Action Controls & User Profile */}
        <div className="flex items-center gap-2.5">

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-cyan-600 hover:border-cyan-300 hover:bg-slate-50 transition shadow-sm"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-600 text-[10px] font-bold text-white shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 text-slate-800 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-600" />
                    <span className="font-bold text-sm text-slate-900">IoT Alerts & System Events</span>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-[11px] text-cyan-600 hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2 pt-2">
                  {notifications.length === 0 ? (
                    <p className="text-center py-4 text-xs text-slate-500">No active alerts</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl border text-xs transition ${
                          n.type === 'critical' 
                            ? 'bg-rose-50 border-rose-200 text-rose-900' 
                            : n.type === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        } ${!n.read ? 'ring-1 ring-cyan-400' : ''}`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="flex items-center gap-1.5">
                            {n.type === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                            {n.type === 'warning' && <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                            {n.type === 'info' && <Info className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                            {n.type === 'tip' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                        </div>
                        <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('notifications');
                    }}
                    className="text-xs text-cyan-600 hover:text-cyan-700 font-bold"
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
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-cyan-300 hover:bg-slate-50 transition shadow-sm"
            >
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt={currentUser?.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-cyan-500/30" 
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.name || 'Omkar Sharma'}
                </p>
                <p className="text-[10px] text-cyan-700 capitalize font-medium">
                  {currentUser?.role || 'user'} • {currentUser?.meterId || 'M-01'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 text-slate-800 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                    Role: {currentUser?.role}
                  </span>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-xl transition font-medium"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    IoT Gateway & Settings
                  </button>
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition font-bold"
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
