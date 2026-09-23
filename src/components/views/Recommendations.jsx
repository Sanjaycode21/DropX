import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Award, 
  ShowerHead, 
  Sprout, 
  Wrench, 
  Bell, 
  ToggleLeft, 
  ToggleRight,
  TrendingDown,
  ArrowRight,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Recommendations = () => {
  const [completedTips, setCompletedTips] = useState(['tip-1']);
  
  // Interactive automation rules
  const [rules, setRules] = useState([
    {
      id: 'rule-1',
      title: 'Catastrophic Rupture Auto-Cutoff',
      trigger: 'If flow rate > 35 L/min for > 8 continuous minutes',
      action: 'Automatically actuate Motorized Solenoid Valve to CLOSED and broadcast high-priority SMS alert',
      enabled: true,
      category: 'Safety'
    },
    {
      id: 'rule-2',
      title: 'Night Owl Micro-Leak Sentry',
      trigger: 'If continuous flow > 0.8 L/min between 02:00 AM and 04:30 AM',
      action: 'Flag running toilet flapper or leaking bib tap, notify homeowner dashboard',
      enabled: true,
      category: 'Diagnostic'
    },
    {
      id: 'rule-3',
      title: 'Weather Predictive Rain Pause',
      trigger: 'If local precipitation forecast probability exceeds 60%',
      action: 'Automatically disarm Garden Sprinklers Zone 4 for 24 hours',
      enabled: true,
      category: 'Conservation'
    },
    {
      id: 'rule-4',
      title: 'Daily Budget Exceeded Governor',
      trigger: 'If total daily consumption exceeds 550 Liters threshold',
      action: 'Send push notification to household and switch smart aerators to Eco flow',
      enabled: false,
      category: 'Conservation'
    }
  ]);

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleCompleteTip = (id) => {
    if (!completedTips.includes(id)) {
      setCompletedTips([...completedTips, id]);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const recommendations = [
    {
      id: 'tip-1',
      title: 'Install 1.5 GPM Aerators on Bathroom Faucets',
      category: 'Hardware Upgrade',
      impact: 'High',
      savingsLiters: '1,400 L / month',
      savingsRupees: '₹140 / mo',
      costToImplement: '₹180 one-time',
      roi: '1.3 months payback',
      icon: ShowerHead
    },
    {
      id: 'tip-2',
      title: 'Replace Toilet Flapper with Silicone High-Seal Ring',
      category: 'Leak Prevention',
      impact: 'Critical',
      savingsLiters: '2,800 L / month',
      savingsRupees: '₹280 / mo',
      costToImplement: '₹120 one-time',
      roi: '2 weeks payback',
      icon: Wrench
    },
    {
      id: 'tip-3',
      title: 'Switch Lawn Sprinklers to Morning Dew Schedule (05:30 AM)',
      category: 'Behavior & Timing',
      impact: 'Medium',
      savingsLiters: '850 L / month',
      savingsRupees: '₹85 / mo',
      costToImplement: 'Free (Config change)',
      roi: 'Immediate',
      icon: Sprout
    },
    {
      id: 'tip-4',
      title: 'Run Dishwasher Only at Full Capacity in Eco 50° Cycle',
      category: 'Appliance Tuning',
      impact: 'Medium',
      savingsLiters: '480 L / month',
      savingsRupees: '₹48 / mo',
      costToImplement: 'Free',
      roi: 'Immediate',
      icon: Sparkles
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          Smart Recommendations & Rule Automation
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          AI-driven household efficiency recommendations, quantified savings, and automated valve triggers.
        </p>
      </div>

      {/* GAMIFIED ECO BADGES PROGRESS */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Water Guardian: Tier 3 Master</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                TOP 8% OF DISTRICT
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              You have completed <strong>{completedTips.length}</strong> conservation audits. Completed actions save ~<strong>{completedTips.length * 1250} Liters</strong> each month!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400">Audit Score:</span>
            <p className="text-xl font-black text-cyan-400 font-mono">94 / 100</p>
          </div>
        </div>
      </div>

      {/* RECOMMENDED ACTION CARDS */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Wrench className="w-4 h-4 text-cyan-400" />
          Prioritized Action Items
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((tip) => {
            const Icon = tip.icon;
            const isDone = completedTips.includes(tip.id);

            return (
              <div 
                key={tip.id} 
                className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-500/40 opacity-80' 
                    : 'glass-panel-interactive'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono tracking-wider">
                          {tip.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                          {tip.title}
                        </h4>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      tip.impact === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}>
                      {tip.impact} Impact
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400">Monthly Water Saved:</span>
                      <p className="font-mono font-bold text-cyan-400">{tip.savingsLiters}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Estimated Cost Savings:</span>
                      <p className="font-mono font-bold text-emerald-400">{tip.savingsRupees}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Payback: {tip.roi}</span>
                  <button
                    onClick={() => handleCompleteTip(tip.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Completed' : 'Mark as Applied'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AUTOMATION RULES ENGINE */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Automated Valve & Alert Rule Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Active micro-controller logic executed locally on the ESP32 gateway for instant response.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div 
              key={rule.id} 
              className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                rule.enabled 
                  ? 'bg-slate-900 border-slate-700/80' 
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{rule.title}</h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">
                    {rule.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Trigger:</strong> {rule.trigger}
                </p>
                <p className="text-xs text-cyan-400/90">
                  <strong className="text-slate-300">Action:</strong> {rule.action}
                </p>
              </div>

              <button
                onClick={() => toggleRule(rule.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold self-start sm:self-auto transition shrink-0 ${
                  rule.enabled
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {rule.enabled ? <ToggleRight className="w-5 h-5 text-cyan-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                <span>{rule.enabled ? 'Rule Active' : 'Rule Disabled'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
