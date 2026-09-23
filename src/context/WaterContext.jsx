import React, { createContext, useContext, useState, useEffect } from 'react';

const WaterContext = createContext();

// 24 Hour standard profile
const INITIAL_HOURLY = [
  { hour: '00:00', liters: 4.2, baseline: 5.0 },
  { hour: '01:00', liters: 2.1, baseline: 3.0 },
  { hour: '02:00', liters: 1.5, baseline: 2.0 },
  { hour: '03:00', liters: 1.0, baseline: 1.5 },
  { hour: '04:00', liters: 2.3, baseline: 2.0 },
  { hour: '05:00', liters: 8.5, baseline: 7.0 },
  { hour: '06:00', liters: 24.0, baseline: 20.0 },
  { hour: '07:00', liters: 62.4, baseline: 55.0 },
  { hour: '08:00', liters: 78.2, baseline: 68.0 },
  { hour: '09:00', liters: 45.1, baseline: 40.0 },
  { hour: '10:00', liters: 28.3, baseline: 25.0 },
  { hour: '11:00', liters: 22.0, baseline: 20.0 },
  { hour: '12:00', liters: 31.4, baseline: 28.0 },
  { hour: '13:00', liters: 26.5, baseline: 25.0 },
  { hour: '14:00', liters: 18.2, baseline: 19.0 },
  { hour: '15:00', liters: 19.8, baseline: 21.0 },
  { hour: '16:00', liters: 25.4, baseline: 24.0 },
  { hour: '17:00', liters: 36.1, baseline: 32.0 },
  { hour: '18:00', liters: 54.7, baseline: 48.0 },
  { hour: '19:00', liters: 72.8, baseline: 65.0 },
  { hour: '20:00', liters: 68.5, baseline: 60.0 },
  { hour: '21:00', liters: 42.0, baseline: 38.0 },
  { hour: '22:00', liters: 24.1, baseline: 22.0 },
  { hour: '23:00', liters: 11.2, baseline: 10.0 },
];

const INITIAL_WEEKLY = [
  { day: 'Mon', actual: 485, budget: 520, cost: 16.98 },
  { day: 'Tue', actual: 512, budget: 520, cost: 17.92 },
  { day: 'Wed', actual: 468, budget: 520, cost: 16.38 },
  { day: 'Thu', actual: 535, budget: 520, cost: 18.72 },
  { day: 'Fri', actual: 490, budget: 520, cost: 17.15 },
  { day: 'Sat', actual: 640, budget: 580, cost: 22.40 },
  { day: 'Sun', actual: 590, budget: 580, cost: 20.65 },
];

const INITIAL_FIXTURES = [
  { name: 'Showers & Baths', liters: 182, percentage: 37, color: '#06b6d4', icon: 'Shower' },
  { name: 'Toilets', liters: 118, percentage: 24, color: '#0284c7', icon: 'Toilet' },
  { name: 'Washing Machine', liters: 84, percentage: 17, color: '#3b82f6', icon: 'Washing' },
  { name: 'Kitchen & Cooking', liters: 62, percentage: 13, color: '#10b981', icon: 'Kitchen' },
  { name: 'Garden & Outdoor', liters: 44, percentage: 9, color: '#f59e0b', icon: 'Garden' },
];

export const WaterProvider = ({ children }) => {
  // Scenario simulation: 'NORMAL' | 'SHOWER' | 'MICRO_LEAK' | 'BURST_PIPE' | 'ECO' | 'IRRIGATION'
  const [scenario, setScenario] = useState('NORMAL');
  const [valveState, setValveState] = useState('OPEN'); // 'OPEN' | 'CLOSED' | 'AUTO_LOCK'
  const [dailyBudget, setDailyBudget] = useState(550); // Liters
  
  // Real-time telemetry metrics
  const [flowRate, setFlowRate] = useState(3.4); // L/min
  const [pressure, setPressure] = useState(56.2); // PSI
  const [tdsQuality, setTdsQuality] = useState(138); // ppm (good drinkable water)
  const [todayUsage, setTodayUsage] = useState(412.6); // Liters
  const [pulseCount, setPulseCount] = useState(18942);
  const [lastHeartbeat, setLastHeartbeat] = useState(new Date());

  // Rolling real-time data buffer for live chart
  const [realtimeHistory, setRealtimeHistory] = useState(() => {
    const points = [];
    const now = new Date();
    for (let i = 19; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 2000);
      points.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        flow: Number((2.8 + Math.random() * 1.5).toFixed(1)),
        pressure: Number((55.0 + Math.random() * 2.0).toFixed(1)),
        leakRisk: 8
      });
    }
    return points;
  });

  // Active Notifications queue
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'info',
      title: 'Water Quality Normal',
      message: 'Total Dissolved Solids (TDS) at 138 ppm. Water purity level is Optimal.',
      timestamp: '10 mins ago',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'tip',
      title: 'Conservation Milestone',
      message: 'Yesterday your household stayed 12% below your target water budget. Keep it up!',
      timestamp: '2 hours ago',
      read: true,
    }
  ]);

  // Detected Anomaly State
  const [detectedAnomaly, setDetectedAnomaly] = useState(null);

  // Solenoid Control
  const toggleValve = () => {
    if (valveState === 'OPEN') {
      setValveState('CLOSED');
      setFlowRate(0.0);
      addNotification({
        type: 'warning',
        title: 'Main Solenoid Valve Closed',
        message: 'Main supply shutoff triggered manually. Domestic flow halted.',
        timestamp: 'Just now'
      });
    } else {
      setValveState('OPEN');
      addNotification({
        type: 'info',
        title: 'Main Valve Reopened',
        message: 'Normal water distribution resumed.',
        timestamp: 'Just now'
      });
    }
  };

  const emergencyShutoff = () => {
    setValveState('AUTO_LOCK');
    setFlowRate(0.0);
    addNotification({
      type: 'critical',
      title: 'EMERGENCY VALVE SHUTOFF ACTIVATED',
      message: 'Automated flood defense closed the motorized ball valve to prevent property damage.',
      timestamp: 'Just now'
    });
  };

  const addNotification = (notif) => {
    setNotifications(prev => [
      { id: `notif-${Date.now()}`, read: false, ...notif },
      ...prev.slice(0, 19)
    ]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Switch Scenario handler
  const switchScenario = (newScenario) => {
    setScenario(newScenario);
    if (valveState !== 'OPEN') {
      setValveState('OPEN');
    }

    if (newScenario === 'BURST_PIPE') {
      setDetectedAnomaly({
        severity: 'CRITICAL',
        zone: 'Main Baseway Supply Line (Zone 1)',
        type: 'Catastrophic Rupture / Major Burst',
        estimatedLoss: '42.5 L/min',
        confidence: 99.4,
        advice: 'Actuate emergency shutoff immediately to stop structural water damage.'
      });
      addNotification({
        type: 'critical',
        title: 'CRITICAL LEAK ALERT: High Flow Pressure Drop Detected',
        message: 'Flow spiked to 45 L/min with severe pressure collapse (23 PSI). Potential pipe burst!',
        timestamp: 'Just now'
      });
    } else if (newScenario === 'MICRO_LEAK') {
      setDetectedAnomaly({
        severity: 'WARNING',
        zone: 'Master Bathroom (Ensuite Flapper Valve)',
        type: 'Continuous Unattended Micro-Trickle',
        estimatedLoss: '1.8 L/min (~2,590 L/month)',
        confidence: 91.2,
        advice: 'Inspect toilet tank flapper seal or check bidet angle stop valve.'
      });
      addNotification({
        type: 'warning',
        title: 'Abnormal Continuous Flow Warning',
        message: 'Unattended 1.8 L/min trickle detected for > 45 minutes.',
        timestamp: 'Just now'
      });
    } else {
      setDetectedAnomaly(null);
    }
  };

  // Real-time Simulation Engine Tick (every 2.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastHeartbeat(new Date());

      let baseFlow = 0;
      let basePressure = 55.0;
      let riskScore = 4;

      if (valveState === 'CLOSED' || valveState === 'AUTO_LOCK') {
        baseFlow = 0.0;
        basePressure = 58.0;
        riskScore = 0;
      } else {
        switch (scenario) {
          case 'BURST_PIPE':
            baseFlow = Number((42.0 + Math.random() * 8.0).toFixed(1));
            basePressure = Number((21.0 + Math.random() * 4.0).toFixed(1));
            riskScore = 98;
            break;
          case 'MICRO_LEAK':
            baseFlow = Number((1.8 + Math.random() * 0.4).toFixed(2));
            basePressure = Number((53.5 + Math.random() * 1.5).toFixed(1));
            riskScore = 84;
            break;
          case 'SHOWER':
            baseFlow = Number((11.5 + Math.random() * 2.2).toFixed(1));
            basePressure = Number((50.0 + Math.random() * 2.0).toFixed(1));
            riskScore = 12;
            break;
          case 'IRRIGATION':
            baseFlow = Number((22.0 + Math.random() * 3.5).toFixed(1));
            basePressure = Number((48.0 + Math.random() * 2.0).toFixed(1));
            riskScore = 18;
            break;
          case 'ECO':
            baseFlow = Number((1.2 + Math.random() * 1.0).toFixed(1));
            basePressure = Number((56.5 + Math.random() * 1.0).toFixed(1));
            riskScore = 3;
            break;
          case 'NORMAL':
          default:
            baseFlow = Number((2.8 + Math.random() * 2.2).toFixed(1));
            basePressure = Number((55.0 + Math.random() * 2.0).toFixed(1));
            riskScore = 7;
            break;
        }
      }

      setFlowRate(baseFlow);
      setPressure(basePressure);

      // Increment total daily usage based on flow (L/min over 2.5s)
      const incrementLiters = (baseFlow * 2.5) / 60;
      setTodayUsage(prev => Number((prev + incrementLiters).toFixed(2)));
      setPulseCount(prev => prev + Math.floor(baseFlow * 7.5));

      // Append to rolling chart
      setRealtimeHistory(prev => {
        const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const updated = [
          ...prev.slice(1),
          {
            time: nextTime,
            flow: baseFlow,
            pressure: basePressure,
            leakRisk: riskScore
          }
        ];
        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [scenario, valveState]);

  // Indian Municipal Water Tariff (e.g. BWSSB / DJB / Municipal Corporation)
  // Slab 1 (0 - 15,000 L): ₹28.00 / kL (₹0.028 / L)
  // Slab 2 (15,001 - 30,000 L): ₹45.00 / kL (₹0.045 / L)
  // Slab 3 (> 30,000 L): ₹75.00 / kL (₹0.075 / L)
  // Sewerage / Wastewater cess: 25% of water tariff
  const calculateCost = (liters) => {
    let cost = 0;
    if (liters <= 15000) {
      cost = liters * 0.028;
    } else if (liters <= 30000) {
      cost = 15000 * 0.028 + (liters - 15000) * 0.045;
    } else {
      cost = 15000 * 0.028 + 15000 * 0.045 + (liters - 30000) * 0.075;
    }
    const sewerTax = cost * 0.25;
    return {
      waterCost: cost,
      sewerCost: sewerTax,
      totalCost: cost + sewerTax
    };
  };

  const todayCost = calculateCost(todayUsage);
  const monthlyProjectedLiters = todayUsage * 30.5;
  const projectedMonthlyCost = calculateCost(monthlyProjectedLiters);

  return (
    <WaterContext.Provider value={{
      scenario,
      switchScenario,
      valveState,
      setValveState,
      toggleValve,
      emergencyShutoff,
      flowRate,
      pressure,
      tdsQuality,
      todayUsage,
      pulseCount,
      lastHeartbeat,
      realtimeHistory,
      notifications,
      addNotification,
      clearNotification,
      markAllRead,
      detectedAnomaly,
      dailyBudget,
      setDailyBudget,
      hourlyData: INITIAL_HOURLY,
      weeklyData: INITIAL_WEEKLY,
      fixturesData: INITIAL_FIXTURES,
      calculateCost,
      todayCost,
      projectedMonthlyCost,
      monthlyProjectedLiters
    }}>
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => useContext(WaterContext);
