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
  Plus
} from 'lucide-react';

export const Notifications = () => {
  const { notifications, markAllRead, clearNotification, addNotification } = useWater();
  const [filter, setFilter] = useState('all');

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
        title: 'Ultrasonic Overflow Alarm',
        message: 'Water distance in primary tank dropped below 4.0 cm (>90% full capacity).',
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
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-600" />
            Alerts & Notification Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time feed of ultrasonic sensor alerts, overflow alarms, budget warnings, and conservation achievements.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSimulateCustomAlert}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200/90 hover:bg-slate-100 text-slate-700 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-600" />
            <span>Simulate Sensor Alert</span>
          </button>
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition shadow-md shadow-cyan-600/20"
          >
            <Check className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-xl font-bold transition ${
            filter === 'all' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Events ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-3.5 py-2 rounded-xl font-bold transition ${
            filter === 'critical' ? 'bg-rose-600 text-white' : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
          }`}
        >
          Critical Bursts ({notifications.filter(n => n.type === 'critical').length})
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`px-3.5 py-2 rounded-xl font-bold transition ${
            filter === 'warning' ? 'bg-amber-500 text-white' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          Warnings ({notifications.filter(n => n.type === 'warning').length})
        </button>
        <button
          onClick={() => setFilter('info')}
          className={`px-3.5 py-2 rounded-xl font-bold transition ${
            filter === 'info' ? 'bg-cyan-100 text-cyan-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Info & Tips ({notifications.filter(n => n.type === 'info' || n.type === 'tip').length})
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-200/90 bg-white shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-slate-900">No Notifications in this filter</h3>
            <p className="text-xs text-slate-500 mt-1">All water network telemetry is within nominal parameters.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isCrit = notif.type === 'critical';
            const isWarn = notif.type === 'warning';
            const isTip = notif.type === 'tip';

            return (
              <div 
                key={notif.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 shadow-2xs ${
                  isCrit
                    ? 'bg-rose-50 border-rose-200'
                    : isWarn
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-white border-slate-200/90'
                } ${!notif.read ? 'ring-1 ring-cyan-400' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isCrit ? 'bg-rose-100 text-rose-700' :
                    isWarn ? 'bg-amber-100 text-amber-800' :
                    isTip ? 'bg-emerald-100 text-emerald-700' :
                    'bg-cyan-50 text-cyan-700'
                  }`}>
                    {isCrit && <AlertTriangle className="w-5 h-5 animate-bounce text-rose-600" />}
                    {isWarn && <ShieldAlert className="w-5 h-5 text-amber-600" />}
                    {isTip && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {!isCrit && !isWarn && !isTip && <Info className="w-5 h-5 text-cyan-600" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="inline-block mt-2 text-[10px] text-slate-400 font-mono font-medium">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => clearNotification(notif.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
