import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  HardHat, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import rmcLogo from '../assets/logo-rmc.png';
import { loginUser } from '../api/rmcApi';

export function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      if (data.success) {
        localStorage.setItem('rmc_auth_token', data.token);
        localStorage.setItem('rmc_user', JSON.stringify(data.user));
        if (onLoginSuccess) {
          onLoginSuccess(data.user, data.token);
        }
      } else {
        setError(data.error || 'Invalid credentials. Please verify your login.');
      }
    } catch (err) {
      setError('Unable to connect to RMC server. Check if backend is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans p-4">
      {/* Dynamic Background Architectural Mesh & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/80 z-10">
        {/* Top Logo and Branding */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-800/80 border border-slate-700/60 shadow-inner">
            <img 
              src={rmcLogo} 
              alt="RMC Group" 
              className="h-12 w-auto object-contain drop-shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }} 
            />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              RMC GROUP
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Enterprise
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Civil Estimation, Structural BOQ & Commercial Quotation Engine
            </p>
          </div>
        </div>

        {/* Demo Credentials Pill */}
        <div 
          onClick={handleQuickFill}
          className="mb-6 p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-between text-xs cursor-pointer hover:bg-blue-900/30 transition-all group"
          title="Click to fill credentials"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="text-blue-300 font-semibold block">PostgreSQL Credentials</span>
              <span className="text-[11px] text-slate-400">ID: <b className="text-slate-200">admin</b> | Pass: <b className="text-slate-200">admin123</b></span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-300 uppercase tracking-wide">
            Auto Fill ⚡
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              Username / Admin ID
            </label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white font-medium placeholder-slate-500 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white font-medium placeholder-slate-500 text-sm outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember / Security note */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" 
              />
              Remember session
            </label>
            <span className="text-slate-500 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              PostgreSQL Secured
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                Sign In to Estimation Suite
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Authorized Personnel Only • RMC Group Civil Engineering Solutions
          </p>
        </div>
      </div>
    </div>
  );
}

