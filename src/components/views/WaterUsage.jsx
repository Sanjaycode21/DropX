import React, { useState } from 'react';
import { useWater } from '../../context/WaterContext';
import { 
  Droplet, 
  Calendar, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Layers, 
  Zap, 
  Filter,
  Users,
  CheckCircle,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const WaterUsage = () => {
  const { hourlyData, weeklyData, fixturesData, todayUsage, dailyBudget } = useWater();
  const [timeframe, setTimeframe] = useState('hourly'); // 'hourly' | 'weekly' | 'monthly'

  // Monthly 30-day simulation
  const monthlyData = [
    { day: 'Day 1', liters: 480, cost: 2.88 },
    { day: 'Day 5', liters: 510, cost: 3.06 },
    { day: 'Day 10', liters: 465, cost: 2.79 },
    { day: 'Day 15', liters: 590, cost: 3.54 },
    { day: 'Day 20', liters: 520, cost: 3.12 },
    { day: 'Day 25', liters: 440, cost: 2.64 },
    { day: 'Day 30', liters: 495, cost: 2.97 },
  ];

  // Peak Events
  const recentEvents = [
    { id: 1, time: '08:15 AM', duration: '14 mins', volume: '112 L', fixture: 'Master Shower', status: 'Normal' },
    { id: 2, time: '09:40 AM', duration: '42 mins', volume: '76 L', fixture: 'Washing Machine (Eco Mode)', status: 'Optimal' },
    { id: 3, time: '12:30 PM', duration: '5 mins', volume: '18 L', fixture: 'Kitchen Sink & Dish Rinse', status: 'Normal' },
    { id: 4, time: '06:10 PM', duration: '20 mins', volume: '44 L', fixture: 'Garden Drip Irrigation', status: 'Optimal' },
    { id: 5, time: '07:45 PM', duration: '11 mins', volume: '88 L', fixture: 'Guest Shower', status: 'Normal' },
  ];

  const COLORS = ['#06b6d4', '#0284c7', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Droplet className="w-6 h-6 text-cyan-400" />
            Water Consumption Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive telemetry breakdown, diurnal patterns, and fixture-level disaggregation.
          </p>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('hourly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              timeframe === 'hourly'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            24-Hour Diurnal
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              timeframe === 'weekly'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              timeframe === 'monthly'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Month View
          </button>
        </div>
      </div>

      {/* TOP ANALYTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Per Capita Usage</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">103.1</span>
            <span className="text-xs text-cyan-400">L / person / day</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Well below 135 L municipal limit</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Average Daily Baseline</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">495.2</span>
            <span className="text-xs text-cyan-400">Liters</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">-4.2%</span> vs last week
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Peak Demand Hour</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400 font-mono">08:00 AM</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
            <span>Flow surged to <strong>78.2 L/hr</strong></span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Base Minimum Flow (Night)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">0.02</span>
            <span className="text-xs text-cyan-400">L/min</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Night drop verified (No hidden leak)</span>
          </div>
        </div>

      </div>

      {/* PRIMARY USAGE CHART */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              {timeframe === 'hourly' && '24-Hour Diurnal Consumption Cycle'}
              {timeframe === 'weekly' && 'Daily Water Use vs Target Budget (Past 7 Days)'}
              {timeframe === 'monthly' && '30-Day Household Water Trajectory'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison between recorded IoT flow telemetry and algorithmic target baselines.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-3 bg-cyan-500 rounded-sm" />
              <span>Actual Consumption</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 bg-slate-400 border border-slate-400 rounded-full" />
              <span>Target Baseline</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {timeframe === 'hourly' ? (
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit=" L" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Bar dataKey="liters" name="Actual (L)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="baseline" name="Expected Baseline (L)" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : timeframe === 'weekly' ? (
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit=" L" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Bar dataKey="actual" name="Consumed (L)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="budget" name="Daily Budget (L)" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit=" L" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="liters" stroke="#06b6d4" strokeWidth={3} fill="url(#monthGrad)" name="Liters" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* TWO COLUMN DETAILS: Fixture Donut & Recent Water Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fixture Breakdown Donut */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-cyan-400" />
            End-Use Disaggregation
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            AI frequency spectral analysis isolates specific water appliances.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fixturesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="liters"
                  >
                    {fixturesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.5rem', fontSize: '11px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 flex-1">
              {fixturesData.map((f, i) => (
                <div key={f.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-slate-300 font-medium">{f.name}</span>
                  </div>
                  <span className="font-mono text-slate-400">
                    {f.liters} L <strong className="text-white">({f.percentage}%)</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent High-Volume Events Log */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            Recent Water Draw Events
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Discrete flow events registered by the ESP32 pulse counter today.
          </p>

          <div className="divide-y divide-slate-800/80 max-h-60 overflow-y-auto">
            {recentEvents.map((evt) => (
              <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{evt.fixture}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                      {evt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {evt.time} • Duration: {evt.duration}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-cyan-400 text-sm">{evt.volume}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
