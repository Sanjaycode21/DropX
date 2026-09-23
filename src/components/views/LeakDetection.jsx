import React, { useState } from 'react';
import { useWater } from '../../context/WaterContext';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Power, 
  Activity, 
  Gauge, 
  RefreshCw, 
  Sliders, 
  Volume2, 
  Zap, 
  Wifi, 
  Flame, 
  Sparkles,
  Layers,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const LeakDetection = () => {
  const { 
    scenario, 
    switchScenario, 
    valveState, 
    toggleValve, 
    emergencyShutoff, 
    flowRate, 
    pressure, 
    detectedAnomaly,
    realtimeHistory 
  } = useWater();

  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  // Sensor node status across household zones
  const zoneSensors = [
    { 
      id: 'Z1', 
      name: 'Main Baseway Inflow (Zone 1)', 
      flowSensor: 'YF-S201 #01', 
      pressure: `${pressure.toFixed(1)} PSI`,
      status: scenario === 'BURST_PIPE' ? 'CRITICAL_LEAK' : 'OPTIMAL',
      vibration: scenario === 'BURST_PIPE' ? 'High Acoustic Hiss' : 'Normal Low',
      valve: valveState
    },
    { 
      id: 'Z2', 
      name: 'Master Ensuite & Geyser (Zone 2)', 
      flowSensor: 'Hall Effect #02', 
      pressure: `${(pressure - 1.5).toFixed(1)} PSI`,
      status: scenario === 'MICRO_LEAK' ? 'SLOW_TRICKLE' : 'OPTIMAL',
      vibration: scenario === 'MICRO_LEAK' ? 'Intermittent Flow' : 'Quiescent',
      valve: 'OPEN'
    },
    { 
      id: 'Z3', 
      name: 'Kitchen & Dishwasher (Zone 3)', 
      flowSensor: 'Hall Effect #03', 
      pressure: `${(pressure - 0.8).toFixed(1)} PSI`,
      status: 'OPTIMAL',
      vibration: 'Quiescent',
      valve: 'OPEN'
    },
    { 
      id: 'Z4', 
      name: 'Outdoor Irrigation Line (Zone 4)', 
      flowSensor: 'Brass Rotor #04', 
      pressure: `${(pressure - 2.1).toFixed(1)} PSI`,
      status: 'OPTIMAL',
      vibration: 'Normal',
      valve: 'OPEN'
    },
  ];

  const runPressureDecayTest = () => {
    setDiagnosticRunning(true);
    setDiagnosticResult(null);

    setTimeout(() => {
      setDiagnosticRunning(false);
      if (scenario === 'BURST_PIPE') {
        setDiagnosticResult({
          pass: false,
          leakRate: '42.4 L/min',
          deltaP: '34.2 PSI drop in 10s',
          recommendation: 'Severe breach confirmed. Keep main supply isolated until physical repair.'
        });
      } else if (scenario === 'MICRO_LEAK') {
        setDiagnosticResult({
          pass: false,
          leakRate: '1.85 L/min',
          deltaP: '4.8 PSI decay over 30s',
          recommendation: 'Small constant drain detected. Check flapper valve in Master Bath.'
        });
      } else {
        setDiagnosticResult({
          pass: true,
          leakRate: '0.00 L/min',
          deltaP: '0.0 PSI decay (Stable at 56 PSI)',
          recommendation: 'All plumbing manifolds passed airtight acoustic and hydrostatic integrity.'
        });
      }
    }, 2200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
              AI Leak Detection & Acoustic Anomaly Guard
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time differential pressure correlation, acoustic frequency analysis, and automated solenoid isolation.
          </p>
        </div>

        {/* Quick Test Diagnostic Trigger */}
        <button
          onClick={runPressureDecayTest}
          disabled={diagnosticRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${diagnosticRunning ? 'animate-spin' : ''}`} />
          <span>{diagnosticRunning ? 'Pressurizing Line & Testing...' : 'Run Hydrostatic Integrity Test'}</span>
        </button>
      </div>

      {/* ANOMALY STATUS HIGHLIGHT CARD */}
      {detectedAnomaly ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border border-rose-500/60 shadow-2xl shadow-rose-950/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-black text-xs uppercase tracking-wider animate-pulse">
                  {detectedAnomaly.severity} ANOMALY DETECTED
                </span>
                <span className="text-xs text-rose-300 font-mono">
                  Confidence: {detectedAnomaly.confidence}%
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {detectedAnomaly.type}
              </h3>
              <p className="text-xs text-rose-200/90 max-w-2xl leading-relaxed">
                Origin: <strong className="text-white">{detectedAnomaly.zone}</strong>. Rate of water loss is approximately{' '}
                <strong className="text-white font-mono">{detectedAnomaly.estimatedLoss}</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/30 text-xs text-slate-300">
                <strong className="text-rose-400">AI Remediation Guide: </strong>
                {detectedAnomaly.advice}
              </div>
            </div>

            {/* Actuation Controls */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={emergencyShutoff}
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/40 transition flex items-center justify-center gap-2"
              >
                <Power className="w-4 h-4" />
                Emergency Valve Trip
              </button>
              <button
                onClick={() => switchScenario('NORMAL')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition"
              >
                Dismiss / Resolve Anomaly
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Plumbing Manifold Intact & Quiescent</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                No differential pressure decays, micro-trickles, or pipe rupture signatures detected.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Active AI Sentry Guard
          </div>
        </div>
      )}

      {/* DIAGNOSTIC TEST RESULT NOTIFICATION (IF TRIGGERED) */}
      {diagnosticResult && (
        <div className={`p-4 rounded-2xl border text-xs ${
          diagnosticResult.pass 
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center justify-between font-bold mb-1">
            <span className="flex items-center gap-2">
              {diagnosticResult.pass ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
              Hydrostatic Pressure Decay Test Result: {diagnosticResult.pass ? 'PASSED (Zero Leakage)' : 'FAILED (Leakage Detected)'}
            </span>
            <span className="font-mono">{diagnosticResult.deltaP}</span>
          </div>
          <p className="text-slate-300 mt-1">
            Measured Leak Rate: <strong className="font-mono">{diagnosticResult.leakRate}</strong> • {diagnosticResult.recommendation}
          </p>
        </div>
      )}

      {/* TWO COLUMN: Differential Pressure vs Flow Correlation + Anomaly Logic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Realtime Flow vs Pressure Correlation Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Differential Correlation: Flow Velocity vs Pressure
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                A sudden spike in flow coupled with a sharp drop in pressure triggers the automated rupture alarm.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={realtimeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 10 }} domain={[0, 80]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="flow" 
                  name="Flow (L/min)" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  dot={false}
                  isAnimationActive={false}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="pressure" 
                  name="Pressure (PSI)" 
                  stroke="#f43f5e" 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Detection Criteria Explanation */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              AI Leak Signatures
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              How DROP X separates real human water use from destructive anomalies:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between font-bold text-cyan-400">
                  <span>1. Pressure Decay Correlation</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300">Piezoresistive</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  High flow + high pressure = Irrigation / High tap. High flow + sudden pressure drop = Pipe Burst rupture.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between font-bold text-amber-400">
                  <span>2. Unattended Continuous Drain</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300">Minimum Flow</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Continuous flow between 1.0 - 2.5 L/min for &gt; 45 continuous minutes without human motion triggers micro-leak alert.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between font-bold text-emerald-400">
                  <span>3. Nighttime Quiescent Window</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300">Diurnal Zero</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Between 02:00 AM and 04:00 AM, flow must touch absolute 0.0 L/min for at least 15 continuous minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 font-mono">
              Model: DROPX-ISOLATION-FOREST-v2.1
            </span>
          </div>
        </div>

      </div>

      {/* SENSOR NODES & VALVES GRID */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-cyan-400" />
          Zonal Sensor Manifold & Motorized Ball Valves
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Status of ultrasonic flow meters and remote actuated shutoffs across residence zones.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zoneSensors.map((zone) => (
            <div 
              key={zone.id} 
              className={`p-4 rounded-2xl border transition ${
                zone.status === 'CRITICAL_LEAK'
                  ? 'bg-rose-950/40 border-rose-500/50'
                  : zone.status === 'SLOW_TRICKLE'
                  ? 'bg-amber-950/30 border-amber-500/50'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">{zone.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  zone.status === 'CRITICAL_LEAK'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : zone.status === 'SLOW_TRICKLE'
                    ? 'bg-amber-600 text-slate-950'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {zone.status === 'CRITICAL_LEAK' ? 'BURST ALERT' : zone.status === 'SLOW_TRICKLE' ? 'TRICKLE LEAK' : 'STABLE'}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-200 mt-2 truncate">
                {zone.name}
              </h4>

              <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Telemetry:</span>
                  <span className="text-slate-200 font-mono">{zone.flowSensor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Line Pressure:</span>
                  <span className="text-cyan-400 font-mono font-semibold">{zone.pressure}</span>
                </div>
                <div className="flex justify-between">
                  <span>Acoustics:</span>
                  <span className="text-slate-300">{zone.vibration}</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={toggleValve}
                  className="w-full py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  Valve: {zone.valve}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
