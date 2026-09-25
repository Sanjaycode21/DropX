import React, { useState } from 'react';
import { useWater } from '../../context/WaterContext';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Power, 
  Activity, 
  RefreshCw, 
  Zap, 
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid
} from 'recharts';

export const LeakDetection = () => {
  const { 
    scenario, 
    switchScenario, 
    emergencyShutoff, 
    flowRate, 
    detectedAnomaly,
    realtimeHistory 
  } = useWater();

  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  // Sensor node status across household zones
  const zoneSensors = [
    { 
      id: 'Z1', 
      name: 'Main Tank Ultrasonic Inflow (Zone 1)', 
      flowSensor: 'HC-SR04 Sensor Node #01', 
      level: `82% Capacity`,
      status: scenario === 'BURST_PIPE' ? 'CRITICAL_LEAK' : 'OPTIMAL',
      vibration: scenario === 'BURST_PIPE' ? 'High Volume Surge' : 'Normal Baseline'
    },
    { 
      id: 'Z2', 
      name: 'Master Ensuite Tank (Zone 2)', 
      flowSensor: 'HC-SR04 Sensor Node #02', 
      level: `64% Capacity`,
      status: scenario === 'MICRO_LEAK' ? 'SLOW_TRICKLE' : 'OPTIMAL',
      vibration: scenario === 'MICRO_LEAK' ? 'Intermittent Flow' : 'Quiescent'
    },
    { 
      id: 'Z3', 
      name: 'Kitchen Storage Unit (Zone 3)', 
      flowSensor: 'HC-SR04 Sensor Node #03', 
      level: `91% Capacity`,
      status: 'OPTIMAL',
      vibration: 'Quiescent'
    },
    { 
      id: 'Z4', 
      name: 'Outdoor Overhead Reserve (Zone 4)', 
      flowSensor: 'HC-SR04 Sensor Node #04', 
      level: `75% Capacity`,
      status: 'OPTIMAL',
      vibration: 'Normal'
    },
  ];

  const runIntegrityTest = () => {
    setDiagnosticRunning(true);
    setDiagnosticResult(null);

    setTimeout(() => {
      setDiagnosticRunning(false);
      if (scenario === 'BURST_PIPE') {
        setDiagnosticResult({
          pass: false,
          leakRate: '42.4 L/min',
          deltaP: 'Catastrophic volume decay in 10s',
          recommendation: 'Severe breach confirmed. Check primary tank outlet immediately.'
        });
      } else if (scenario === 'MICRO_LEAK') {
        setDiagnosticResult({
          pass: false,
          leakRate: '1.85 L/min',
          deltaP: 'Continuous un-replenished drop over 30s',
          recommendation: 'Small constant drain detected mathematically via ultrasonic level curve.'
        });
      } else {
        setDiagnosticResult({
          pass: true,
          leakRate: '0.00 L/min',
          deltaP: '0.0 cm/s decay (Stable Level)',
          recommendation: 'All tank levels and computed flow velocity curves passed integrity check.'
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
            <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-cyan-600" />
              AI Leak Detection & Ultrasonic Anomaly Guard
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time differential ultrasonic height telemetry, volume rate integration, and leak classification.
          </p>
        </div>

        {/* Quick Test Diagnostic Trigger */}
        <button
          onClick={runIntegrityTest}
          disabled={diagnosticRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${diagnosticRunning ? 'animate-spin' : ''}`} />
          <span>{diagnosticRunning ? 'Scanning Ultrasonic Telemetry...' : 'Run Hydrostatic Integrity Test'}</span>
        </button>
      </div>

      {/* ANOMALY STATUS HIGHLIGHT CARD */}
      {detectedAnomaly ? (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-white border border-rose-200 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-black text-xs uppercase tracking-wider animate-pulse">
                  {detectedAnomaly.severity} ANOMALY DETECTED
                </span>
                <span className="text-xs text-rose-700 font-bold font-mono">
                  Confidence: {detectedAnomaly.confidence}%
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {detectedAnomaly.type}
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Origin: <strong className="text-slate-900">{detectedAnomaly.zone}</strong>. Rate of loss:{' '}
                <strong className="text-rose-700 font-mono font-bold">{detectedAnomaly.estimatedLoss}</strong>.
              </p>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-slate-700">
                <strong className="text-rose-700">AI Remediation Guide: </strong>
                {detectedAnomaly.advice}
              </div>
            </div>

            {/* Actuation Controls */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={emergencyShutoff}
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition flex items-center justify-center gap-2"
              >
                <Power className="w-4 h-4" />
                Trigger Emergency Cutoff
              </button>
              <button
                onClick={() => switchScenario('NORMAL')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-2xs"
              >
                Dismiss / Resolve Anomaly
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Ultrasonic Telemetry Baseline Intact</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                No un-replenished level drops, micro-trickles, or overflow risks detected.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Active AI Sentry Guard
          </div>
        </div>
      )}

      {/* DIAGNOSTIC TEST RESULT NOTIFICATION (IF TRIGGERED) */}
      {diagnosticResult && (
        <div className={`p-4 rounded-2xl border text-xs shadow-xs ${
          diagnosticResult.pass 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center justify-between font-bold mb-1">
            <span className="flex items-center gap-2">
              {diagnosticResult.pass ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              Ultrasonic Volume & Flow Integration Test: {diagnosticResult.pass ? 'PASSED (Zero Leakage)' : 'FAILED (Leakage Detected)'}
            </span>
            <span className="font-mono">{diagnosticResult.deltaP}</span>
          </div>
          <p className="text-slate-600 mt-1">
            Measured Leak Rate: <strong className="font-mono">{diagnosticResult.leakRate}</strong> • {diagnosticResult.recommendation}
          </p>
        </div>
      )}

      {/* TWO COLUMN: Ultrasonic Telemetry Chart + Anomaly Logic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Realtime Flow Stream Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                Ultrasonic Telemetry Flow Stream (L/min)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mathematical derivative $dV/dt$ computed from HC-SR04 ultrasonic distance readings.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={realtimeHistory}>
                <defs>
                  <linearGradient id="flowGradLeak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#0891b2" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px', color: '#0f172a' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="flow" 
                  name="Flow (L/min)" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  fillOpacity={1}
                  fill="url(#flowGradLeak)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Detection Criteria Explanation */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-600" />
              Ultrasonic AI Signatures
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              How DROP X computes flow rates and leak anomalies purely from distance readings:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between font-bold text-cyan-700">
                  <span>1. Height-to-Volume Integration</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800">HC-SR04</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Water height $H = H_{tank} - \text{Distance}$. Volume $V = A \cdot H$. Flow velocity equals derivative $dV/dt$.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between font-bold text-amber-700">
                  <span>2. Unattended Continuous Drain</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Slope Analysis</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Negative height slope without active usage windows indicates silent toilet or pipe micro-leak.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between font-bold text-emerald-700">
                  <span>3. Overflow & Spill Sentry</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Threshold Alarm</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  When distance drops below 5.0 cm (&gt;85% tank capacity), emergency buzzer and notifications fire.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-mono">
              Model: DROPX-ULTRASONIC-SOLVER-v2.4
            </span>
          </div>
        </div>

      </div>

      {/* SENSOR NODES GRID */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-cyan-600" />
          Zonal Ultrasonic Sensor Network
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Status of HC-SR04 ultrasonic node array across residence storage tanks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zoneSensors.map((zone) => (
            <div 
              key={zone.id} 
              className={`p-4 rounded-2xl border transition shadow-2xs ${
                zone.status === 'CRITICAL_LEAK'
                  ? 'bg-rose-50 border-rose-200'
                  : zone.status === 'SLOW_TRICKLE'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 font-mono">{zone.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  zone.status === 'CRITICAL_LEAK'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : zone.status === 'SLOW_TRICKLE'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {zone.status === 'CRITICAL_LEAK' ? 'BURST ALERT' : zone.status === 'SLOW_TRICKLE' ? 'TRICKLE LEAK' : 'STABLE'}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mt-2 truncate">
                {zone.name}
              </h4>

              <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Hardware Node:</span>
                  <span className="text-slate-900 font-mono font-semibold">{zone.flowSensor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calculated Level:</span>
                  <span className="text-cyan-700 font-mono font-bold">{zone.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Telemetry State:</span>
                  <span className="text-slate-800 font-medium">{zone.vibration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
