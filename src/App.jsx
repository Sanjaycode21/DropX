import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WaterProvider } from './context/WaterContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ScenarioBar } from './components/layout/ScenarioBar';

// Views
import { Login } from './components/views/Login';
import { Dashboard } from './components/views/Dashboard';
import { WaterUsage } from './components/views/WaterUsage';
import { LeakDetection } from './components/views/LeakDetection';
import { Prediction } from './components/views/Prediction';
import { CostEstimation } from './components/views/CostEstimation';
import { Recommendations } from './components/views/Recommendations';
import { Comparison } from './components/views/Comparison';
import { Reports } from './components/views/Reports';
import { Notifications } from './components/views/Notifications';
import { Settings } from './components/views/Settings';

const MainLayout = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) {
    return <Login />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'usage':
        return <WaterUsage />;
      case 'leaks':
        return <LeakDetection />;
      case 'prediction':
        return <Prediction />;
      case 'costs':
        return <CostEstimation />;
      case 'recommendations':
        return <Recommendations />;
      case 'comparison':
        return <Comparison />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onToggleMobileMenu={() => setMobileOpen(prev => !prev)} 
      />

      {/* Interactive Hackathon Scenario Simulation Bar */}
      <ScenarioBar />

      {/* Main App Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen} 
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>

      </div>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WaterProvider>
        <MainLayout />
      </WaterProvider>
    </AuthProvider>
  );
}
