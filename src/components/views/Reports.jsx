import React, { useState } from 'react';
import { useWater } from '../../context/WaterContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  CheckCircle, 
  FileSpreadsheet, 
  ShieldCheck, 
  Layers,
  Sparkles
} from 'lucide-react';

export const Reports = () => {
  const { todayUsage, dailyBudget, weeklyData } = useWater();
  const [reportPeriod, setReportPeriod] = useState('month');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCSV = () => {
    // Generate simple mock CSV data string
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Total_Liters,Peak_Flow_L_min,Avg_Pressure_PSI,Status,Cost_INR\n"
      + "2026-09-22,485.4,14.2,56.2,Normal,16.98\n"
      + "2026-09-21,512.0,15.8,55.8,Normal,17.92\n"
      + "2026-09-20,468.2,13.1,56.5,Normal,16.38\n"
      + "2026-09-19,535.0,16.4,54.9,Normal,18.72\n"
      + "2026-09-18,490.5,14.0,55.5,Normal,17.15\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DROP_X_Water_Audit_${reportPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const auditRows = [
    { date: '2026-09-22 (Today)', intake: `${todayUsage.toFixed(1)} L`, peakFlow: '14.2 L/min', avgPressure: '56.1 PSI', leaks: '0 Detected', cost: '₹16.98', compliance: '100% Pass' },
    { date: '2026-09-21', intake: '512.0 L', peakFlow: '15.8 L/min', avgPressure: '55.8 PSI', leaks: '0 Detected', cost: '₹17.92', compliance: '100% Pass' },
    { date: '2026-09-20', intake: '468.2 L', peakFlow: '13.1 L/min', avgPressure: '56.5 PSI', leaks: '0 Detected', cost: '₹16.38', compliance: '100% Pass' },
    { date: '2026-09-19', intake: '535.0 L', peakFlow: '16.4 L/min', avgPressure: '54.9 PSI', leaks: '0 Detected', cost: '₹18.72', compliance: '100% Pass' },
    { date: '2026-09-18', intake: '490.5 L', peakFlow: '14.0 L/min', avgPressure: '55.5 PSI', leaks: '0 Detected', cost: '₹17.15', compliance: '100% Pass' },
    { date: '2026-09-17', intake: '640.0 L', peakFlow: '22.5 L/min', avgPressure: '53.2 PSI', leaks: 'Resolved (Sprinkler)', cost: '₹22.40', compliance: '94% Pass' },
    { date: '2026-09-16', intake: '590.2 L', peakFlow: '18.9 L/min', avgPressure: '54.8 PSI', leaks: '0 Detected', cost: '₹20.65', compliance: '98% Pass' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Audit Reports & Regulatory Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate certified volumetric water compliance reports, valve actuation logs, and municipal billing records.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-lg shadow-cyan-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Audit report CSV exported successfully to your downloads folder.</span>
        </div>
      )}

      {/* FILTER & PERIOD SELECTOR */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">Reporting Range:</span>
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-cyan-400"
          >
            <option value="week">Past 7 Days (Telemetry Log)</option>
            <option value="month">Current Billing Cycle (Month-to-Date)</option>
            <option value="quarter">Quarterly Conservation Audit (Q3 2026)</option>
            <option value="annual">Year 2026 Full Summary</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Meter: <strong className="text-cyan-400 font-mono">ESP32-WTR-8842</strong></span>
          <span>Property: <strong className="text-slate-200">Villa #42</strong></span>
          <span>Status: <strong className="text-emerald-400">Certified Valid</strong></span>
        </div>
      </div>

      {/* AUDIT SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Cumulative Audited Volume</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">3,721.6</span>
            <span className="text-xs text-cyan-400">Liters</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Recorded across 7 log intervals</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Mean Line Pressure</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-400 font-mono">55.4</span>
            <span className="text-xs text-slate-400">PSI (Nominal)</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">No surge stress anomalies</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Regulatory Environmental Grade</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">ISO 14046</span>
          </div>
          <p className="text-[11px] text-emerald-300 mt-1">Water Footprint Compliant</p>
        </div>

      </div>

      {/* COMPREHENSIVE DATA TABLE */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Volumetric Flow & Anomaly Event Ledger
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Tamper-Proof Audit Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Volume (L)</th>
                <th className="py-3 px-4">Peak Flow</th>
                <th className="py-3 px-4">Avg Pressure</th>
                <th className="py-3 px-4">Leak Alarms</th>
                <th className="py-3 px-4">Est. Cost (₹)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {auditRows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-4 font-medium text-white">{row.date}</td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{row.intake}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{row.peakFlow}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{row.avgPressure}</td>
                  <td className="py-3 px-4 text-slate-300">{row.leaks}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">{row.cost}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {row.compliance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
