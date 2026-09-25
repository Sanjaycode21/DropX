import React from 'react';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  TrendingDown, 
  Medal, 
  Calendar
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
  // Peer benchmark comparisons (Liters per day)
  const peerComparisonData = [
    { label: 'Your Household (Villa #42)', liters: 485, fill: '#06b6d4', isYou: true },
    { label: 'Similar 4-Person Average', liters: 590, fill: '#94a3b8', isYou: false },
    { label: 'District Baseline (Zone 4)', liters: 660, fill: '#cbd5e1', isYou: false },
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
        <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-600" />
          Household Benchmarking & Neighborhood Leaderboard
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Compare your efficiency against similar family sizes, neighborhood averages, and historical years.
        </p>
      </div>

      {/* SUMMARY BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-50 via-white to-blue-50 border border-cyan-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">
                DISTRICT RANK #4 OF 48
              </span>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                17.8% lower than street average
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Top Tier Efficiency in Cyan Valley Community
            </h3>
            <p className="text-xs text-slate-600">
              Your average of 485 Liters/day outperforms 89% of similar 4-bedroom homes in your block.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-white border border-cyan-200 text-center shrink-0 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold">Monthly Peer Savings:</span>
          <p className="text-xl font-black text-cyan-700 font-mono">3,150 Liters</p>
        </div>
      </div>

      {/* TWO COLUMN: Peer Benchmark Chart & Community Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peer Bar Comparison */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-600" />
                Daily Water Draw: Peers vs District
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of daily consumption (L/day) for 4-occupant homes.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peerComparisonData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} unit=" L" />
                <YAxis type="category" dataKey="label" stroke="#475569" tick={{ fontSize: 11 }} width={160} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Bar dataKey="liters" name="Daily Liters" radius={[0, 6, 6, 0]}>
                  {peerComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>WHO Guideline Standard: <strong className="text-slate-800">400 - 600 L / day</strong></span>
            <span className="text-emerald-700 font-bold">Compliant</span>
          </div>
        </div>

        {/* Neighborhood Eco Leaderboard */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-500" />
                Cyan Valley Conservation Leaderboard
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Neighborhood standings based on volumetric efficiency.
              </p>
            </div>
            <span className="text-xs text-cyan-700 font-mono font-bold">Zone 4</span>
          </div>

          <div className="space-y-2">
            {leaderboard.map((user) => (
              <div 
                key={user.rank}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition shadow-2xs ${
                  user.isCurrent 
                    ? 'bg-cyan-50 border-cyan-300 ring-1 ring-cyan-400'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                    user.rank === 1 ? 'bg-amber-500 text-white font-black' :
                    user.rank === 2 ? 'bg-slate-400 text-white font-black' :
                    user.rank === 3 ? 'bg-amber-700 text-white font-black' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {user.rank}
                  </span>
                  <div>
                    <p className={`font-bold ${user.isCurrent ? 'text-cyan-900' : 'text-slate-800'}`}>
                      {user.name}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium">{user.badge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900">{user.usage}</span>
                  <p className="text-[10px] text-emerald-700 font-bold">{user.score} Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* HISTORICAL YEAR-OVER-YEAR COMPARISON */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-cyan-600" />
          Year-Over-Year Consumption (2026 vs 2025)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking the multi-year impact of DROP X smart sensor installations.
        </p>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" L" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
              />
              <Bar dataKey="thisYear" name="2026 (With DROP X)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lastYear" name="2025 (Pre-Installation)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
