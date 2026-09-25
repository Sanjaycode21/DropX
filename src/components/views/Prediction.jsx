import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sun, 
  CloudRain, 
  CloudSun, 
  Thermometer, 
  Sparkles, 
  Brain
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid
} from 'recharts';

export const Prediction = () => {
  const [horizon, setHorizon] = useState('7d');

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
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-600" />
            AI Water Demand Prediction & Weather Synergy
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Machine learning neural model forecasting future water intake based on weather forecasts and occupant habits.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <button
            onClick={() => setHorizon('7d')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              horizon === '7d' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            7-Day Forecast
          </button>
          <button
            onClick={() => setHorizon('30d')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              horizon === '30d' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            30-Day Monthly Outlook
          </button>
        </div>
      </div>

      {/* SURGE PREDICTION ADVISORY BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 via-white to-sky-50 border border-cyan-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
                AI Predictive Weather Advisory
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold">
                Heatwave Surge Alert
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1">
              Saturday will hit <strong className="text-slate-900">34°C (hot & dry)</strong>. Expected surge to <strong className="text-cyan-800 font-bold">645 Liters</strong> (+30% above baseline).
              Enabling smart-drip scheduling can save up to 90 Liters on that day.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition whitespace-nowrap">
          Schedule Pre-Cooling Mode
        </button>
      </div>

      {/* FORECAST CHART WITH CONFIDENCE BANDS */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600" />
              {horizon === '7d' ? '7-Day Predicted Demand with 95% Confidence Band' : '30-Day Projected Consumption by Week'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Shaded cyan zone represents algorithmic lower and upper bounds of anticipated consumption.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-cyan-700">
              <span className="w-3 h-0.5 bg-cyan-600 rounded-full" />
              <span>Predicted (Liters)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 bg-cyan-50 border border-cyan-200 rounded-sm" />
              <span>Confidence Interval</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {horizon === '7d' ? (
              <ComposedChart data={forecast7d}>
                <defs>
                  <linearGradient id="predictGradLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" L" domain={[300, 750]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="upper" fill="url(#predictGradLight)" stroke="transparent" name="Upper Limit (L)" />
                <Line type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} name="Predicted Demand (L)" />
                <Line type="monotone" dataKey="lower" stroke="#0284c7" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Lower Limit (L)" />
              </ComposedChart>
            ) : (
              <ComposedChart data={forecast30d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" L" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="upper" fill="#06b6d420" stroke="transparent" name="Upper Range (L)" />
                <Line type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} name="Expected Liters" />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-DAY WEATHER AND DEMAND CORRELATION CARDS */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
          <Thermometer className="w-4 h-4 text-cyan-600" />
          Daily Meteorological Correlation Matrix
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Integrated meteorological telemetry modulating the DROP X consumption algorithm.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {forecast7d.map((f) => (
            <div 
              key={f.day} 
              className={`p-3.5 rounded-2xl border flex flex-col justify-between text-xs transition shadow-2xs ${
                f.temp >= 33 
                  ? 'bg-amber-50 border-amber-200' 
                  : f.rain >= 50 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-900">
                  <span>{f.day.split(' ')[0]}</span>
                  {f.rain >= 50 ? (
                    <CloudRain className="w-4 h-4 text-blue-600" />
                  ) : f.temp >= 31 ? (
                    <Sun className="w-4 h-4 text-amber-600" />
                  ) : (
                    <CloudSun className="w-4 h-4 text-cyan-600" />
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900 font-mono">{f.temp}°C</span>
                  <span className="text-slate-500 font-mono font-medium">{f.rain}% rain</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80">
                <p className="text-[10px] text-slate-500 font-medium">Demand:</p>
                <p className="text-sm font-black text-cyan-700 font-mono">
                  {f.predicted} <span className="text-[10px] font-semibold text-slate-500">L</span>
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
