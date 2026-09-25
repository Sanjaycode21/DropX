import React from 'react';
import { useWater } from '../../context/WaterContext';
import { 
  Activity, 
  AlertTriangle, 
  Droplets, 
  ShowerHead, 
  Sprout, 
  ShieldCheck,
  Flame,
  Check
} from 'lucide-react';

export const ScenarioBar = () => {
  const { scenario, switchScenario } = useWater();

  const scenarios = [
    {
      id: 'NORMAL',
      label: 'Normal Flow',
      icon: ShieldCheck,
      desc: 'Typical daily baseline (2.8 L/min)',
      badgeColor: 'text-emerald-700 border-emerald-300 bg-emerald-50'
    },
    {
      id: 'SHOWER',
      label: 'Morning Shower',
      icon: ShowerHead,
      desc: 'Active usage (11.5 L/min)',
      badgeColor: 'text-cyan-700 border-cyan-300 bg-cyan-50'
    },
    {
      id: 'MICRO_LEAK',
      label: 'Silent Micro-Leak',
      icon: Droplets,
      desc: 'Toilet flapper trickle (1.8 L/min)',
      badgeColor: 'text-amber-700 border-amber-300 bg-amber-50'
    },
    {
      id: 'BURST_PIPE',
      label: 'Pipe Burst Alert',
      icon: AlertTriangle,
      desc: 'Catastrophic rupture (45 L/min)',
      badgeColor: 'text-rose-700 border-rose-300 bg-rose-50 animate-pulse'
    },
    {
      id: 'IRRIGATION',
      label: 'Lawn Sprinkler',
      icon: Sprout,
      desc: 'High output exterior line (22 L/min)',
      badgeColor: 'text-sky-700 border-sky-300 bg-sky-50'
    },
    {
      id: 'ECO',
      label: 'Eco Saver Mode',
      icon: Activity,
      desc: 'Low-flow aerated fixtures (1.2 L/min)',
      badgeColor: 'text-teal-700 border-teal-300 bg-teal-50'
    },
  ];

  return (
    <div className="bg-white/80 border-b border-slate-200/80 px-4 lg:px-6 py-2 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        
        {/* Hackathon Simulation Controller Label */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 font-mono">
            Demo Simulator Engine:
          </span>
          <span className="text-[11px] text-slate-500 hidden xl:inline">
            (Select a scenario to test live telemetry & AI leak defense)
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {scenarios.map((s) => {
            const Icon = s.icon;
            const isActive = scenario === s.id;
            return (
              <button
                key={s.id}
                onClick={() => switchScenario(s.id)}
                title={s.desc}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition shrink-0 ${
                  isActive
                    ? `${s.badgeColor} ring-1 ring-cyan-500/40 shadow-xs font-bold`
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'scale-110 text-cyan-600' : 'text-slate-500 group-hover:text-slate-800'}`} />
                <span>{s.label}</span>
                {isActive && <Check className="w-3 h-3 text-cyan-700" />}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
