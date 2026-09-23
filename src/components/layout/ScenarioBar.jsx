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
  const { scenario, switchScenario, valveState, flowRate, pressure } = useWater();

  const scenarios = [
    {
      id: 'NORMAL',
      label: 'Normal Flow',
      icon: ShieldCheck,
      desc: 'Typical daily baseline (2.8 L/min)',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
    },
    {
      id: 'SHOWER',
      label: 'Morning Shower',
      icon: ShowerHead,
      desc: 'Active usage (11.5 L/min)',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20'
    },
    {
      id: 'MICRO_LEAK',
      label: 'Silent Micro-Leak',
      icon: Droplets,
      desc: 'Toilet flapper trickle (1.8 L/min)',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/20'
    },
    {
      id: 'BURST_PIPE',
      label: 'Pipe Burst Alert',
      icon: AlertTriangle,
      desc: 'Catastrophic rupture (45 L/min)',
      badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-950/20 animate-pulse'
    },
    {
      id: 'IRRIGATION',
      label: 'Lawn Sprinkler',
      icon: Sprout,
      desc: 'High output exterior line (22 L/min)',
      badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-950/20'
    },
    {
      id: 'ECO',
      label: 'Eco Saver Mode',
      icon: Activity,
      desc: 'Low-flow aerated fixtures (1.2 L/min)',
      badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-950/20'
    },
  ];

  return (
    <div className="bg-slate-900/70 border-b border-slate-800/80 px-4 lg:px-6 py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        
        {/* Hackathon Simulation Controller Label */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
            Demo Simulator Engine:
          </span>
          <span className="text-[11px] text-slate-400 hidden xl:inline">
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
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition shrink-0 ${
                  isActive
                    ? `${s.badgeColor} ring-1 ring-cyan-400/50 shadow-sm font-semibold`
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'scale-110 text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{s.label}</span>
                {isActive && <Check className="w-3 h-3 text-cyan-400" />}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
