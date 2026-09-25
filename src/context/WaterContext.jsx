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
  const [flowRate, setFlowRate] = useState(2.8);
  const [pressure, setPressure] = useState(48.5);
  const [tdsQuality, setTdsQuality] = useState(142);
  const [todayUsage, setTodayUsage] = useState(284.5);
  const [pulseCount, setPulseCount] = useState(1420);
  const [lastHeartbeat, setLastHeartbeat] = useState(new Date());
  const [detectedAnomaly, setDetectedAnomaly] = useState(null);
  const [dailyBudget, setDailyBudget] = useState(450);

  const [waterLevelPercent, setWaterLevelPercent] = useState(78.5);
  const [waterVolumeLiters, setWaterVolumeLiters] = useState(392.5);
  const [distanceCm, setDistanceCm] = useState(12.4);
  const [tankCapacityLiters, setTankCapacityLiters] = useState(500);

  const [realtimeHistory, setRealtimeHistory] = useState([
    { time: '17:40:00', flow: 2.8, leakRisk: 5 },
    { time: '17:40:05', flow: 2.9, leakRisk: 5 },
    { time: '17:40:10', flow: 2.7, leakRisk: 5 },
    { time: '17:40:15', flow: 3.1, leakRisk: 5 },
    { time: '17:40:20', flow: 2.8, leakRisk: 5 },
    { time: '17:40:25', flow: 2.6, leakRisk: 5 },
    { time: '17:40:30', flow: 2.9, leakRisk: 5 },
    { time: '17:40:35', flow: 2.8, leakRisk: 5 },
    { time: '17:40:40', flow: 3.0, leakRisk: 5 },
    { time: '17:40:45', flow: 2.8, leakRisk: 5 }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      type: 'info',
      title: 'Ultrasonic Sensor Connected',
      message: 'HC-SR04 telemetry stream active (ws://localhost:3001).',
      timestamp: '2 mins ago',
      read: false
    }
  ]);

  // Handle Scenario switching effect when hardware feed is idle or simulated
  useEffect(() => {
    let interval;
    let baseFlow = 2.8;
    let anomalyObj = null;
    let targetLevel = 78.5;

    switch (scenario) {
      case 'SHOWER':
        baseFlow = 11.5;
        targetLevel = 65.0;
        break;
      case 'MICRO_LEAK':
        baseFlow = 1.8;
        targetLevel = 45.0;
        anomalyObj = {
          severity: 'WARNING',
          zone: 'Master Ensuite Tank (Zone 2)',
          type: 'Silent Micro-Leak Detected',
          estimatedLoss: '1.8 L/min continuous trickle',
          confidence: 94.2,
          advice: 'Check flapper valve in Master Bath toilet tank.'
        };
        break;
      case 'BURST_PIPE':
        baseFlow = 45.0;
        targetLevel = 92.0;
        anomalyObj = {
          severity: 'CRITICAL',
          zone: 'Water Storage Tank (Ultrasonic Node)',
          type: 'Catastrophic Level Overfill / Pipe Rupture Alert',
          estimatedLoss: '45.0 L/min high volume surge',
          confidence: 99.8,
          advice: 'Main line surge confirmed. Immediate water shutoff advised.'
        };
        break;
      case 'IRRIGATION':
        baseFlow = 22.0;
        targetLevel = 55.0;
        break;
      case 'ECO':
        baseFlow = 1.2;
        targetLevel = 82.0;
        break;
      case 'NORMAL':
      default:
        baseFlow = 2.8;
        targetLevel = 78.5;
        anomalyObj = null;
        break;
    }

    if (valveState !== 'OPEN') {
      baseFlow = 0.0;
    }

    setFlowRate(baseFlow);
    setDetectedAnomaly(anomalyObj);

    // Continuous tick simulator for smooth graphs and tank level/volume updates when WebSocket is idle
    interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const currentFlowNoise = baseFlow > 0 ? Number((baseFlow + (Math.random() * 0.8 - 0.4)).toFixed(1)) : 0;
      
      if (valveState === 'OPEN') {
        setFlowRate(currentFlowNoise);
        setTodayUsage(prev => Number((prev + (currentFlowNoise / 60) * 0.05).toFixed(2)));

        // Gently animate water level & volume
        setWaterLevelPercent(prev => {
          const delta = (Math.random() * 0.4 - 0.2);
          const nextVal = Math.min(100, Math.max(5, prev + delta));
          const rounded = Number(nextVal.toFixed(1));
          
          setWaterVolumeLiters(Number(((rounded / 100) * tankCapacityLiters).toFixed(1)));
          setDistanceCm(Number((30.0 - (rounded / 100.0) * 25.0).toFixed(1)));

          return rounded;
        });
      } else {
        setFlowRate(0.0);
      }

      setRealtimeHistory(prev => [
        ...prev.slice(1),
        {
          time: timeStr,
          flow: valveState === 'OPEN' ? currentFlowNoise : 0,
          leakRisk: scenario === 'BURST_PIPE' ? 95 : scenario === 'MICRO_LEAK' ? 60 : 5
        }
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, [scenario, valveState, tankCapacityLiters]);

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

            // Extract sensor readings with comprehensive fallback
            const levelPercent = data.water_level_percent ?? data.percentage ?? 0;
            const volumeLiters = data.water_volume_liters ?? (data.water_volume_ml ? data.water_volume_ml / 1000 : 0);
            const dist = data.distance_cm ?? data.distance ?? 0;

            if (dist > 0) setDistanceCm(Number(dist.toFixed(1)));
            if (levelPercent > 0) {
              setWaterLevelPercent(Number(levelPercent.toFixed(1)));
              setWaterVolumeLiters(Number(((levelPercent / 100) * tankCapacityLiters).toFixed(1)));
            } else if (volumeLiters > 0) {
              setWaterVolumeLiters(Number(volumeLiters.toFixed(1)));
              const derivedPct = Number(((volumeLiters / tankCapacityLiters) * 100).toFixed(1));
              setWaterLevelPercent(derivedPct);
            }
            
            // Extract raw flow rate directly from hardware telemetry if available
            const rawFlow = data.flow_rate ?? data.flowRate ?? data.flow ?? (levelPercent > 0 ? Number((levelPercent * 0.3).toFixed(1)) : 0);
            
            setFlowRate(Number(rawFlow.toFixed(1)));

            if (volumeLiters > 0) {
              setTodayUsage(prev => Number((prev + volumeLiters * 0.01).toFixed(2)));
            }

            setRealtimeHistory(prev => {
              const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const updated = [
                ...prev.slice(1),
                {
                  time: nextTime,
                  flow: Number(rawFlow.toFixed(1)),
                  leakRisk: data.status === 'CRITICAL' ? 95 : data.status === 'HIGH' ? 60 : 5
                }
              ];
              return updated;
            });

            if (data.status === 'CRITICAL' || data.buzzer || levelPercent >= 85) {
              setDetectedAnomaly({
                severity: 'CRITICAL',
                zone: 'Water Storage Tank (Ultrasonic Node)',
                type: 'Critical Level Overfill / Overflow Alert',
                estimatedLoss: `${levelPercent.toFixed(1)}% Full (Dist: ${dist.toFixed(1)}cm)`,
                confidence: 99.8,
                advice: 'Tank capacity critical. Water shutoff or usage advised.'
              });
            } else if (data.status === 'HIGH' || levelPercent >= 70) {
              setDetectedAnomaly({
                severity: 'WARNING',
                zone: 'Water Storage Tank (Ultrasonic Node)',
                type: 'High Water Level Warning',
                estimatedLoss: `${levelPercent.toFixed(1)}% Full`,
                confidence: 90.0,
                advice: 'Approaching full capacity threshold.'
              });
            } else if (scenario === 'NORMAL') {
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
  }, [tankCapacityLiters]);

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
      waterLevelPercent,
      waterVolumeLiters,
      distanceCm,
      tankCapacityLiters,
      setTankCapacityLiters,
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

