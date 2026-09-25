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

async function findESP32Port() {
  const ports = await SerialPort.list();
  console.log('🔍 Scanning available COM ports...');
  ports.forEach(p => {
    console.log(`   📌 Found: ${p.path} | ${p.manufacturer || 'Generic'} | ${p.pnpId || ''}`);
  });

  // Prefer environment variable or COM27, or fallback to first available COM port
  const targetPath = process.env.COM_PORT || 'COM27';
  const match = ports.find(p => p.path.toUpperCase() === targetPath.toUpperCase()) || ports[0];
  
  return match ? match.path : targetPath;
}

async function initSerial() {
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
      console.log('📡 ESP32 Data:', data);
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(data);
        }
      });
    });

    currentSerialPort.on('open', () => {
      console.log(`✅ Successfully connected to ESP32 on ${portPath}`);
    });

    currentSerialPort.on('error', (err) => {
      console.error(`❌ Serial Error on ${portPath}:`, err.message);
      console.log('💡 Tip: Make sure your ESP32 is plugged in via USB and no other app (like Arduino Serial Monitor) is holding the COM port open.');
    });

  } catch (err) {
    console.error('❌ Failed to open serial port:', err.message);
  }
}

// Handle WebSocket client connections (React Frontend)
wss.on('connection', (ws) => {
  console.log('💻 React Dashboard WebSocket Client Connected');
  
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

