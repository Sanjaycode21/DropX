import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWater } from '../../context/WaterContext';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Copy, 
  Check, 
  Sliders, 
  Home, 
  Code2, 
  Terminal,
  CheckCircle2
} from 'lucide-react';

export const Settings = () => {
  const { currentUser } = useAuth();
  const { dailyBudget } = useWater();

  const [activeSection, setActiveSection] = useState('hardware'); // 'hardware' | 'thresholds' | 'profile'
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [occupants, setOccupants] = useState(4);
  const [maxContinuousFlow, setMaxContinuousFlow] = useState(30);
  const [tankHeightCm, setTankHeightCm] = useState(100);
  const [mqttBroker, setMqttBroker] = useState('mqtt://broker.hivemq.com:1883');
  const [mqttTopic, setMqttTopic] = useState('dropx/nodes/villa42/telemetry');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const esp32ArduinoCode = `/*
 * ====================================================================
 * DROP X - Intelligent Water Flow & Ultrasonic Distance Firmware
 * Firmware for ESP32 DevKit v1 + HC-SR04 Ultrasonic Sensor + Buzzer
 * ====================================================================
 */

#include <ArduinoJson.h>

const int TRIG_PIN = 5;
const int ECHO_PIN = 18;
const int BUZZER_PIN = 19;

const float TANK_FULL_DISTANCE_CM = 5.0;
const float TANK_EMPTY_DISTANCE_CM = 30.0;
unsigned long lastTime = 0;

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "BUZZER_ON") {
      digitalWrite(BUZZER_PIN, HIGH);
    } else if (command == "BUZZER_OFF") {
      digitalWrite(BUZZER_PIN, LOW);
    }
  }

  if (millis() - lastTime >= 1000) {
    lastTime = millis();
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH, 30000);
    float distanceCm = (duration * 0.0343) / 2.0;

    if (distanceCm <= 0 || distanceCm > 400) distanceCm = TANK_EMPTY_DISTANCE_CM;

    float fillPercentage = ((TANK_EMPTY_DISTANCE_CM - distanceCm) / (TANK_EMPTY_DISTANCE_CM - TANK_FULL_DISTANCE_CM)) * 100.0;
    fillPercentage = constrain(fillPercentage, 0.0, 100.0);

    StaticJsonDocument<256> doc;
    doc["distance_cm"] = distanceCm;
    doc["water_level_percent"] = fillPercentage;
    doc["water_volume_liters"] = (fillPercentage * 0.5);
    doc["status"] = (fillPercentage >= 85.0) ? "CRITICAL" : "NORMAL";

    serializeJson(doc, Serial);
    Serial.println();
  }
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(esp32ArduinoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-600" />
          Settings & ESP32 Hardware Integration
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure household telemetry thresholds, MQTT gateways, and view ready-to-flash ESP32 C++ firmware.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Configuration saved successfully. Local parameters updated.</span>
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs">
        <button
          onClick={() => setActiveSection('hardware')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition ${
            activeSection === 'hardware' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>ESP32 Hardware & Firmware</span>
        </button>
        <button
          onClick={() => setActiveSection('thresholds')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition ${
            activeSection === 'thresholds' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Alert Thresholds</span>
        </button>
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition ${
            activeSection === 'profile' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Property & Occupancy</span>
        </button>
      </div>

      {/* SECTION 1: HARDWARE & ESP32 FIRMWARE INTEGRATION */}
      {activeSection === 'hardware' && (
        <div className="space-y-6">
          
          {/* Architecture Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-xs font-bold text-cyan-700 uppercase font-mono">1. Sensing Layer</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">HC-SR04 Ultrasonic Distance</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ultrasonic transducer measuring water height in reservoir tank (Trig: GPIO 5, Echo: GPIO 18).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-xs font-bold text-blue-700 uppercase font-mono">2. Processing Gateway</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">ESP32 Dual-Core SoC</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Computes tank level percent, integrates rate of flow, and broadcasts JSON packet over USB Serial / WebSocket.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-xs font-bold text-emerald-700 uppercase font-mono">3. Alarm Layer</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Piezo Buzzer & WebSocket</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Physical piezo buzzer on GPIO 19 triggers acoustic warning on overflow or sudden leak detection.
              </p>
            </div>

          </div>

          {/* ESP32 Arduino C++ Code Box */}
          <div className="glass-panel rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-bold text-slate-900 font-mono">
                  drop_x_esp32_firmware.ino (Arduino / PlatformIO)
                </span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-2xs"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-900 overflow-x-auto max-h-96">
              <pre className="text-xs font-mono text-cyan-300 leading-relaxed">
                {esp32ArduinoCode}
              </pre>
            </div>
          </div>

          {/* MQTT Configuration */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Terminal className="w-4 h-4 text-cyan-600" />
              MQTT Telemetry Broker Configuration
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Connect external hardware telemetry to the DROP X ingestion pipeline.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">MQTT Broker Host & Port</label>
                <input
                  type="text"
                  value={mqttBroker}
                  onChange={(e) => setMqttBroker(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Telemetry Ingestion Topic</label>
                <input
                  type="text"
                  value={mqttTopic}
                  onChange={(e) => setMqttTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: ALERT THRESHOLDS */}
      {activeSection === 'thresholds' && (
        <form onSubmit={handleSaveSettings} className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-600" />
            Configurable Anomaly Triggers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Max Continuous Flow Duration (Minutes)
              </label>
              <p className="text-slate-500 mb-2">Triggers micro-leak alarm if flow does not drop to zero.</p>
              <input
                type="number"
                min="10"
                max="120"
                value={maxContinuousFlow}
                onChange={(e) => setMaxContinuousFlow(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tank Max Height Calibration (cm)
              </label>
              <p className="text-slate-500 mb-2">Distance from sensor to tank bottom when empty.</p>
              <input
                type="number"
                min="20"
                max="300"
                value={tankHeightCm}
                onChange={(e) => setTankHeightCm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition"
          >
            Save Threshold Limits
          </button>
        </form>
      )}

      {/* SECTION 3: PROPERTY & OCCUPANCY */}
      {activeSection === 'profile' && (
        <form onSubmit={handleSaveSettings} className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Home className="w-4 h-4 text-cyan-600" />
            Household & Node Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Property Name / Address</label>
              <input
                type="text"
                defaultValue={currentUser?.property}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Number of Household Occupants</label>
              <input
                type="number"
                min="1"
                max="12"
                value={occupants}
                onChange={(e) => setOccupants(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned IoT Gateway Node</label>
              <input
                type="text"
                disabled
                value={currentUser?.meterId}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition"
          >
            Update Household Profile
          </button>
        </form>
      )}

    </div>
  );
};
