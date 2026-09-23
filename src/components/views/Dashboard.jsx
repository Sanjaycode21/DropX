import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWater } from '../../context/WaterContext';
import { 
  Droplet, 
  Activity, 
  Gauge, 
  IndianRupee, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Power, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Sparkles,
  Sliders,
  ShieldCheck,
  Building,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';

export const Dashboard = ({ setActiveTab }) => {
  const { currentUser, isAdmin } = useAuth();
  const { 
    flowRate, 
    pressure, 
    tdsQuality, 
    todayUsage, 
    valveState, 
    toggleValve, 
    emergencyShutoff,
    realtimeHistory, 
    hourlyData, 
    weeklyData, 
    fixturesData,
    dailyBudget, 
    setDailyBudget,
    detectedAnomaly,
    todayCost,
    projectedMonthlyCost,
    scenario
  } = useWater();

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [tempBudget, setTempBudget] = useState(dailyBudget);

  const budgetPercent = Math.min(100, Math.round((todayUsage / dailyBudget) * 100));
  const isBudgetExceeded = todayUsage > dailyBudget;

  const handleSaveBudget = (e) => {
    e.preventDefault();
    setDailyBudget(Number(tempBudget));
    setBudgetModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-white">
              {isAdmin ? 'Grid Supervisory Telemetry' : 'Water Intelligence Overview'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
              Live Sensor Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring <strong className="text-slate-200">{currentUser?.property}</strong> • Meter Node:{' '}
            <span className="font-mono text-cyan-400">{currentUser?.meterId}</span>
          </p>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('leaks')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Leak Diagnostics</span>
          </button>
          <button
            onClick={() => setBudgetModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Budget: {dailyBudget}L</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if Anomaly Detected or Valve Closed */}
      {detectedAnomaly && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 to-slate-900 border border-rose-500/50 shadow-xl shadow-rose-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse-subtle">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-600 text-white uppercase tracking-wider">
                  {detectedAnomaly.severity} LEAK DETECTED
                </span>
                <span className="text-xs text-rose-200 font-medium font-mono">
                  {detectedAnomaly.confidence}% AI Confidence
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">
                {detectedAnomaly.type} in {detectedAnomaly.zone}
              </h4>
              <p className="text-xs text-rose-200/90 mt-0.5">
                {detectedAnomaly.advice} (Estimated loss: <strong>{detectedAnomaly.estimatedLoss}</strong>)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('leaks')}
              className="flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-rose-500/40 text-rose-300 hover:bg-slate-800 transition text-center"
            >
              Analyze Leak
            </button>
            <button
              onClick={emergencyShutoff}
              className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              Emergency Shutoff
            </button>
          </div>
        </div>
      )}

      {/* Valve Closed Banner if valve is shut manually */}
      {valveState !== 'OPEN' && !detectedAnomaly && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Main Solenoid Valve is Currently {valveState}.</strong> Household water delivery is physically halted.
            </span>
          </div>
          <button
            onClick={toggleValve}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition"
          >
            Reopen Valve
          </button>
        </div>
      )}

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Water Usage */}
        <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Consumption</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white font-mono">
                {todayUsage.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-cyan-400">Liters</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Target Budget: {dailyBudget} L</span>
              <span className={`font-semibold ${isBudgetExceeded ? 'text-rose-400' : 'text-emerald-400'}`}>
                {budgetPercent}% used
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${isBudgetExceeded ? 'bg-rose-500' : 'bg-cyan-400'}`}
                style={{ width: `${Math.min(100, budgetPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Live Flow Rate */}
        <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Real-Time Flow Rate</span>
            <div className={`p-2 rounded-xl border ${
              flowRate > 30 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white font-mono">
                {flowRate.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-cyan-400">L/min</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className={`w-2 h-2 rounded-full ${flowRate > 0 ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
              <span>
                {flowRate === 0 
                  ? 'Zero Flow (Idle / Shutoff)' 
                  : flowRate > 30 
                  ? 'Abnormally High Surge' 
                  : 'Active Flow Steady'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Line Pressure & Water Quality */}
        <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Line Pressure & Quality</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white font-mono">
                {pressure.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-blue-400">PSI</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">TDS Purity:</span>
              <span className="text-emerald-400 font-semibold font-mono">
                {tdsQuality} ppm (Pure)
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Estimated Bill & Eco Grade */}
        <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Projected Month Bill</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight text-white font-mono">
                ₹{projectedMonthlyCost.totalCost.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">/mo</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Eco Conservation Grade:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                Grade A-
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* REAL-TIME ROLLING TELEMETRY CHART */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Telemetry Stream (ESP32 High Frequency)
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse">
                • LIVE 2.5s
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous YF-S201 pulse sensor streaming flow velocity and piezoresistive water line pressure.
            </p>
          </div>

          {/* Legend indicator */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
              <span>Flow (L/min)</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="w-3 h-0.5 bg-blue-400 rounded-full" />
              <span>Pressure (PSI)</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realtimeHistory}>
              <defs>
                <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="pressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
              <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" tick={{ fontSize: 10 }} domain={[0, 80]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#06b6d4', 
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff'
                }} 
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="flow" 
                stroke="#06b6d4" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#flowGrad)" 
                isAnimationActive={false}
                name="Flow (L/min)"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="pressure" 
                stroke="#3b82f6" 
                strokeWidth={1.5}
                strokeDasharray="4 2"
                fillOpacity={1} 
                fill="url(#pressGrad)" 
                isAnimationActive={false}
                name="Pressure (PSI)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TWO COLUMN GRID: Today's Hourly Curve + Fixture Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Diurnal Hourly Profile (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Diurnal Consumption vs Baseline (24-Hour Cycle)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Highlighting morning peak (07:00-09:00) and evening peak (19:00-21:00).
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('usage')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Full Details &rarr;
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} barGap={1}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 9 }} interval={2} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#38bdf8', 
                    borderRadius: '0.75rem',
                    fontSize: '12px' 
                  }} 
                />
                <Bar dataKey="liters" name="Actual (L)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="baseline" name="Expected Baseline (L)" fill="#1e293b" stroke="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fixture Consumption Distribution (1 Col) */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Fixture Breakdown
              </h3>
              <span className="text-xs text-cyan-400 font-mono">Today</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              AI signature disaggregation of household water consumption.
            </p>

            <div className="space-y-3">
              {fixturesData.map((fixture) => (
                <div key={fixture.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{fixture.name}</span>
                    <span className="font-mono text-slate-400">
                      {fixture.liters} L <strong className="text-white">({fixture.percentage}%)</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${fixture.percentage}%`,
                        backgroundColor: fixture.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('recommendations')}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              View Conservation Recommendations
            </button>
          </div>
        </div>

      </div>

      {/* QUICK HARDWARE & ACTION TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tile 1: Motorized Solenoid Remote Override */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              valveState === 'OPEN'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
              <Power className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Main Solenoid Valve</p>
              <p className="text-[11px] text-slate-400">
                Current State: <span className="font-bold text-cyan-400 uppercase">{valveState}</span>
              </p>
            </div>
          </div>
          <button
            onClick={toggleValve}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {valveState === 'OPEN' ? 'Close Line' : 'Open Line'}
          </button>
        </div>

        {/* Tile 2: ML Demand Predictor */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Forecast Tomorrow</p>
              <p className="text-[11px] text-slate-400">
                Expected: <strong className="text-white">492 L</strong> (Weather: 29°C Sunny)
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('prediction')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
          >
            Forecast
          </button>
        </div>

        {/* Tile 3: ESP32 Hardware Integration */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Hardware Telemetry Node</p>
              <p className="text-[11px] text-slate-400">
                ESP32 + YF-S201 (MQTT Ready)
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Configure
          </button>
        </div>

      </div>

      {/* Target Budget Modal */}
      {budgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Set Daily Water Budget</h3>
            <p className="text-xs text-slate-400 mb-4">
              Customize your household conservation threshold. DROP X will alert you when consumption reaches 80% and 100%.
            </p>
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Daily Target (Liters)
                </label>
                <input
                  type="number"
                  min="100"
                  max="5000"
                  step="25"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBudgetModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
