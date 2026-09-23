import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Droplet, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Waves,
  Sparkles,
  HelpCircle,
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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      
      {/* Background ambient water glow & grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Decorative animated droplet ripples */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        
        {/* Main Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl border border-cyan-500/20 backdrop-blur-2xl">
          
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 text-white shadow-xl shadow-cyan-500/30 mb-4 ring-1 ring-white/20 animate-wave">
              <Droplet className="w-9 h-9 fill-white stroke-white" />
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              DROP <span className="text-cyan-400">X</span>
            </h1>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
              "Every Drop Counts. Every Drop Matters."
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Smart Water Monitoring, Leak Detection & Conservation Platform
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@dropx.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
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
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-950"
                />
                <span className="text-xs text-slate-300">Remember Me</span>
              </label>

              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                TLS 256-bit Encrypted
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
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
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              One-Click Demo Evaluator Access
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* User Demo */}
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850 transition text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                    USER DEMO
                  </span>
                  <span className="text-[10px] px-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                    Citizen
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 font-mono">user@dropx.com</p>
                <p className="text-[10px] text-slate-500">Pass: user123</p>
              </button>

              {/* Admin Demo */}
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-850 transition text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300">
                    ADMIN DEMO
                  </span>
                  <span className="text-[10px] px-1 rounded bg-blue-950 border border-blue-800 text-blue-300">
                    Supervisor
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 font-mono">admin@dropx.com</p>
                <p className="text-[10px] text-slate-500">Pass: admin123</p>
              </button>

            </div>
          </div>

          {/* Footer note */}
          <div className="mt-5 text-center">
            <p className="text-[11px] text-slate-500">
              IoT Telemetry Engine • Compatible with ESP32 & YF-S201 Sensors
            </p>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 text-slate-200 shadow-2xl">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2">Reset Sensor Key</h3>
            
            {forgotSubmitted ? (
              <div className="space-y-3 py-2">
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs">
                  Password reset link has been dispatched to <strong>{forgotEmail}</strong>. (Demo mode: Use <code>user123</code> or <code>admin123</code> to log in).
                </div>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                setForgotSubmitted(true);
              }} className="space-y-4">
                <p className="text-xs text-slate-400">
                  Enter your registered email address to receive password reset telemetry instructions.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@dropx.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
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
