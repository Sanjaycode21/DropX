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

const port = new SerialPort({ 
  path: 'COM27', 
  baudRate: 115200 
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
  console.log('ESP32:', data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
});

port.on('open', () => console.log('✅ Connected to COM27'));
port.on('error', (err) => console.error('❌ Serial Error:', err.message));

server.listen(3001, () => {
  console.log('💧 DROP X Backend running on port 3001');
});
