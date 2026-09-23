import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWater } from '../../context/WaterContext';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Wifi, 
  Copy, 
  Check, 
  Sliders, 
  User, 
  Home, 
  BellRing, 
  Code2, 
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Power
} from 'lucide-react';

export const Settings = () => {
  const { currentUser } = useAuth();
  const { dailyBudget, setDailyBudget } = useWater();

  const [activeSection, setActiveSection] = useState('hardware'); // 'hardware' | 'thresholds' | 'profile'
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [occupants, setOccupants] = useState(4);
  const [maxContinuousFlow, setMaxContinuousFlow] = useState(30);
  const [pressureCutoff, setPressureCutoff] = useState(25);
  const [mqttBroker, setMqttBroker] = useState('mqtt://broker.hivemq.com:1883');
  const [mqttTopic, setMqttTopic] = useState('dropx/nodes/villa42/telemetry');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const esp32ArduinoCode = `/*
 * ====================================================================
 * DROP X - Intelligent Water Flow & Automated Solenoid Controller
 * Firmware for ESP32 DevKit v1 + YF-S201 Hall Flow Sensor + 12V Relay
 * ====================================================================
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* telemetry_topic = "dropx/nodes/villa42/telemetry";
const char* valve_control_topic = "dropx/nodes/villa42/valve";

// Hardware Pin Configuration
const int SENSOR_PIN = 21;      // YF-S201 Yellow Signal Wire (Interrupt)
const int RELAY_PIN = 4;        // 12V Motorized Solenoid Valve Relay
const int PRESSURE_PIN = 34;    // Analog Piezoresistive Pressure Sensor (0-5V)

volatile int pulseCount = 0;
float flowRate = 0.0;           // Liters per minute
float totalLiters = 0.0;
unsigned long oldTime = 0;

WiFiClient espClient;
PubSubClient client(espClient);

void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

void setup() {
  Serial.begin(115200);
  pinMode(SENSOR_PIN, INPUT_PULLUP);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Valve default OPEN (Active Low Relay)

  attachInterrupt(digitalPinToInterrupt(SENSOR_PIN), pulseCounter, FALLING);

  // WiFi & MQTT Init
  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(valveCallback);
}

void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // Read sensor every 1 second
  if ((millis() - oldTime) > 1000) {
    detachInterrupt(SENSOR_PIN);
    
    // YF-S201 Calibration Factor: 7.5 pulses per second = 1 L/min
    flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / 7.5;
    oldTime = millis();
    totalLiters += (flowRate / 60.0);
    pulseCount = 0;
    
    attachInterrupt(digitalPinToInterrupt(SENSOR_PIN), pulseCounter, FALLING);

    // Read Pressure (Analog ADC 0-4095 to 0-100 PSI)
    int rawAdc = analogRead(PRESSURE_PIN);
    float pressurePsi = (rawAdc / 4095.0) * 100.0;

    // Publish JSON Telemetry
    StaticJsonDocument<256> doc;
    doc["nodeId"] = "ESP32-WTR-8842";
    doc["flowRate"] = flowRate;
    doc["pressure"] = pressurePsi;
    doc["totalLiters"] = totalLiters;
    doc["rssi"] = WiFi.RSSI();

    char buffer[256];
    serializeJson(doc, buffer);
    client.publish(telemetry_topic, buffer);
  }
}

void valveCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) message += (char)payload[i];
  if (message == "CLOSE") {
    digitalWrite(RELAY_PIN, LOW); // Trigger Solenoid Cutoff
  } else if (message == "OPEN") {
    digitalWrite(RELAY_PIN, HIGH);
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
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          Settings & ESP32 Hardware Integration
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure household telemetry thresholds, MQTT gateways, and view ready-to-flash ESP32 C++ firmware.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Configuration saved successfully. Local parameters updated.</span>
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveSection('hardware')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeSection === 'hardware' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>ESP32 Hardware & Firmware</span>
        </button>
        <button
          onClick={() => setActiveSection('thresholds')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeSection === 'thresholds' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Alert Thresholds</span>
        </button>
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeSection === 'profile' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
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
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase font-mono">1. Sensing Layer</span>
              <h4 className="text-sm font-bold text-white mt-1">YF-S201 Flow Sensor</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hall-effect turbine sensor outputting 7.5 Hz per 1 L/min on GPIO 21. Working pressure up to 1.75 MPa.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase font-mono">2. Processing Gateway</span>
              <h4 className="text-sm font-bold text-white mt-1">ESP32 Dual-Core SoC</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Computes pulse interrupts, samples piezoresistive pressure ADC, and publishes JSON telemetry via WiFi MQTT.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase font-mono">3. Actuation Layer</span>
              <h4 className="text-sm font-bold text-white mt-1">12V Motorized Ball Valve</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Driven by optocoupled relay on GPIO 4 for physical emergency line shutoff upon leak confirmation.
              </p>
            </div>

          </div>

          {/* ESP32 Arduino C++ Code Box */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono">
                  drop_x_esp32_firmware.ino (Arduino / PlatformIO)
                </span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950 overflow-x-auto max-h-96">
              <pre className="text-xs font-mono text-cyan-300 leading-relaxed">
                {esp32ArduinoCode}
              </pre>
            </div>
          </div>

          {/* MQTT Configuration */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Terminal className="w-4 h-4 text-cyan-400" />
              MQTT Telemetry Broker Configuration
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Connect external hardware telemetry to the DROP X ingestion pipeline.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">MQTT Broker Host & Port</label>
                <input
                  type="text"
                  value={mqttBroker}
                  onChange={(e) => setMqttBroker(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Telemetry Ingestion Topic</label>
                <input
                  type="text"
                  value={mqttTopic}
                  onChange={(e) => setMqttTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: ALERT THRESHOLDS */}
      {activeSection === 'thresholds' && (
        <form onSubmit={handleSaveSettings} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Configurable Anomaly Triggers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Max Continuous Flow Duration (Minutes)
              </label>
              <p className="text-slate-500 mb-2">Triggers micro-leak alarm if flow does not drop to zero.</p>
              <input
                type="number"
                min="10"
                max="120"
                value={maxContinuousFlow}
                onChange={(e) => setMaxContinuousFlow(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Minimum Pressure Breach Floor (PSI)
              </label>
              <p className="text-slate-500 mb-2">Sudden drop below this indicates pipe rupture.</p>
              <input
                type="number"
                min="10"
                max="40"
                value={pressureCutoff}
                onChange={(e) => setPressureCutoff(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
          >
            Save Threshold Limits
          </button>
        </form>
      )}

      {/* SECTION 3: PROPERTY & OCCUPANCY */}
      {activeSection === 'profile' && (
        <form onSubmit={handleSaveSettings} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Home className="w-4 h-4 text-cyan-400" />
            Household & Node Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Property Name / Address</label>
              <input
                type="text"
                defaultValue={currentUser?.property}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Number of Household Occupants</label>
              <input
                type="number"
                min="1"
                max="12"
                value={occupants}
                onChange={(e) => setOccupants(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Assigned IoT Gateway Node</label>
              <input
                type="text"
                disabled
                value={currentUser?.meterId}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
          >
            Update Household Profile
          </button>
        </form>
      )}

    </div>
  );
};
