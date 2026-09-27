import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import cors from 'cors';

const app = express();
app.use(cors());
const server = createServer(app);
const wss = new WebSocketServer({ server });

let currentSerialPort = null;
let lastTelemetryPayload = null;
let reconnectTimer = null;

let jsonBuffer = '';

async function findESP32Port() {
  const ports = await SerialPort.list();
  console.log('🔍 Scanning available COM ports...');
  ports.forEach(p => {
    console.log(`   📌 Found: ${p.path} | ${p.manufacturer || 'Generic'} | ${p.pnpId || ''}`);
  });

  if (process.env.COM_PORT) {
    return process.env.COM_PORT;
  }

  // Find USB UART Bridge (Silicon Labs, FTDI, CH340, Arduino, ESP32)
  const usbBridge = ports.find(p => 
    (p.manufacturer && (p.manufacturer.includes('Silicon Labs') || p.manufacturer.includes('FTDI') || p.manufacturer.includes('CH340') || p.manufacturer.includes('QinHeng') || p.manufacturer.includes('Expressif'))) ||
    (p.pnpId && (p.pnpId.includes('10C4') || p.pnpId.includes('1A86') || p.pnpId.includes('0403'))) ||
    p.path.toUpperCase() === 'COM27'
  );

  return usbBridge ? usbBridge.path : (ports[0] ? ports[0].path : 'COM27');
}

async function initSerial() {
  if (currentSerialPort && currentSerialPort.isOpen) return;

  const portPath = await findESP32Port();
  console.log(`🔌 Attempting connection to ${portPath} @ 115200 baud...`);

  try {
    currentSerialPort = new SerialPort({ 
      path: portPath, 
      baudRate: 115200,
      autoOpen: true
    });

    const parser = currentSerialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    parser.on('data', (data) => {
      const chunk = data.toString().trim();
      if (!chunk) return;

      jsonBuffer += ' ' + chunk;

      // Try to extract complete JSON object
      const startIdx = jsonBuffer.indexOf('{');
      const endIdx = jsonBuffer.lastIndexOf('}');

      if (startIdx !== -1 && endIdx > startIdx) {
        const potentialJson = jsonBuffer.substring(startIdx, endIdx + 1).trim();
        try {
          JSON.parse(potentialJson); // Validate full JSON
          console.log('📡 ESP32 Telemetry:', potentialJson);
          lastTelemetryPayload = potentialJson;

          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(potentialJson);
            }
          });

          jsonBuffer = jsonBuffer.substring(endIdx + 1);
          return;
        } catch (e) {
          // Incomplete JSON, wait for next serial chunk
        }
      }

      // If text format (e.g. Lvl: 0.0% Vol: 0.00L)
      if (/Lvl|Level|Vol|Volume|Dist|Distance|Flow/i.test(chunk)) {
        console.log('📡 ESP32 Text Data:', chunk);
        lastTelemetryPayload = chunk;
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(chunk);
          }
        });
        jsonBuffer = '';
      }

      if (jsonBuffer.length > 2048) jsonBuffer = '';
    });

    currentSerialPort.on('open', () => {
      console.log(`✅ Successfully connected to ESP32 on ${portPath}`);
      if (reconnectTimer) clearInterval(reconnectTimer);
    });

    currentSerialPort.on('close', () => {
      console.log(`⚠️ Serial port ${portPath} closed. Will retry connecting...`);
      scheduleReconnect();
    });

    currentSerialPort.on('error', (err) => {
      console.error(`❌ Serial Error on ${portPath}:`, err.message);
      scheduleReconnect();
    });

  } catch (err) {
    console.error('❌ Failed to open serial port:', err.message);
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (!reconnectTimer) {
    reconnectTimer = setInterval(() => {
      console.log('🔄 Retrying ESP32 serial port connection...');
      initSerial();
    }, 4000);
  }
}

// Handle WebSocket client connections (React Frontend)
wss.on('connection', (ws) => {
  console.log('💻 React Dashboard WebSocket Client Connected');
  
  if (lastTelemetryPayload) {
    ws.send(lastTelemetryPayload);
  }

  ws.on('message', (message) => {
    const cmd = message.toString();
    console.log('🎛️ Command from Dashboard -> ESP32:', cmd);
    if (currentSerialPort && currentSerialPort.isOpen) {
      currentSerialPort.write(cmd + '\n');
    }
  });
});

server.listen(3001, () => {
  console.log('💧 DROP X Backend Server running on http://localhost:3001');
  initSerial();
});

