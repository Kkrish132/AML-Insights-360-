import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Zap, 
  Globe, 
  KeyRound,
  ShieldAlert,
  Activity,
  Layers
} from 'lucide-react';
import { UserProfile } from '../../types';
import { soundFx } from '../../utils/audio';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState<string>('magan.s@apexbank.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [fullName, setFullName] = useState<string>('Magan S.');
  const [role, setRole] = useState<UserProfile['role']>('Senior AML Officer (L3)');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      soundFx.playAlert();
      setErrorMessage('Please fill in all authentication fields.');
      return;
    }

    soundFx.playScanTick();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      soundFx.playSuccess();

      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        name: authMode === 'SIGNUP' ? fullName : (email.includes('magan') ? 'Magan S.' : email.split('@')[0].toUpperCase()),
        email,
        role: authMode === 'SIGNUP' ? role : 'Senior AML Officer (L3)',
        badgeNumber: `BADGE-#${Math.floor(10000 + Math.random() * 90000)}`,
        department: 'Financial Crimes Intelligence Unit',
        loginMethod: 'EMAIL',
        lastLogin: new Date().toLocaleTimeString()
      };

      if (rememberMe) {
        localStorage.setItem('aegis_user_session', JSON.stringify(user));
      }
      onLoginSuccess(user);
    }, 800);
  };

  const handleGoogleAuth = () => {
    soundFx.playScanTick();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      soundFx.playSuccess();

      const user: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name: 'Magan S. (Google SSO)',
        email: 'magan.workspace@gmail.com',
        role: 'Senior AML Officer (L3)',
        badgeNumber: `GOOG-SSO-#49201`,
        department: 'Financial Crimes Intelligence Unit',
        loginMethod: 'GOOGLE',
        lastLogin: new Date().toLocaleTimeString()
      };

      if (rememberMe) {
        localStorage.setItem('aegis_user_session', JSON.stringify(user));
      }
      onLoginSuccess(user);
    }, 700);
  };

  const handleQuickDemoLogin = (demoRole: UserProfile['role'] = 'Senior AML Officer (L3)') => {
    soundFx.playScanTick();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      soundFx.playSuccess();

      const user: UserProfile = {
        id: 'usr-demo-lead',
        name: 'Magan S.',
        email: 'magan.aml@apexcommercial.com',
        role: demoRole,
        badgeNumber: 'AML-CHIEF-01',
        department: 'Surveillance & Mule Shield Division',
        loginMethod: 'DEMO',
        lastLogin: new Date().toLocaleTimeString()
      };

      localStorage.setItem('aegis_user_session', JSON.stringify(user));
      onLoginSuccess(user);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-900">
      
      {/* Main Authentication Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-4xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        
        {/* Left 5 Columns: Bank Brand & Trust Badges */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Cyber Grid Background in Hero */}
          <div className="absolute inset-0 opacity-10 pointer-events-none cyber-grid"></div>

          <div>
            {/* Bank Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-emerald-300 shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                  Apex Commercial
                </h1>
                <p className="text-xs text-emerald-300 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> AML Intelligence Portal
                </p>
              </div>
            </div>

            <div className="space-y-4 my-6">
              <h2 className="text-2xl font-extrabold text-white leading-snug">
                Bank-Grade Money Mule Detection &amp; Graph Analytics
              </h2>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-sans">
                Access real-time transaction graphs, topological network centralities, automated test harnesses, and FinCEN Form 111 filing tools.
              </p>
            </div>

            {/* Key Platform Stats Strip */}
            <div className="space-y-2.5 pt-4 border-t border-emerald-700/50 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-emerald-200">GNN Model Accuracy</span>
                <span className="font-bold text-white">99.4% F1 Score</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-emerald-200">Inference Latency</span>
                <span className="font-bold text-white">11.4 ms (Real-time)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-emerald-200">Regulatory Compliance</span>
                <span className="font-bold text-white">FinCEN 314(b) / BSA</span>
              </div>
            </div>
          </div>

          {/* Footer Security Notice */}
          <div className="pt-6 border-t border-emerald-700/50 flex items-center justify-between text-[11px] font-mono text-emerald-300/80">
            <span>FDIC Insured • Level 3 Clearance</span>
            <span className="font-bold">v4.2 PRO</span>
          </div>

        </div>

        {/* Right 7 Columns: Form Area (Login / Signup / Google SSO) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          
          <div>
            {/* Top Mode Switcher */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.playScanTick();
                    setAuthMode('LOGIN');
                    setErrorMessage('');
                  }}
                  className={`text-sm font-bold font-mono pb-1 border-b-2 transition-all ${
                    authMode === 'LOGIN' 
                      ? 'border-emerald-700 text-slate-900' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Officer Sign In
                </button>

                <span className="text-slate-300">|</span>

                <button
                  onClick={() => {
                    soundFx.playScanTick();
                    setAuthMode('SIGNUP');
                    setErrorMessage('');
                  }}
                  className={`text-sm font-bold font-mono pb-1 border-b-2 transition-all ${
                    authMode === 'SIGNUP' 
                      ? 'border-emerald-700 text-slate-900' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Authorized Personnel
              </span>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-mono text-red-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Google One-Click Sign Up / Log In */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold font-mono flex items-center justify-center gap-3 transition-all shadow-2xs"
              >
                {/* Google Multi-Color SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{authMode === 'LOGIN' ? 'Continue with Google Workspace' : 'Sign Up with Google Workspace'}</span>
              </button>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 uppercase">
                  or continue with Officer ID
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            </div>

            {/* 2. Email & Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3 font-mono text-xs mt-2">
              
              {authMode === 'SIGNUP' && (
                <>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                      Full Officer Name:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-inner"
                        placeholder="e.g. Magan Sharma"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                      Assigned Security Clearance / Role:
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-inner cursor-pointer"
                    >
                      <option value="Senior AML Officer (L3)">Senior AML Officer (L3) - Full Freeze &amp; SAR Authority</option>
                      <option value="Compliance Director">Compliance Director - Enterprise Audit</option>
                      <option value="Fintech Risk Analyst">Fintech Risk Analyst - Topology Sandbox</option>
                      <option value="Guest Investigator">Guest Investigator - Academic View</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Bank Email / Officer ID:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-inner"
                    placeholder="officer@apexcommercial.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold">
                    Security Password / PIN:
                  </label>
                  {authMode === 'LOGIN' && (
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin()}
                      className="text-[10px] text-emerald-800 hover:underline font-bold"
                    >
                      Forgot Credentials?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-inner"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-[11px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-700 accent-emerald-700"
                  />
                  <span>Remember session on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials &amp; KYC...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{authMode === 'LOGIN' ? 'Authorize & Enter Bank Portal' : 'Create Bank Officer Account'}</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Bottom Quick Demo Bypass Banner */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-[11px] font-bold text-slate-900 font-mono flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" /> Instant Demo Officer Access:
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Evaluate complete system with full administrative clearance.
                </div>
              </div>

              <button
                onClick={() => handleQuickDemoLogin()}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-[11px] font-bold transition-all shadow-2xs whitespace-nowrap self-start sm:self-auto"
              >
                ⚡ 1-Click Demo Login
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
