import React, { useState, useEffect } from 'react';
import { verifyAdminCredentials, isAdminSessionValid, setAdminSession } from '@/lib/adminAuth';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';

export default function AdminGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [step, setStep] = useState(1); // 1=who are you, 2=password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (isAdminSessionValid()) setAuthed(true);
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setError('');
    setStep(2);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;
    setChecking(true);
    setError('');

    const ok = await verifyAdminCredentials(username, password);

    if (ok) {
      setAdminSession();
      setAuthed(true);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setPassword('');
      if (next >= 5) {
        setLocked(true);
        setError('Too many failed attempts. Access locked for this session.');
      } else {
        setError(`Access denied. ${5 - next} attempt${5 - next !== 1 ? 's' : ''} remaining.`);
      }
    }
    setChecking(false);
  };

  if (authed) return children;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'hsl(155 48% 6%)' }}>

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, hsl(37 40% 46%) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-amber-400/20 mb-4">
            <img src="https://media.base44.com/images/public/user_69ce8a155d877f66a5fbf561/717b6b136_IMG_0659.jpg"
              alt="Pellazgo" className="w-full h-full object-cover" />
          </div>
          <p className="font-display text-2xl text-amber-200 tracking-[0.3em]">PELLAZGO</p>
          <p className="text-[10px] font-body tracking-[0.2em] uppercase text-amber-100/25 mt-1">Restricted Access</p>
        </div>

        {/* Card */}
        <div className="border border-amber-400/10 p-8" style={{ background: 'hsl(155 48% 10%)' }}>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-4 h-4 text-amber-400/50" />
            <p className="text-xs font-body tracking-widest uppercase text-amber-100/40">
              {step === 1 ? 'Identity Verification' : 'Authentication'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleUsernameSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-body tracking-[0.2em] uppercase text-amber-100/40 block mb-2">
                  Who are you?
                </label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="off"
                  autoFocus
                  className="w-full bg-white/5 border border-amber-400/15 text-amber-100 text-sm font-body px-4 py-3 placeholder:text-amber-100/20 focus:outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>
              <button type="submit" disabled={!username.trim()}
                className="w-full py-3 text-xs font-body tracking-[0.2em] uppercase transition-all disabled:opacity-30"
                style={{ background: 'hsl(37 40% 46%)', color: 'hsl(155 48% 8%)' }}>
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-body tracking-[0.2em] uppercase text-amber-100/40">
                    Password
                  </label>
                  <button type="button" onClick={() => { setStep(1); setPassword(''); setError(''); }}
                    className="text-[10px] text-amber-100/30 hover:text-amber-300 font-body transition-colors">
                    ← Back
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    autoFocus
                    disabled={locked}
                    className="w-full bg-white/5 border border-amber-400/15 text-amber-100 text-sm font-body px-4 py-3 pr-10 placeholder:text-amber-100/20 focus:outline-none focus:border-amber-400/40 transition-colors disabled:opacity-40"
                  />
                  {!locked && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-100/30 hover:text-amber-300">
                      {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 border border-red-500/20 bg-red-500/5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400 font-body">{error}</p>
                </div>
              )}

              <button type="submit" disabled={checking || locked || !password}
                className="w-full py-3 text-xs font-body tracking-[0.2em] uppercase transition-all disabled:opacity-30"
                style={{ background: locked ? 'hsl(0 50% 30%)' : 'hsl(37 40% 46%)', color: 'hsl(155 48% 8%)' }}>
                {checking ? 'Verifying...' : locked ? 'Locked' : 'Authenticate'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[10px] text-amber-100/15 font-body mt-6 tracking-wider">
          Unauthorized access is strictly prohibited
        </p>
      </div>
    </div>
  );
}
