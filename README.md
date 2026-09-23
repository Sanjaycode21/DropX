# DROP X - Smart Water Monitoring, Leak Detection & Conservation Platform
> *"Every Drop Counts. Every Drop Matters."*

DROP X is an intelligent IoT web application prototype designed for real-time water flow telemetry, anomaly and leak detection, predictive consumption forecasting, tiered municipal cost estimation, and automated valve shutoff.

---

## 🚀 How to Run this Project

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or newer).

### Step 1: Install Dependencies
Open a terminal in this project directory and run:
```bash
npm install
```

### Step 2: Start Local Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🔑 Demo Login Credentials

You can click the **One-Click Demo Evaluator** buttons on the login screen or enter:

### 1. Citizen / User Account
- **Email:** `user@dropx.com`
- **Password:** `user123`
- **Role:** Resident / Household Smart Node (*Villa #42, Cyan Valley Heights*)

### 2. Administrator Account
- **Email:** `admin@dropx.com`
- **Password:** `admin123`
- **Role:** Grid Supervisory Control & District Water Authority

---

## 🎛️ Hackathon Demo Simulator Controller
Once logged in, use the **top simulation bar** to trigger real-time IoT events:
- **Normal Flow**: Baseline 2.8 L/min, stable 55 PSI.
- **Morning Shower**: Active high use (11.5 L/min).
- **Silent Micro-Leak**: 1.8 L/min toilet flapper leak (triggers warning).
- **Pipe Burst Alert**: 45 L/min catastrophic rupture with pressure collapse to 21 PSI (triggers critical alarm & auto-shutoff prompt).
- **Lawn Sprinkler**: 22 L/min irrigation mode.
- **Eco Saver Mode**: 1.2 L/min aerated fixtures.
- **Emergency Main Valve Switch**: Actuate motorized ball valve (`OPEN`, `CLOSED`, `AUTO_LOCK`).

---

## 🛠️ Tech Stack
- **React.js 19** + **Vite**
- **Tailwind CSS**
- **Recharts** (Real-time telemetry, diurnal bars, and anomaly curves)
- **Lucide React** (Icons & Indian Rupee ₹ symbols)
- **ESP32 Firmware Blueprint** (Ready-to-flash C++ code in Settings tab)
