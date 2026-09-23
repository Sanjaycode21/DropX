import React, { useState } from 'react';
import { useWater } from '../../context/WaterContext';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  TrendingDown, 
  Medal, 
  Sparkles, 
  MapPin, 
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export const Comparison = () => {
  const { todayUsage } = useWater();
  const [householdType, setHouseholdType] = useState('4-person');

  // Peer benchmark comparisons (Liters per day)
  const peerComparisonData = [
    { label: 'Your Household (Villa #42)', liters: 485, fill: '#06b6d4', isYou: true },
    { label: 'Similar 4-Person Average', liters: 590, fill: '#334155', isYou: false },
    { label: 'District Baseline (Zone 4)', liters: 660, fill: '#1e293b', isYou: false },
    { label: 'Top 10% Eco-Homes', liters: 395, fill: '#10b981', isYou: false },
  ];

  // Historical Month-over-Month Data
  const historicalData = [
    { month: 'Sep (Current)', thisYear: 14800, lastYear: 16900 },
    { month: 'Aug', thisYear: 15200, lastYear: 17400 },
    { month: 'Jul', thisYear: 16100, lastYear: 18200 },
    { month: 'Jun', thisYear: 15800, lastYear: 17800 },
    { month: 'May', thisYear: 14200, lastYear: 15600 },
  ];

  // Community Leaderboard
  const leaderboard = [
    { rank: 1, name: 'The Green Haven (Villa #12)', usage: '382 L/day', score: '98%', badge: 'Master Conserver' },
    { rank: 2, name: 'Eco-Crest (Villa #29)', usage: '410 L/day', score: '96%', badge: 'Zero Waste' },
    { rank: 3, name: 'The Solstice (Villa #08)', usage: '455 L/day', score: '93%', badge: 'Water Hero' },
    { rank: 4, name: 'Your Residence (Villa #42)', usage: '485 L/day', score: '91%', badge: 'Leak Sentry', isCurrent: true },
    { rank: 5, name: 'Blue Ridge (Villa #19)', usage: '512 L/day', score: '88%', badge: 'Efficient' },
    { rank: 6, name: 'Horizon Oaks (Villa #55)', usage: '540 L/day', score: '84%', badge: 'Average' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          Household Benchmarking & Neighborhood Leaderboard
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Compare your efficiency against similar family sizes, neighborhood averages, and historical years.
        </p>
      </div>

      {/* SUMMARY BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                DISTRICT RANK #4 OF 48
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                17.8% lower than street average
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Top Tier Efficiency in Cyan Valley Community
            </h3>
            <p className="text-xs text-slate-300">
              Your average of 485 Liters/day outperforms 89% of similar 4-bedroom homes in your block.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-center shrink-0">
          <span className="text-[11px] text-slate-400">Monthly Peer Savings:</span>
          <p className="text-xl font-black text-cyan-400 font-mono">3,150 Liters</p>
        </div>
      </div>

      {/* TWO COLUMN: Peer Benchmark Chart & Community Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peer Bar Comparison */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Daily Water Draw: Peers vs District
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison of daily consumption (L/day) for 4-occupant homes.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peerComparisonData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} unit=" L" />
                <YAxis type="category" dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} width={160} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Bar dataKey="liters" name="Daily Liters" radius={[0, 6, 6, 0]}>
                  {peerComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>WHO Guideline Standard: <strong>400 - 600 L / day</strong></span>
            <span className="text-emerald-400 font-semibold">Compliant</span>
          </div>
        </div>

        {/* Neighborhood Eco Leaderboard */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-400" />
                Cyan Valley Conservation Leaderboard
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Neighborhood standings based on volumetric efficiency.
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono">Zone 4</span>
          </div>

          <div className="space-y-2">
            {leaderboard.map((user) => (
              <div 
                key={user.rank}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                  user.isCurrent 
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                    user.rank === 1 ? 'bg-amber-500 text-slate-950 font-black' :
                    user.rank === 2 ? 'bg-slate-300 text-slate-950 font-black' :
                    user.rank === 3 ? 'bg-amber-700 text-white font-black' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {user.rank}
                  </span>
                  <div>
                    <p className={`font-semibold ${user.isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-200'}`}>
                      {user.name}
                    </p>
                    <span className="text-[10px] text-slate-400">{user.badge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-white">{user.usage}</span>
                  <p className="text-[10px] text-emerald-400 font-semibold">{user.score} Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* HISTORICAL YEAR-OVER-YEAR COMPARISON */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-cyan-400" />
          Year-Over-Year Consumption (2026 vs 2025)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Tracking the multi-year impact of DROP X smart sensor installations.
        </p>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit=" L" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
              />
              <Bar dataKey="thisYear" name="2026 (With DROP X)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lastYear" name="2025 (Pre-Installation)" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
