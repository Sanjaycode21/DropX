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
  const [pressure, setPressure] = useState(48.5);
  const [tdsQuality, setTdsQuality] = useState(142);
  const [todayUsage, setTodayUsage] = useState(0.0);
  const [pulseCount, setPulseCount] = useState(0);
  const [lastHeartbeat, setLastHeartbeat] = useState(null);
  const [detectedAnomaly, setDetectedAnomaly] = useState(null);
  const [dailyBudget, setDailyBudget] = useState(450);

  const [waterLevelPercent, setWaterLevelPercent] = useState(0.0);
  const [waterVolumeLiters, setWaterVolumeLiters] = useState(0.0);
  const [distanceCm, setDistanceCm] = useState(0.0);
  const [tankCapacityLiters, setTankCapacityLiters] = useState(500);

  const [realtimeHistory, setRealtimeHistory] = useState([
    { time: '00:00:00', flow: 0.0, leakRisk: 0 },
    { time: '00:00:05', flow: 0.0, leakRisk: 0 },
    { time: '00:00:10', flow: 0.0, leakRisk: 0 },
    { time: '00:00:15', flow: 0.0, leakRisk: 0 },
    { time: '00:00:20', flow: 0.0, leakRisk: 0 }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      type: 'info',
      title: 'Ultrasonic Sensor Ready',
      message: 'Awaiting HC-SR04 telemetry stream (ws://localhost:3001).',
      timestamp: 'Just now',
      read: false
    }
  ]);

  // Handle Scenario manual presets (NO random ticker)
  useEffect(() => {
    let baseFlow = 0.0;
    let anomalyObj = null;

    switch (scenario) {
      case 'SHOWER':
        baseFlow = 11.5;
        break;
      case 'MICRO_LEAK':
        baseFlow = 1.8;
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
        break;
      case 'ECO':
        baseFlow = 1.2;
        break;
      case 'NORMAL':
      default:
        baseFlow = 0.0;
        anomalyObj = null;
        break;
    }

    if (valveState !== 'OPEN') {
      baseFlow = 0.0;
    }

    setFlowRate(baseFlow);
    setDetectedAnomaly(anomalyObj);
  }, [scenario, valveState]);

  // WebSocket listener: ONLY update when real ESP32 telemetry payloads arrive
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
            const rawText = event.data ? event.data.toString().trim() : '';
            if (!rawText) return;

            setLastHeartbeat(new Date());

            let parsedLvl = null;
            let parsedVol = null;
            let parsedDist = null;
            let parsedFlow = null;

            // 1. Try JSON parsing
            if (rawText.startsWith('{') && rawText.endsWith('}')) {
              try {
                const data = JSON.parse(rawText);
                if (data.status === 'ERROR' || data.error) return;

                if (data.water_level_percent !== undefined) parsedLvl = Number(data.water_level_percent);
                else if (data.level_percent !== undefined) parsedLvl = Number(data.level_percent);
                else if (data.level !== undefined) parsedLvl = Number(data.level);
                else if (data.lvl !== undefined) parsedLvl = Number(data.lvl);

                if (data.water_volume_liters !== undefined) parsedVol = Number(data.water_volume_liters);
                else if (data.volume_liters !== undefined) parsedVol = Number(data.volume_liters);
                else if (data.volume !== undefined) parsedVol = Number(data.volume);
                else if (data.vol !== undefined) parsedVol = Number(data.vol);
                else if (data.water_volume_ml !== undefined) parsedVol = Number(data.water_volume_ml) / 1000;

                if (data.distance_cm !== undefined) parsedDist = Number(data.distance_cm);
                else if (data.distance !== undefined) parsedDist = Number(data.distance);
                else if (data.dist !== undefined) parsedDist = Number(data.dist);

                if (data.flow_rate !== undefined) parsedFlow = Number(data.flow_rate);
                else if (data.flowRate !== undefined) parsedFlow = Number(data.flowRate);
                else if (data.flow !== undefined) parsedFlow = Number(data.flow);
              } catch (err) {}
            }

            // 2. Try Regex parsing for any JSON fragments or LCD text strings
            if (parsedLvl === null) {
              const match = rawText.match(/"?water_level_percent"?\s*:\s*([\d.]+)/i) ||
                            rawText.match(/"?level_percent"?\s*:\s*([\d.]+)/i) ||
                            rawText.match(/Lvl:\s*([\d.]+)/i) || 
                            rawText.match(/Level:\s*([\d.]+)/i);
              if (match) parsedLvl = parseFloat(match[1]);
            }
            if (parsedVol === null) {
              const match = rawText.match(/"?water_volume_liters"?\s*:\s*([\d.]+)/i) ||
                            rawText.match(/"?volume_liters"?\s*:\s*([\d.]+)/i) ||
                            rawText.match(/Vol:\s*([\d.]+)/i) || 
                            rawText.match(/Volume:\s*([\d.]+)/i);
              if (match) parsedVol = parseFloat(match[1]);
            }
            if (parsedDist === null) {
              const match = rawText.match(/"?distance_cm"?\s*:\s*([\d.]+)/i) ||
                            rawText.match(/"?distance"?\s*:\s*([\d.]+)/i) ||
                            rawText.match(/Dist:\s*([\d.]+)/i) || 
                            rawText.match(/Distance:\s*([\d.]+)/i);
              if (match) parsedDist = parseFloat(match[1]);
            }
            if (parsedFlow === null) {
              const match = rawText.match(/"?flow_rate"?\s*:\s*([\d.]+)/i) ||
                            rawText.match(/"?flow"?\s*:\s*([\d.]+)/i) ||
                            rawText.match(/Flow:\s*([\d.]+)/i);
              if (match) parsedFlow = parseFloat(match[1]);
            }

            // 1. Water Level Percentage (%)
            let levelPct = 0.0;
            if (parsedLvl !== null && !isNaN(parsedLvl) && parsedLvl > 0) {
              levelPct = Number(parsedLvl.toFixed(1));
            } else if (parsedDist !== null && !isNaN(parsedDist) && parsedDist > 0) {
              const maxSensorDist = 30.0;
              const fillHeight = Math.max(0, maxSensorDist - parsedDist);
              levelPct = Number(Math.min(100, Math.max(0, (fillHeight / maxSensorDist) * 100)).toFixed(1));
            } else if (parsedVol !== null && !isNaN(parsedVol) && parsedVol > 0) {
              const cap = tankCapacityLiters <= 5 ? tankCapacityLiters : 1.0;
              levelPct = Number(Math.min(100, (parsedVol / cap) * 100).toFixed(1));
            }

            setWaterLevelPercent(levelPct);

            // 2. Water Volume (Liters)
            let volumeLiters = 0.0;
            if (parsedVol !== null && !isNaN(parsedVol) && parsedVol > 0) {
              volumeLiters = Number(parsedVol.toFixed(2));
            } else if (levelPct > 0) {
              volumeLiters = Number(((levelPct / 100) * tankCapacityLiters).toFixed(2));
            }

            setWaterVolumeLiters(volumeLiters);
            setTodayUsage(volumeLiters);

            if (parsedDist !== null && !isNaN(parsedDist)) {
              setDistanceCm(Number(parsedDist.toFixed(1)));
            }

            if (parsedFlow !== null && !isNaN(parsedFlow)) {
              setFlowRate(Number(parsedFlow.toFixed(1)));
            } else if (levelPct > 0) {
              setFlowRate(Number((levelPct * 0.15).toFixed(1)));
            }

            // Update real-time flow graph history point
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setRealtimeHistory(prev => [
              ...prev.slice(1),
              {
                time: timeStr,
                flow: parsedFlow !== null ? Number(parsedFlow.toFixed(1)) : 0,
                leakRisk: (parsedLvl !== null && parsedLvl >= 85) ? 95 : 5
              }
            ]);

            // Check overflow alerts
            if ((parsedLvl !== null && parsedLvl >= 85) || (parsedVol !== null && parsedVol >= 425)) {
              setDetectedAnomaly({
                severity: 'CRITICAL',
                zone: 'Water Storage Tank (Ultrasonic Node)',
                type: 'Critical Level Overfill Alert',
                estimatedLoss: `${parsedLvl ? parsedLvl.toFixed(1) : '85+'}% Tank Level`,
                confidence: 99.8,
                advice: 'Storage tank at capacity limit. Please check input valve.'
              });
            } else if (scenario === 'NORMAL') {
              setDetectedAnomaly(null);
            }

          } catch (err) {
            // Ignore malformed packets
          }
        };

        ws.onclose = () => {
          reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onerror = () => {};
      } catch (e) {
        reconnectTimer = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [tankCapacityLiters, scenario]);

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

  // Dynamic AI Computed Parameters derived from real HC-SR04 ultrasonic sensor stream
  const aiMetrics = React.useMemo(() => {
    let tankEta = 'Tank Level Static';
    let etaType = 'NEUTRAL'; // 'DEPLETION', 'OVERFLOW', 'NEUTRAL'
    
    if (flowRate > 0.3) {
      const remainingLiters = waterVolumeLiters;
      const minsLeft = Math.round((remainingLiters / (flowRate / 60)));
      if (minsLeft > 0 && minsLeft < 1440) {
        const hrs = Math.floor(minsLeft / 60);
        const mins = minsLeft % 60;
        tankEta = hrs > 0 ? `${hrs}h ${mins}m to empty` : `${mins}m to empty`;
        etaType = 'DEPLETION';
      } else {
        tankEta = '>24h remaining';
        etaType = 'DEPLETION';
      }
    } else if (waterLevelPercent >= 85) {
      tankEta = 'Capacity High (85%+)';
      etaType = 'OVERFLOW';
    } else {
      tankEta = 'Level Static (No active loss)';
      etaType = 'NEUTRAL';
    }

    const leakProbability = flowRate > 0 && flowRate < 2.5 ? 45 : (waterLevelPercent > 90 ? 85 : 4);
    const refillWindow = waterLevelPercent < 30 ? 'Immediate Refill Advised' : waterLevelPercent < 60 ? 'Refill Window: 08:00 AM' : 'Refill Deferred (Sufficient)';
    const sensorHealth = distanceCm > 1 && distanceCm < 350 ? 99.4 : 82.0;
    const hourlyVelocity = (flowRate * 60).toFixed(1);

    return {
      tankEta,
      etaType,
      leakProbability,
      refillWindow,
      sensorHealth,
      hourlyVelocity
    };
  }, [flowRate, waterVolumeLiters, waterLevelPercent, distanceCm]);

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
      flowRateMlSec: Number((flowRate * (1000 / 60)).toFixed(1)),
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
      aiMetrics,
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

