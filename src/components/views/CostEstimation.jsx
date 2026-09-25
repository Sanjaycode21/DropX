import React, { useState } from 'react';
import { useWater } from '../../context/WaterContext';
import { 
  IndianRupee, 
  Receipt, 
  CheckCircle2, 
  PiggyBank, 
  Sparkles,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid
} from 'recharts';

export const CostEstimation = () => {
  const { projectedMonthlyCost, calculateCost } = useWater();

  // "What-If" reduction percentage slider (0% - 50%)
  const [savingsPercent, setSavingsPercent] = useState(15);
  
  // Current billing cycle metrics (simulated 30-day cycle, day 19)
  const billingDay = 19;
  const daysInCycle = 30;
  const cycleUsage = 9420; // Liters so far
  const cycleCost = calculateCost(cycleUsage);

  // Projected without saving
  const standardMonthLiters = (cycleUsage / billingDay) * daysInCycle;
  const standardMonthCost = calculateCost(standardMonthLiters);

  // Projected with savings percent applied
  const reducedLiters = standardMonthLiters * (1 - savingsPercent / 100);
  const reducedMonthCost = calculateCost(reducedLiters);
  const monthlySavingsRupees = standardMonthCost.totalCost - reducedMonthCost.totalCost;
  const annualSavingsRupees = monthlySavingsRupees * 12;
  const annualWaterSavedLiters = (standardMonthLiters - reducedLiters) * 12;

  // Indian Tier slabs definition
  const tiers = [
    { name: 'Tier 1 (Lifeline Slab)', range: '0 - 15,000 L', rate: '₹28.00 / kL (₹0.028/L)', status: 'Active (Current Tier)', color: 'bg-emerald-500' },
    { name: 'Tier 2 (Standard Domestic)', range: '15,001 - 30,000 L', rate: '₹45.00 / kL (₹0.045/L)', status: 'Next Tier (+60% rate)', color: 'bg-cyan-500' },
    { name: 'Tier 3 (High Consumption Surcharge)', range: '> 30,000 L', rate: '₹75.00 / kL (₹0.075/L)', status: 'Penalty Tier (+167%)', color: 'bg-rose-500' },
  ];

  // Slab breakdown data for chart in ₹/kL
  const tierCostData = [
    { tier: 'Tier 1 (0-15k L)', baseRate: 28.00, effectiveRate: 35.00 },
    { tier: 'Tier 2 (15-30k L)', baseRate: 45.00, effectiveRate: 56.25 },
    { tier: 'Tier 3 (>30k L)', baseRate: 75.00, effectiveRate: 93.75 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <IndianRupee className="w-6 h-6 text-cyan-600" />
          Tariff Calculation & Cost Estimation (INR ₹)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Indian municipal slab rates, sewerage surcharges, live cycle projections, and conservation ROI simulator.
        </p>
      </div>

      {/* BILLING CYCLE SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Month-to-Date Cost */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Month-to-Date Accrual</span>
            <Receipt className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 font-mono">
                ₹{cycleCost.totalCost.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Day {billingDay} of {daysInCycle} ({cycleUsage.toLocaleString()} L consumed)
            </p>
          </div>
        </div>

        {/* Card 2: Projected Month-End Total */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Projected Full Month Bill</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-700 font-mono">
                ₹{standardMonthCost.totalCost.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Tracking ₹185.00 lower than district average
            </p>
          </div>
        </div>

        {/* Card 3: Water Tariff vs Sewer Tax */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sewer & Wastewater Cess</span>
            <PieIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-blue-700 font-mono">
                ₹{standardMonthCost.sewerCost.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              25% municipal environmental treatment fee
            </p>
          </div>
        </div>

        {/* Card 4: Tier Margin Remaining */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tier 1 Safety Cushion</span>
            <PiggyBank className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {(15000 - cycleUsage).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-cyan-700">Liters</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Remaining before entering higher Tier 2 rate
            </p>
          </div>
        </div>

      </div>

      {/* TWO COLUMN: Tier Slabs Breakdown & Tier Rates Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tier Slabs Table */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-cyan-600" />
            Municipal Tiered Tariff Schedule (₹/kL)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Volumetric consumption tier schedule mandated by State Water Supply & Sewerage Board.
          </p>

          <div className="space-y-3">
            {tiers.map((tier) => (
              <div key={tier.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${tier.color}`} />
                    <span className="text-xs font-bold text-slate-900">{tier.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Volume: <strong className="text-slate-800 font-mono">{tier.range}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-cyan-700 font-mono">{tier.rate}</span>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{tier.status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>
              Your current consumption trajectory keeps your household within <strong>Tier 1 Lifeline rates (₹28/kL)</strong>.
            </span>
          </div>
        </div>

        {/* Tariff Cost Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <IndianRupee className="w-4 h-4 text-cyan-600" />
            Tariff Rate per 1,000 Liters (₹ / kL)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Base water tariff vs effective rate with sewage treatment cess.
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="tier" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" ₹" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Bar dataKey="baseRate" name="Base Tariff (₹/kL)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="effectiveRate" name="Effective Rate incl. Cess (₹/kL)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* INTERACTIVE "WHAT-IF" CONSERVATION SIMULATOR */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-50 via-white to-blue-50 border border-cyan-200 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-black text-slate-900">
                Interactive "What-If" Conservation ROI Calculator
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drag the conservation slider below to see how lowering everyday water usage affects your monthly utility bill and annual savings.
            </p>

            {/* Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Target Reduction Percentage:</span>
                <span className="font-mono text-base font-black text-cyan-700 px-2.5 py-0.5 rounded-lg bg-white border border-cyan-200 shadow-2xs">
                  {savingsPercent}% Lower
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={savingsPercent}
                onChange={(e) => setSavingsPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600 border border-slate-300"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>0% (No Change)</span>
                <span>25% (Moderate Eco)</span>
                <span>50% (Extreme Conservation)</span>
              </div>
            </div>
          </div>

          {/* Savings Readout Panel */}
          <div className="lg:w-80 p-5 rounded-2xl bg-white border border-cyan-200 shadow-sm space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="text-slate-500">Monthly Projected:</span>
              <span className="text-slate-400 font-mono line-through">₹{standardMonthCost.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-bold">New Bill with {savingsPercent}% Cut:</span>
              <span className="text-emerald-700 font-bold font-mono text-sm">₹{reducedMonthCost.totalCost.toFixed(2)}</span>
            </div>

            <div className="pt-1">
              <p className="text-[11px] text-slate-500 font-semibold">Estimated Annual Financial Savings:</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-cyan-700 font-mono">
                  ₹{annualSavingsRupees.toFixed(0)}
                </span>
                <span className="text-xs text-slate-500 font-medium">/year</span>
              </div>
              <p className="text-[10px] text-emerald-700 mt-1 font-mono font-bold">
                + Conserves ~{Math.round(annualWaterSavedLiters).toLocaleString()} Liters of fresh water
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
