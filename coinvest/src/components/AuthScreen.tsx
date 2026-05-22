import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ShieldCheck, Lock, Mail, User, TrendingUp, Cpu, Globe, Users, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AuthScreen: React.FC = () => {
  const { login, register } = useDashboard();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!isLogin && !name) {
      setError('Please provide your full legal name.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (!isLogin && !agreed) {
      setError('You must accept the terms of service to open an account.');
      return;
    }

    if (isLogin) {
      login(email, name);
    } else {
      register(email, name);
    }
  };

  const handleDemoLogin = () => {
    login('demo.trader@coinvest.cc', 'Demo Pro Trader');
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background ambient orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#5A5A40]/4 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#8B8D7A]/4 blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-natural-border bg-white/45 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-accent via-gold-primary to-gold-dark flex items-center justify-center shadow-sm">
            <TrendingUp className="h-5 w-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-black tracking-tight text-natural-dark">
              coinvest
            </h1>
            <p className="text-[9px] text-gold-dark tracking-[0.15em] font-black uppercase">GOLD-STANDARD CFD & YIELDS</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gold-dark bg-gold-cream border border-gold-light px-3 py-1.5 rounded-full shadow-xs">
          <Globe className="h-3 w-3 text-gold-primary animate-pulse-subtle" />
          <span className="font-semibold text-[11px]">UK Registered Broker #103945</span>
        </div>
      </header>

      {/* Auth Main Body */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 z-10">
        {/* Marketing column */}
        <div className="flex-1 max-w-xl text-left hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold tracking-widest text-[#403212] uppercase bg-gold-light/60 px-3.5 py-1.5 rounded-full border border-gold-light shadow-xs">
              ★★★ Institutional Gold-Tier Execution
            </span>
            <h2 className="text-4xl lg:text-5xl font-serif font-black tracking-tight mt-6 mb-8 text-natural-dark leading-[1.12]">
              Trade and <span className="text-gold-primary">Invest</span> in Global Assets Instantly
            </h2>
            <p className="text-natural-text/80 text-base leading-relaxed mb-10 font-medium">
              Access hyper-secure Forex trading, high-reward Crypto yield farming, and institutional CFD margin accounts. Backed by London audit desk clearances and ultra-fast liquidity providers.
            </p>

            <div className="space-y-6">
              {[
                { icon: Cpu, title: 'Zero-Pip Spread Liquidity', desc: 'Direct prime broker connections matching trades with latency below 1ms.' },
                { icon: ShieldCheck, title: 'FCA & FSCS Standards', desc: 'Regulated operational processes ensuring asset preservation and client segregate safekeeping.' },
                { icon: Users, title: 'MirrorCopy™ Top Performers', desc: 'Follow vetted strategies from trading desk veterans with an integrated risk controller.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 h-9 w-9 rounded-xl bg-white border border-natural-border flex items-center justify-center flex-shrink-0 shadow-xs">
                    <item.icon className="h-4.5 w-4.5 text-natural-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-natural-dark text-sm">{item.title}</h3>
                    <p className="text-natural-secondary text-xs mt-0.5 leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dynamic Form column */}
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-[#E5E7D8] rounded-[32px] p-6 sm:p-8 shadow-sm relative"
          >
            {forgotMode ? (
              // Forgot Password Panel
              <div>
                <h3 className="text-xl font-serif font-black text-natural-dark mb-2">Recover Vault Access</h3>
                <p className="text-xs text-natural-secondary font-medium mb-6">
                  Enter your registered account email. A secure encryption authorization key will be issued immediately.
                </p>

                {forgotSent ? (
                  <div className="bg-natural-primary/5 border border-natural-primary/10 text-natural-text rounded-xl p-4 text-xs mb-6 text-center shadow-xs">
                    <p className="font-bold text-natural-primary mb-1">Recovery Stream Active</p>
                    <p className="text-[11px] text-natural-text font-medium">We have issued a password override link to <strong>{email}</strong>. Check your inbox or system spam filters.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setForgotSent(true); }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-natural-muted uppercase tracking-wider block">Vault Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-natural-secondary" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="primary@coinvest.cc"
                          className="w-full bg-[#F4F5F0]/50 border border-natural-border focus:border-natural-primary focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-natural-dark placeholder-natural-muted outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-natural-primary hover:bg-[#4E4E37] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-6 cursor-pointer"
                    >
                      <span>Forward Authorization Key</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                )}

                <button
                  onClick={() => { setForgotMode(false); setForgotSent(false); }}
                  className="w-full text-center mt-6 text-xs text-natural-secondary hover:text-natural-dark transition-colors font-semibold underline"
                >
                  Return to Account Authentication
                </button>
              </div>
            ) : (
              // Standard Login / Registration Form
              <div>
                {/* Switcher tabs */}
                <div className="flex bg-[#F4F5F0] p-1.5 rounded-xl border border-natural-border mb-6 font-semibold">
                  <button
                    onClick={() => { setIsLogin(true); setError(''); }}
                    className={`flex-1 text-center py-2 text-xs rounded-lg transition-all cursor-pointer font-bold ${
                      isLogin ? 'bg-natural-primary text-white shadow-sm' : 'text-natural-muted hover:text-natural-text'
                    }`}
                  >
                    MEMBER SIGN IN
                  </button>
                  <button
                    onClick={() => { setIsLogin(false); setError(''); }}
                    className={`flex-1 text-center py-2 text-xs rounded-lg transition-all cursor-pointer font-bold ${
                      !isLogin ? 'bg-natural-primary text-white shadow-sm' : 'text-natural-muted hover:text-natural-text'
                    }`}
                  >
                    OPEN VAULT ACCOUNT
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-serif font-black tracking-tight text-natural-dark mb-1">
                    {isLogin ? 'Welcome Back, Partner' : 'Secure Allocation Gate'}
                  </h3>
                  <p className="text-xs text-natural-secondary font-semibold">
                    {isLogin ? 'Sign in to monitor yields and CFD margins.' : 'Create an account to begin copy strategies.'}
                  </p>
                </div>

                {error && (
                  <div className="bg-rose-500/5 border border-rose-500/10 text-rose-700 font-bold text-xs py-2 px-3 rounded-lg mb-4 text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-natural-muted uppercase tracking-wider block">Full Legal Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-natural-secondary" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Sterling Marcus"
                          className="w-full bg-[#F4F5F0]/50 border border-natural-border focus:border-natural-primary focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-natural-dark placeholder-natural-muted outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-natural-muted uppercase tracking-wider block">Security Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-natural-secondary" />
                      <input
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-[#F4F5F0]/50 border border-natural-border focus:border-natural-primary focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-natural-dark placeholder-natural-muted outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-natural-muted uppercase tracking-wider">Vault Password</label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => setForgotMode(true)}
                          className="text-[10px] text-natural-primary hover:text-natural-dark font-extrabold transition-colors uppercase tracking-wider"
                        >
                          Forgot Gate Pass?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-natural-secondary" />
                      <input
                        type="password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F4F5F0]/50 border border-natural-border focus:border-natural-primary focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-natural-dark placeholder-natural-muted outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="flex items-start gap-2.5 mt-2">
                      <input
                        type="checkbox"
                        id="agreed"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 rounded accent-natural-primary h-3.5 w-3.5"
                      />
                      <label htmlFor="agreed" className="text-[10px] text-natural-secondary leading-normal font-semibold">
                        I confirm my legal age status and accept coinvest's <span className="text-natural-primary underline cursor-pointer hover:text-natural-dark">Segregated Fund Regulations</span> and <span className="text-natural-primary underline cursor-pointer hover:text-natural-dark">CFD Leverage Disclaimers</span>.
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-natural-primary hover:bg-[#4E4E37] text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-6 cursor-pointer"
                  >
                    <span>{isLogin ? 'ESTABLISH VAULT LOGIN' : 'PROVISION ASSET ACCOUNT'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>

                {/* Trial Sandbox Login */}
                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-natural-border"></div></div>
                  <div className="relative flex justify-center text-[10px] text-natural-muted uppercase font-bold"><span className="bg-white px-3">Quick Sandbox Demo Mode</span></div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-[#EAECE0] hover:bg-[#D1D3C4]/60 text-natural-dark font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-natural-border group cursor-pointer"
                >
                  <Cpu className="h-4 w-4 text-natural-primary group-hover:rotate-45 transition-transform" />
                  <span>LAUNCH SANDBOX SESSION (GIFT $15K)</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-natural-border bg-white/40 gap-2 z-10 text-[11px] text-natural-secondary font-semibold">
        <div>
          © 2026 COINVEST DIGITAL LTD (Registration #103945). Standard registered in England and Wales.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-natural-primary transition-colors">Risk Warnings</a>
          <a href="#" className="hover:text-natural-primary transition-colors">CFD Specifications</a>
          <a href="#" className="hover:text-natural-primary transition-colors">Privacy Shield</a>
        </div>
      </footer>
    </div>
  );
};
