import React, { useState } from 'react';
import { useWater } from '../../context/WaterContext';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Trash2, 
  Check, 
  Plus, 
  Filter,
  Sparkles
} from 'lucide-react';

export const Notifications = () => {
  const { notifications, markAllRead, clearNotification, addNotification } = useWater();
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'warning' | 'info'

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'critical') return n.type === 'critical';
    if (filter === 'warning') return n.type === 'warning';
    if (filter === 'info') return n.type === 'info' || n.type === 'tip';
    return true;
  });

  const handleSimulateCustomAlert = () => {
    const samples = [
      {
        type: 'critical',
        title: 'High Flow Pressure Shock Wave',
        message: 'A sudden water hammer pressure shock of 74 PSI was registered by Main Line Sensor #01.',
        timestamp: 'Just now'
      },
      {
        type: 'warning',
        title: '80% Water Budget Consumed',
        message: 'Your household has reached 440 Liters of today’s 550 Liters allocation.',
        timestamp: 'Just now'
      },
      {
        type: 'info',
        title: 'Automated Diagnostic Passed',
        message: 'Scheduled 04:00 AM hydrostatic leak check completed with 0.00 L/min drift.',
        timestamp: 'Just now'
      }
    ];

    const pick = samples[Math.floor(Math.random() * samples.length)];
    addNotification(pick);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            Alerts & Notification Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of sensor alerts, leak trip events, budget warnings, and conservation achievements.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSimulateCustomAlert}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-cyan-300 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Sensor Alert</span>
          </button>
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-lg shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            filter === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Events ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            filter === 'critical' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-rose-300'
          }`}
        >
          Critical Bursts ({notifications.filter(n => n.type === 'critical').length})
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            filter === 'warning' ? 'bg-amber-500 text-slate-950' : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          Warnings ({notifications.filter(n => n.type === 'warning').length})
        </button>
        <button
          onClick={() => setFilter('info')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            filter === 'info' ? 'bg-cyan-900 text-cyan-200' : 'text-slate-400 hover:text-white'
          }`}
        >
          Info & Tips ({notifications.filter(n => n.type === 'info' || n.type === 'tip').length})
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white">No Notifications in this filter</h3>
            <p className="text-xs text-slate-400 mt-1">All water network telemetry is within nominal parameters.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isCrit = notif.type === 'critical';
            const isWarn = notif.type === 'warning';
            const isTip = notif.type === 'tip';

            return (
              <div 
                key={notif.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  isCrit
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/20'
                    : isWarn
                    ? 'bg-amber-950/30 border-amber-500/40'
                    : 'glass-panel border-slate-800'
                } ${!notif.read ? 'ring-1 ring-cyan-500/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isCrit ? 'bg-rose-500/20 text-rose-400' :
                    isWarn ? 'bg-amber-500/20 text-amber-400' :
                    isTip ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {isCrit && <AlertTriangle className="w-5 h-5 animate-bounce" />}
                    {isWarn && <ShieldAlert className="w-5 h-5" />}
                    {isTip && <CheckCircle2 className="w-5 h-5" />}
                    {!isCrit && !isWarn && !isTip && <Info className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="inline-block mt-2 text-[10px] text-slate-500 font-mono">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => clearNotification(notif.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
