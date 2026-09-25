import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWater } from '../../context/WaterContext';
import { 
  Droplet, 
  Activity, 
  IndianRupee, 
  AlertTriangle, 
  Power, 
  TrendingUp,
  Sparkles,
  Sliders,
  ShieldCheck,
  Building,
  Clock,
  Layers,
  Radio,
  Waves,
  Gauge,
  ArrowUpRight
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
  CartesianGrid
} from 'recharts';

export const Dashboard = ({ setActiveTab }) => {
  const { currentUser, isAdmin } = useAuth();
  const { 
    flowRate, 
    todayUsage, 
    valveState, 
    toggleValve, 
    emergencyShutoff,
    realtimeHistory, 
    hourlyData, 
    fixturesData,
    dailyBudget, 
    setDailyBudget,
    detectedAnomaly,
    projectedMonthlyCost,
    waterLevelPercent,
    waterVolumeLiters,
    distanceCm,
    tankCapacityLiters
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
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {isAdmin ? 'Grid Supervisory Telemetry' : 'Water Intelligence Overview'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200/80 flex items-center gap-1.5 shadow-2xs">
              <Radio className="w-3 h-3 text-cyan-600 animate-pulse" />
              HC-SR04 Ultrasonic Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring <strong className="text-slate-800 font-semibold">{currentUser?.property}</strong> • Meter Node:{' '}
            <span className="font-mono text-cyan-700 font-semibold">{currentUser?.meterId}</span>
          </p>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('leaks')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:border-cyan-300 hover:bg-cyan-50/50 text-xs font-semibold text-slate-700 transition shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            <span>AI Leak Diagnostics</span>
          </button>
          <button
            onClick={() => setBudgetModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:border-cyan-300 hover:bg-cyan-50/50 text-xs font-semibold text-slate-700 transition shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <span>Target Budget: {dailyBudget}L</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if Anomaly Detected */}
      {detectedAnomaly && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-white border border-rose-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500 text-white shadow-sm shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-600 text-white uppercase tracking-wider">
                  {detectedAnomaly.severity} LEAK DETECTED
                </span>
                <span className="text-xs text-rose-700 font-semibold font-mono">
                  {detectedAnomaly.confidence}% AI Confidence
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {detectedAnomaly.type} in {detectedAnomaly.zone}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {detectedAnomaly.advice} (Estimated loss: <strong className="text-rose-700 font-bold">{detectedAnomaly.estimatedLoss}</strong>)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('leaks')}
              className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 transition text-center shadow-xs"
            >
              Analyze Leak
            </button>
            <button
              onClick={emergencyShutoff}
              className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              Emergency Shutoff
            </button>
          </div>
        </div>
      )}

      {/* SUMMARY KPI CARDS: 3 EVENLY BALANCED COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Today's Water Usage */}
        <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Consumption</span>
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200/60 shadow-2xs">
              <Droplet className="w-4 h-4 fill-cyan-500/20" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-slate-900 font-mono">
                {todayUsage.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-cyan-600">Liters</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Target Budget: {dailyBudget} L</span>
              <span className={`font-bold ${isBudgetExceeded ? 'text-rose-600' : 'text-emerald-600'}`}>
                {budgetPercent}% used
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-slate-200/60">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${isBudgetExceeded ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-blue-600'}`}
                style={{ width: `${Math.min(100, budgetPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Real-Time Flow Rate */}
        <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Real-Time Flow Rate</span>
            <div className={`p-2.5 rounded-xl border shadow-2xs ${
              flowRate > 30 
                ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}>
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-slate-900 font-mono">
                {flowRate.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-cyan-600">L/min</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className={`w-2 h-2 rounded-full ${flowRate > 0 ? 'bg-cyan-500 animate-ping' : 'bg-slate-400'}`} />
              <span className="font-medium">
                {flowRate === 0 
                  ? 'Zero Flow (Idle / Idle Tank)' 
                  : flowRate > 30 
                  ? 'Abnormally High Surge' 
                  : 'Active Flow Steady'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Estimated Bill & Eco Grade */}
        <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projected Month Bill</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60 shadow-2xs">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight text-slate-900 font-mono">
                ₹{projectedMonthlyCost.totalCost.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/mo</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Eco Conservation Grade:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shadow-2xs">
                Grade A-
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* DYNAMIC TANK WATER LEVEL & VOLUME INDICATOR (HC-SR04 ULTRASONIC SENSOR) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Left Description & Real-Time Big Metrics */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200/60 shadow-2xs">
                  <Waves className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Storage Tank Water Level & Volume
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time hydrostatic volume measured continuously by HC-SR04 ultrasonic sensor.
                  </p>
                </div>
              </div>

              {/* Distance badge */}
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold shadow-2xs">
                Sensor Distance: {distanceCm} cm
              </span>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
              
              {/* Level % */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Water Level Fill</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {waterLevelPercent}%
                  </span>
                </div>
                <p className="text-[10px] text-cyan-700 font-bold mt-0.5">
                  {waterLevelPercent >= 85 ? 'Overfill Warning!' : waterLevelPercent >= 70 ? 'High Capacity' : 'Optimal Capacity'}
                </p>
              </div>

              {/* Volume Liters */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Current Volume</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-cyan-700 font-mono">
                    {waterVolumeLiters}
                  </span>
                  <span className="text-xs font-bold text-cyan-700">Liters</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Out of {tankCapacityLiters} L Tank Max
                </p>
              </div>

              {/* Tank Headroom */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Remaining Buffer</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-emerald-700 font-mono">
                    {(tankCapacityLiters - waterVolumeLiters).toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">Liters</span>
                </div>
                <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                  Reserve Capacity
                </p>
              </div>

            </div>
          </div>

          {/* Right Visual Liquid Tank Bar Gauge */}
          <div className="w-full lg:w-48 shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-full flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1.5 font-mono">
              <span>TANK LEVEL</span>
              <span className="text-cyan-700 font-bold">{waterLevelPercent}%</span>
            </div>

            {/* Vertical fluid container */}
            <div className="w-full h-28 bg-slate-200/80 rounded-xl overflow-hidden relative border border-slate-300 p-1 flex items-end">
              <div 
                className={`w-full transition-all duration-700 ease-out rounded-lg relative ${
                  waterLevelPercent >= 85
                    ? 'bg-gradient-to-t from-rose-600 via-rose-500 to-amber-400 animate-pulse'
                    : waterLevelPercent >= 70
                    ? 'bg-gradient-to-t from-cyan-600 via-sky-500 to-cyan-400'
                    : 'bg-gradient-to-t from-cyan-600 via-sky-500 to-blue-500'
                }`}
                style={{ height: `${Math.max(5, waterLevelPercent)}%` }}
              >
                {/* Surface shimmer */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-white/40 rounded-t-lg animate-pulse" />
              </div>
            </div>

            <div className="w-full flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-mono">
              <span>0L (Empty)</span>
              <span>{tankCapacityLiters}L (Full)</span>
            </div>
          </div>

        </div>
      </div>

      {/* REAL-TIME ROLLING TELEMETRY CHART: EXCLUSIVELY FLOW RATE (L/min) */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                Live Telemetry Stream (HC-SR04 Ultrasonic Integration)
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-ping" />
                LIVE 1s
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-frequency ultrasonic distance sensor telemetry continuously computing real-time water volume & flow velocity.
            </p>
          </div>

          {/* Single Legend indicator */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Flow Velocity (L/min)</span>
            </div>
          </div>
        </div>

        {/* Single Axis Area Chart for Flow (L/min) */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realtimeHistory}>
              <defs>
                <linearGradient id="flowGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#0891b2" tick={{ fontSize: 11 }} domain={[0, 'auto']} label={{ value: 'L/min', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#0891b2', fontSize: '11px', fontWeight: 'bold' } }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#06b6d4', 
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#0f172a',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="flow" 
                stroke="#06b6d4" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#flowGradLight)" 
                isAnimationActive={false}
                name="Flow Rate (L/min)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TWO COLUMN GRID: Today's Hourly Curve + Fixture Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Diurnal Hourly Profile (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-600" />
                Diurnal Consumption vs Baseline (24-Hour Cycle)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Highlighting morning peak (07:00-09:00) and evening peak (19:00-21:00).
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('usage')}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-bold"
            >
              Full Details &rarr;
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} barGap={1}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} interval={2} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#38bdf8', 
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
                <Bar dataKey="usage" name="Actual (L)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="baseline" name="Expected Baseline (L)" fill="#e2e8f0" stroke="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fixture Consumption Distribution (1 Col) */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-600" />
                Fixture Breakdown
              </h3>
              <span className="text-xs text-cyan-700 font-mono font-semibold">Today</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Mathematical disaggregation of household water consumption.
            </p>

            <div className="space-y-3">
              {fixturesData.map((fixture) => (
                <div key={fixture.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{fixture.name}</span>
                    <span className="font-mono text-slate-500">
                      {fixture.liters} L <strong className="text-slate-900 font-bold">({fixture.value}%)</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${fixture.value}%`,
                        backgroundColor: fixture.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('recommendations')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              View Conservation Recommendations
            </button>
          </div>
        </div>

      </div>

      {/* QUICK HARDWARE & ACTION TILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Tile 1: ML Demand Predictor */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200/60">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Forecast Tomorrow</p>
              <p className="text-[11px] text-slate-500">
                Expected: <strong className="text-slate-800 font-bold">492 L</strong> (Weather: 29°C Sunny)
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('prediction')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition"
          >
            Forecast
          </button>
        </div>

        {/* Tile 2: ESP32 Hardware Integration */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Hardware Telemetry Node</p>
              <p className="text-[11px] text-slate-500">
                ESP32 + HC-SR04 Ultrasonic (Serial/WS Ingestion)
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition"
          >
            Configure
          </button>
        </div>

      </div>

      {/* Target Budget Modal */}
      {budgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 text-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Set Daily Water Budget</h3>
            <p className="text-xs text-slate-500 mb-4">
              Customize your household conservation threshold. DROP X will alert you when consumption reaches 80% and 100%.
            </p>
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Target (Liters)
                </label>
                <input
                  type="number"
                  min="100"
                  max="5000"
                  step="25"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBudgetModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-xs font-bold text-white shadow-md shadow-cyan-600/20"
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
