import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Droplet, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  X
} from 'lucide-react';

export const Login = () => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password, rememberMe);
      if (!res.success) {
        setError(res.error || 'Invalid credentials.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickDemo = (role) => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemo(role);
    }, 300);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/40">
      
      {/* Background ambient water glow */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        
        {/* Main Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl border border-slate-200/90 bg-white/90 backdrop-blur-2xl">
          
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 mb-4 ring-2 ring-white/60 animate-wave">
              <Droplet className="w-9 h-9 fill-white stroke-white" />
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center justify-center gap-2">
              DROP <span className="text-cyan-600">X</span>
            </h1>
            <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-cyan-700">
              "Every Drop Counts. Every Drop Matters."
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Smart Water Telemetry, Leak Detection & Conservation Platform
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@dropx.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-cyan-700 font-semibold hover:text-cyan-800 transition hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 bg-slate-50 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-xs text-slate-700 font-semibold">Remember Me</span>
              </label>

              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                TLS 256-bit Encrypted
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Authenticating Sensor Gateway...</span>
              ) : (
                <>
                  <span>Sign In to DROP X</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Quick Logins for Hackathon Evaluators */}
          <div className="mt-6 pt-5 border-t border-slate-200/80">
            <p className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              One-Click Demo Evaluator Access
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* User Demo */}
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="p-2.5 rounded-xl bg-cyan-50/50 border border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50 transition text-left group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-800">
                    USER DEMO
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-100 border border-cyan-300 text-cyan-800 font-bold">
                    Citizen
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-600 font-mono font-medium">user@dropx.com</p>
                <p className="text-[10px] text-slate-500 font-semibold">Pass: user123</p>
              </button>

              {/* Admin Demo */}
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition text-left group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800">
                    ADMIN DEMO
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 border border-blue-300 text-blue-800 font-bold">
                    Supervisor
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-600 font-mono font-medium">admin@dropx.com</p>
                <p className="text-[10px] text-slate-500 font-semibold">Pass: admin123</p>
              </button>

            </div>
          </div>

          {/* Footer note */}
          <div className="mt-5 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              IoT Telemetry Engine • Compatible with ESP32 & HC-SR04 Sensors
            </p>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 text-slate-800 shadow-2xl">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Reset Sensor Key</h3>
            
            {forgotSubmitted ? (
              <div className="space-y-3 py-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                  Password reset link has been dispatched to <strong>{forgotEmail}</strong>. (Demo mode: Use <code>user123</code> or <code>admin123</code> to log in).
                </div>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                setForgotSubmitted(true);
              }} className="space-y-4">
                <p className="text-xs text-slate-500">
                  Enter your registered email address to receive password reset telemetry instructions.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@dropx.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
