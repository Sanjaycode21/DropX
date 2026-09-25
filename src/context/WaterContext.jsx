import React, { createContext, useContext, useState, useEffect } from 'react';

export const WaterContext = createContext();

// Default 24h baseline pattern (Liters/hour)
const INITIAL_HOURLY = [
  { hour: '00:00', usage: 4.2, baseline: 5.0, status: 'normal' },
  { hour: '02:00', usage: 2.1, baseline: 3.0, status: 'normal' },
  { hour: '04:00', usage: 1.8, baseline: 2.5, status: 'normal' },
  { hour: '06:00', usage: 18.5, baseline: 15.0, status: 'normal' },
  { hour: '08:00', usage: 42.0, baseline: 38.0, status: 'normal' },
  { hour: '10:00', usage: 24.3, baseline: 22.0, status: 'normal' },
  { hour: '12:00', usage: 31.0, baseline: 28.0, status: 'normal' },
  { hour: '14:00', usage: 19.4, baseline: 20.0, status: 'normal' },
  { hour: '16:00', usage: 26.8, baseline: 25.0, status: 'normal' },
  { hour: '18:00', usage: 48.2, baseline: 42.0, status: 'normal' },
  { hour: '20:00', usage: 39.5, baseline: 35.0, status: 'normal' },
  { hour: '22:00', usage: 14.1, baseline: 12.0, status: 'normal' }
];

const INITIAL_WEEKLY = [
  { day: 'Mon', consumption: 380, target: 450, cost: 13.3 },
  { day: 'Tue', consumption: 410, target: 450, cost: 14.4 },
  { day: 'Wed', consumption: 395, target: 450, cost: 13.8 },
  { day: 'Thu', consumption: 460, target: 450, cost: 16.1 },
  { day: 'Fri', consumption: 430, target: 450, cost: 15.1 },
  { day: 'Sat', consumption: 520, target: 450, cost: 18.2 },
  { day: 'Sun', consumption: 485, target: 450, cost: 17.0 }
];

const INITIAL_FIXTURES = [
  { name: 'Showers & Baths', value: 38, liters: 156.8, color: '#06b6d4', icon: 'ShowerHead' },
  { name: 'Toilets', value: 24, liters: 99.0, color: '#3b82f6', icon: 'Droplets' },
  { name: 'Washing Machine', value: 18, liters: 74.3, color: '#8b5cf6', icon: 'Shirt' },
  { name: 'Kitchen Faucets', value: 12, liters: 49.5, color: '#10b981', icon: 'Utensils' },
  { name: 'Garden Irrigation', value: 8, liters: 33.0, color: '#f59e0b', icon: 'Sprout' }
];

export const WaterProvider = ({ children }) => {
  const [scenario, setScenario] = useState('NORMAL');
  const [valveState, setValveState] = useState('OPEN');
  const [flowRate, setFlowRate] = useState(0.0);
  const [pressure, setPressure] = useState(55.0);
  const [tdsQuality, setTdsQuality] = useState(138);
  const [todayUsage, setTodayUsage] = useState(412.6);
  const [pulseCount, setPulseCount] = useState(3094);
  const [dailyBudget, setDailyBudget] = useState(500);
  const [lastHeartbeat, setLastHeartbeat] = useState(new Date());

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

  const [detectedAnomaly, setDetectedAnomaly] = useState(null);

  // WebSocket listener for real ESP32 telemetry from server/index.js
  useEffect(() => {
    let ws;
    let reconnectTimer;

    const connect = () => {
      try {
        ws = new WebSocket('ws://localhost:3001');

        ws.onopen = () => {
          console.log('✅ Connected to DROP X WebSocket (ws://localhost:3001)');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.status === 'ERROR' || data.error) return;

            setLastHeartbeat(new Date());

            // Extract sensor readings
            const levelPercent = data.water_level_percent ?? data.percentage ?? 0;
            const volumeLiters = data.water_volume_liters ?? (data.water_volume_ml ? data.water_volume_ml / 1000 : 0);
            const dist = data.distance_cm ?? data.distance ?? 0;

            const currentFlow = levelPercent > 0 ? Number(levelPercent.toFixed(1)) : 0;
            setFlowRate(currentFlow);

            const currentPressure = dist > 0 ? Number(dist.toFixed(1)) : 55.0;
            setPressure(currentPressure);

            if (volumeLiters > 0) {
              setTodayUsage(prev => Number((prev + volumeLiters * 0.05).toFixed(2)));
            }

            setRealtimeHistory(prev => {
              const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const updated = [
                ...prev.slice(1),
                {
                  time: nextTime,
                  flow: currentFlow,
                  pressure: currentPressure,
                  leakRisk: data.status === 'CRITICAL' ? 95 : data.status === 'HIGH' ? 60 : 5
                }
              ];
              return updated;
            });

            if (data.status === 'CRITICAL' || data.buzzer) {
              setDetectedAnomaly({
                severity: 'CRITICAL',
                zone: 'Water Storage Tank (ESP32 Node)',
                type: 'Critical Level Overfill / Spill Alert',
                estimatedLoss: `${levelPercent}% Full`,
                confidence: 99.8,
                advice: 'Tank capacity critical. Water shutoff advised.'
              });
            } else if (data.status === 'HIGH') {
              setDetectedAnomaly({
                severity: 'WARNING',
                zone: 'Water Storage Tank (ESP32 Node)',
                type: 'High Water Level Warning',
                estimatedLoss: `${levelPercent}% Full`,
                confidence: 90.0,
                advice: 'Approaching full capacity threshold.'
              });
            } else {
              setDetectedAnomaly(null);
            }
          } catch (err) {
            // Ignore bad JSON packets
          }
        };

        ws.onerror = () => {
          // Reconnect on error
        };

        ws.onclose = () => {
          reconnectTimer = setTimeout(connect, 3000);
        };
      } catch (e) {
        reconnectTimer = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

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

  const switchScenario = (newScenario) => {
    setScenario(newScenario);
  };

  const calculateCost = (liters = 0) => {
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
