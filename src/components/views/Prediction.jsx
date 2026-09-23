import React, { useState } from 'react';
import { useWater } from '../../context/WaterContext';
import { 
  TrendingUp, 
  Sun, 
  CloudRain, 
  CloudSun, 
  Thermometer, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  Brain,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const Prediction = () => {
  const [horizon, setHorizon] = useState('7d'); // '7d' | '30d'

  // 7-day predictive forecast with weather correlation
  const forecast7d = [
    { day: 'Wed (Tom)', temp: 28, rain: 0, predicted: 495, upper: 530, lower: 460, weather: 'Sunny', factor: 'Baseline work day' },
    { day: 'Thu', temp: 31, rain: 10, predicted: 520, upper: 560, lower: 480, weather: 'Warm', factor: 'Elevated shower demand' },
    { day: 'Fri', temp: 33, rain: 0, predicted: 560, upper: 610, lower: 515, weather: 'Hot', factor: 'Heatwave surge' },
    { day: 'Sat', temp: 34, rain: 0, predicted: 645, upper: 700, lower: 590, weather: 'Heatwave', factor: 'Weekend laundry + lawn' },
    { day: 'Sun', temp: 29, rain: 25, predicted: 580, upper: 630, lower: 530, weather: 'Partly Cloudy', factor: 'Weekend family demand' },
    { day: 'Mon', temp: 25, rain: 80, predicted: 430, upper: 470, lower: 390, weather: 'Heavy Rain', factor: 'Lawn irrigation suspended' },
    { day: 'Tue', temp: 26, rain: 45, predicted: 450, upper: 490, lower: 410, weather: 'Scattered Showers', factor: 'Cool weather dip' },
  ];

  // 30-day weekly aggregated forecast
  const forecast30d = [
    { week: 'Week 1', predicted: 3680, upper: 3950, lower: 3410, cost: 128.80, weather: 'Avg 30°C Sunny' },
    { week: 'Week 2', predicted: 3550, upper: 3820, lower: 3280, cost: 124.25, weather: 'Avg 28°C Moderate' },
    { week: 'Week 3', predicted: 3920, upper: 4250, lower: 3600, cost: 137.20, weather: 'Avg 33°C Heat Spike' },
    { week: 'Week 4', predicted: 3240, upper: 3500, lower: 2980, cost: 113.40, weather: 'Avg 24°C Monsoon/Rain' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            AI Water Demand Prediction & Weather Synergy
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Machine learning neural model forecasting future municipal intake based on weather forecasts and occupant habits.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setHorizon('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              horizon === '7d' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            7-Day Forecast
          </button>
          <button
            onClick={() => setHorizon('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              horizon === '30d' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            30-Day Monthly Outlook
          </button>
        </div>
      </div>

      {/* SURGE PREDICTION ADVISORY BANNER */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                AI Predictive Weather Advisory
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-200">
                Heatwave Surge Alert
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Saturday will hit <strong>34°C (hot & dry)</strong>. Expected surge to <strong>645 Liters</strong> (+30% above baseline).
              Enabling smart-drip scheduling can save up to 90 Liters on that day.
            </p>
          </div>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition whitespace-nowrap">
          Schedule Pre-Cooling Mode
        </button>
      </div>

      {/* FORECAST CHART WITH CONFIDENCE BANDS */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              {horizon === '7d' ? '7-Day Predicted Demand with 95% Confidence Band' : '30-Day Projected Consumption by Week'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Shaded cyan zone represents algorithmic lower and upper bounds of anticipated consumption.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
              <span>Predicted (Liters)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 bg-cyan-950/60 border border-cyan-500/40 rounded-sm" />
              <span>Confidence Interval</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {horizon === '7d' ? (
              <ComposedChart data={forecast7d}>
                <defs>
                  <linearGradient id="predictGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit=" L" domain={[300, 750]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="upper" fill="url(#predictGrad)" stroke="transparent" name="Upper Limit (L)" />
                <Line type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} name="Predicted Demand (L)" />
                <Line type="monotone" dataKey="lower" stroke="#0284c7" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Lower Limit (L)" />
              </ComposedChart>
            ) : (
              <ComposedChart data={forecast30d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit=" L" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="upper" fill="#06b6d420" stroke="transparent" name="Upper Range (L)" />
                <Line type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} name="Expected Liters" />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-DAY WEATHER AND DEMAND CORRELATION CARDS */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <Thermometer className="w-4 h-4 text-cyan-400" />
          Daily Meteorological Correlation Matrix
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Integrated meteorological telemetry modulating the DROP X consumption algorithm.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {forecast7d.map((f, i) => (
            <div 
              key={f.day} 
              className={`p-3 rounded-2xl border flex flex-col justify-between text-xs transition ${
                f.temp >= 33 
                  ? 'bg-amber-950/20 border-amber-500/30' 
                  : f.rain >= 50 
                  ? 'bg-blue-950/20 border-blue-500/30' 
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span>{f.day.split(' ')[0]}</span>
                  {f.rain >= 50 ? (
                    <CloudRain className="w-4 h-4 text-blue-400" />
                  ) : f.temp >= 31 ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <CloudSun className="w-4 h-4 text-cyan-400" />
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">{f.temp}°C</span>
                  <span className="text-slate-400 font-mono">{f.rain}% rain</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800">
                <p className="text-[10px] text-slate-400">Demand:</p>
                <p className="text-sm font-black text-cyan-400 font-mono">
                  {f.predicted} <span className="text-[10px] font-normal">L</span>
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">
                  {f.factor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
