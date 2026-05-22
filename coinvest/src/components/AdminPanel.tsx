import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Settings, Check, X, ShieldAlert, Zap, TrendingUp, RefreshCw, Layers } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user, transactions, adminUpdateUser, adminApproveTransaction, adminRejectTransaction, triggerMarketTick } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const [balanceInput, setBalanceInput] = useState('');
  const [profitsInput, setProfitsInput] = useState('');
  const [rfEarnedInput, setRfEarnedInput] = useState('');

  if (!user) return null;

  const pendingTxs = transactions.filter(t => t.status === 'pending');

  const handleUpdateBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (balanceInput) {
      adminUpdateUser({ balance: parseFloat(balanceInput) });
      setBalanceInput('');
    }
  };

  const handleUpdateProfits = (e: React.FormEvent) => {
    e.preventDefault();
    if (profitsInput) {
      adminUpdateUser({ profits: parseFloat(profitsInput) });
      setProfitsInput('');
    }
  };

  const handleUpdateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (rfEarnedInput) {
      adminUpdateUser({ referralsEarned: parseFloat(rfEarnedInput) });
      setRfEarnedInput('');
    }
  };

  const handleInstantVerificationToggle = () => {
    const nextStatus = user.verificationStatus === 'verified' ? 'unverified' : 'verified';
    adminUpdateUser({ verificationStatus: nextStatus });
  };

  return (
    <>
      {/* Floating Gear Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-[#5A5A40] border border-natural-accent flex items-center justify-center text-white hover:bg-[#4E4E37] hover:scale-105 shadow-md transition-all duration-300 z-50 cursor-pointer group"
        title="Admin Control Center"
      >
        <Settings className="h-5.5 w-5.5 group-hover:rotate-45 transition-transform" />
        {pendingTxs.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-700 border-2 border-white text-[10px] font-black text-white flex items-center justify-center animate-bounce">
            {pendingTxs.length}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-natural-dark/30 backdrop-blur-xs" 
            onClick={() => setIsOpen(false)} 
          />

          {/* Panel content */}
          <div className="relative w-full max-w-md bg-white border-l border-natural-border h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto outline-none select-none">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-natural-border pb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-[#5A5A40]" />
                  <div>
                    <h4 className="text-sm font-serif font-bold text-natural-dark uppercase tracking-wider">Interactive Dev Console</h4>
                    <p className="text-[10px] text-natural-muted font-bold font-mono">Sandbox Operations Desk</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 px-2 hover:bg-[#F4F5F0] text-natural-secondary hover:text-natural-dark rounded-lg text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Action warnings */}
              <div className="bg-[#F4F5F0] text-[#5A5A40] rounded-xl p-3.5 border border-natural-border text-[11px] leading-relaxed select-none font-semibold">
                <span className="font-bold uppercase block mb-0.5 text-natural-dark">ADMIN OVERRIDES</span>
                These administrative tools are designed to easily mock deposit approval steps, instantly alter running ledger statistics, and trigger manual tick intervals to speed up testing CFD yields!
              </div>

              {/* Real-time Ticker trigger */}
              <div className="space-y-2">
                <h5 className="text-[10px] text-[#7D7F6E] uppercase font-bold tracking-wider">Tick Controls</h5>
                <button
                  onClick={triggerMarketTick}
                  className="w-full bg-natural-primary hover:bg-[#4E4E37] text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-natural-accent font-mono cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-4 w-4 text-white animate-spin-slow" />
                  <span>TRIGGER MANUAL TICK (+YIELDS)</span>
                </button>
              </div>

              {/* Pending Approvals */}
              <div className="space-y-3">
                <h5 className="text-[10px] text-natural-muted uppercase font-bold tracking-wider flex justify-between items-center">
                  <span>Queued Pending Transfers</span>
                  {pendingTxs.length > 0 && <span className="bg-rose-700 text-white text-[9px] px-1.5 py-0.5 rounded font-black">{pendingTxs.length} pending</span>}
                </h5>

                {pendingTxs.length === 0 ? (
                  <p className="text-[10.5px] text-natural-secondary bg-natural-bg/40 p-4 border border-natural-border text-center rounded-xl font-semibold">
                    No simulated transfers currently pending review. Trigger deposits/withdrawals from the Wallet!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingTxs.map((tx) => (
                      <div key={tx.id} className="bg-[#F4F5F0]/65 border border-natural-border p-3 rounded-2xl flex items-center justify-between gap-4 font-semibold">
                        <div className="min-w-0">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                            {tx.type}
                          </span>
                          <span className="text-[11px] font-mono text-natural-dark font-black block mt-1.5">${tx.amount.toLocaleString()} ({tx.method})</span>
                          <span className="text-[9.5px] text-natural-muted block truncate mt-0.5" title={tx.details}>{tx.details}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adminApproveTransaction(tx.id)}
                            className="h-8 w-8 bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center justify-center text-white shrink-0 select-none cursor-pointer"
                            title="Approve & Credit Balance"
                          >
                            <Check className="h-4 w-4 stroke-[3]" />
                          </button>
                          <button
                            onClick={() => adminRejectTransaction(tx.id)}
                            className="h-8 w-8 bg-rose-800 hover:bg-rose-900 rounded-lg flex items-center justify-center text-white shrink-0 select-none cursor-pointer"
                            title="Reject & Fail"
                          >
                            <X className="h-4 w-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Adjust Balance */}
              <div className="space-y-4 pt-2 border-t border-natural-border">
                <h5 className="text-[10px] text-natural-muted uppercase font-bold tracking-wider">Balance Overrides</h5>

                {/* Overwrite balance */}
                <form onSubmit={handleUpdateBalance} className="flex gap-2 font-bold">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-natural-secondary font-black">$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Overwrite account balance"
                      value={balanceInput}
                      onChange={(e) => setBalanceInput(e.target.value)}
                      className="w-full bg-white border border-[#D1D3C4] focus:border-natural-primary focus:ring-1 focus:ring-natural-primary rounded-xl py-2 pl-6 pr-3 text-xs text-natural-dark outline-none font-bold"
                    />
                  </div>
                  <button type="submit" className="bg-[#EAECE0] hover:bg-[#D1D3C4] px-3 py-2 text-xs font-bold rounded-xl text-natural-dark border border-natural-accent transition-colors uppercase cursor-pointer">
                    Update
                  </button>
                </form>

                {/* Overwrite profits */}
                <form onSubmit={handleUpdateProfits} className="flex gap-2 font-bold">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-natural-secondary font-black">$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Overwrite recorded profits"
                      value={profitsInput}
                      onChange={(e) => setProfitsInput(e.target.value)}
                      className="w-full bg-white border border-[#D1D3C4] focus:border-natural-primary focus:ring-1 focus:ring-natural-primary rounded-xl py-2 pl-6 pr-3 text-xs text-natural-dark outline-none font-bold"
                    />
                  </div>
                  <button type="submit" className="bg-[#EAECE0] hover:bg-[#D1D3C4] px-3 py-2 text-xs font-bold rounded-xl text-natural-dark border border-natural-accent transition-colors uppercase cursor-pointer">
                    Update
                  </button>
                </form>

                {/* Overwrite Referral Earned */}
                <form onSubmit={handleUpdateReferral} className="flex gap-2 font-bold">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-natural-secondary font-black">$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Overwrite referral income"
                      value={rfEarnedInput}
                      onChange={(e) => setRfEarnedInput(e.target.value)}
                      className="w-full bg-white border border-[#D1D3C4] focus:border-natural-primary focus:ring-1 focus:ring-natural-primary rounded-xl py-2 pl-6 pr-3 text-xs text-natural-dark outline-none font-bold"
                    />
                  </div>
                  <button type="submit" className="bg-[#EAECE0] hover:bg-[#D1D3C4] px-3 py-2 text-xs font-bold rounded-xl text-natural-dark border border-natural-accent transition-colors uppercase cursor-pointer">
                    Update
                  </button>
                </form>

                {/* Toggle KYC Verification status */}
                <button
                  type="button"
                  onClick={handleInstantVerificationToggle}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#F4F5F0] border border-natural-border hover:bg-[#EAECE0] transition-colors text-natural-dark uppercase mt-4 cursor-pointer"
                >
                  KYC Verification state: <strong className="text-emerald-800">{user.verificationStatus.toUpperCase()}</strong>
                </button>
              </div>
            </div>

            {/* Footer details */}
            <div className="p-6 border-t border-natural-border bg-natural-bg/40 flex justify-between items-center text-[10px] text-[#8B8D7A] font-bold uppercase font-mono">
              <span>Gate Security Shield Active</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-700" /> SECURE ROOT PORT</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
