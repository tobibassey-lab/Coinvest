import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  TrendingUp, LayoutDashboard, PiggyBank, Activity, Users, Wallet, User as UserIcon, 
  LogOut, ShieldAlert, BadgeInfo, Bell, Menu, X 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  if (!user) return null;

  const sidebarLinks = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard, desc: 'Balance & Stats' },
    { id: 'investments', name: 'Invest', icon: PiggyBank, desc: 'Yield Packages' },
    { id: 'trading', name: 'Live CFD Desk', icon: Activity, desc: 'Terminal Station' },
    { id: 'copy-trading', name: 'Strategy Copy', icon: Users, desc: 'Follow Elite' },
    { id: 'wallet', name: 'Manage Funds', icon: Wallet, desc: 'Deposit / Withdraw' },
    { id: 'profile', name: 'Settings Desk', icon: UserIcon, desc: 'Safety & KYC' }
  ];

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col font-sans select-none antialiased">
      {/* Top Header Navigation */}
      <header className="sticky top-0 bg-natural-bg/90 backdrop-blur-xl border-b border-natural-border h-16 px-4 md:px-6 flex items-center justify-between z-30">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-accent via-gold-primary to-gold-dark flex items-center justify-center shadow-sm">
            <TrendingUp className="h-4.5 w-4.5 text-white stroke-[2.5]" />
          </div>
          <div>
            <span className="font-serif font-black text-base tracking-tight text-natural-dark block">coinvest</span>
            <span className="text-[9px] text-gold-dark font-extrabold tracking-wider block">GOLD DESK #039</span>
          </div>
        </div>

        {/* User Stats widget */}
        <div className="hidden sm:flex items-center gap-6 px-4 py-1.5 bg-white/50 border border-natural-border rounded-full text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="text-natural-muted font-bold uppercase tracking-wider text-[9px]">Clear Value:</span>
            <span className="font-mono text-natural-dark font-black">${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="h-3.5 w-px bg-natural-accent" />
          <div className="flex items-center gap-1.5">
            <span className="text-natural-text font-serif">{user.name}</span>
            <span className={`h-2 w-2 rounded-full ${user.verificationStatus === 'verified' ? 'bg-natural-primary' : 'bg-natural-muted animate-pulse'}`} />
          </div>
        </div>

        {/* Action icons / Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {/* Notifications mockup */}
          <button className="p-2 text-natural-secondary hover:text-natural-dark hover:bg-white/50 rounded-lg transition-colors relative">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-natural-primary" />
          </button>

          {/* Logout Trigger */}
          <button 
            onClick={logout}
            className="hidden md:flex items-center gap-1 bg-white hover:bg-[#EAECE0] hover:text-natural-dark border border-natural-border hover:border-natural-secondary px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#5A5A40] transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span>EXCHANGE OUT</span>
          </button>

          {/* Hamburger trigger */}
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-1 px-1.5 md:hidden text-natural-text hover:text-natural-dark hover:bg-white bg-transparent border border-natural-border rounded-lg"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Main Structural Body */}
      <div className="flex-1 flex max-w-full">
        {/* Sidebar Nav (Desktop view) */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-60 border-r border-natural-border bg-white/30 hidden md:flex flex-col justify-between p-4 flex-shrink-0">
          <div className="space-y-6">
            <div className="text-[10px] text-natural-muted tracking-wider font-extrabold uppercase pl-2">
              Exchange Control Desk
            </div>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left border ${
                      isActive
                        ? 'bg-natural-primary text-white border-[#5A5A40] font-bold shadow-md shadow-natural-primary/10'
                        : 'bg-transparent text-natural-text border-transparent hover:text-natural-dark hover:bg-white/60'
                    }`}
                  >
                    <link.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-[#F4F5F0]' : 'text-natural-secondary'}`} />
                    <div>
                      <span className="block font-serif text-sm">{link.name}</span>
                      <span className={`text-[9.5px] font-sans block mt-0.5 ${isActive ? 'text-natural-bg/80' : 'text-natural-muted font-medium'}`}>{link.desc}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar lower widget */}
          <div className="bg-gradient-to-br from-gold-cream to-white p-4 border border-gold-border rounded-2xl space-y-2 select-none shadow-sm">
            <span className="text-[9px] text-gold-dark uppercase font-black block tracking-wider">Trading Specs</span>
            <div className="flex gap-2 justify-between text-[11px] text-natural-text font-semibold mb-1">
              <span>Account Pool:</span>
              <span className="font-mono text-natural-dark font-bold">FPS SECURE</span>
            </div>
            <div className="flex gap-2 justify-between text-[11px] text-gold-primary font-semibold">
              <span>Latency Index:</span>
              <span className="font-mono text-natural-dark font-bold">0.90ms Live</span>
            </div>
          </div>
        </aside>

        {/* Mobile menu panel overlay drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 bg-natural-bg/95 z-20 flex flex-col p-6 space-y-6 md:hidden select-none outline-none">
            <div className="flex items-center justify-between p-3.5 bg-white border border-natural-border rounded-xl shadow-sm">
              <div>
                <span className="text-[10px] text-natural-muted font-bold block uppercase tracking-wider">Account balance:</span>
                <span className="font-mono text-natural-dark font-black block mt-0.5">${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <span className="text-xs text-natural-text font-serif font-bold">{user.name}</span>
            </div>

            <nav className="flex-1 space-y-1.5">
              {sidebarLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                      isActive
                        ? 'bg-natural-primary text-white border-natural-primary font-bold shadow-md shadow-natural-primary/10'
                        : 'bg-transparent text-natural-text border-transparent hover:text-natural-dark hover:bg-white/40'
                    }`}
                  >
                    <link.icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-natural-secondary'}`} />
                    <span className="font-serif">{link.name}</span>
                  </button>
                );
              })}
            </nav>

            <button
              onClick={logout}
              className="w-full bg-white hover:bg-[#EAECE0] text-[#5A5A40] text-xs font-extrabold py-3 rounded-xl border border-natural-border tracking-wider transition-colors shadow-sm"
            >
              EXCHANGE LOGOUT
            </button>
          </div>
        )}

        {/* Dashboard Content Container */}
        <main className="flex-1 max-w-full overflow-hidden p-4 md:p-6 lg:p-8 bg-natural-bg relative">
          <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-10rem)] pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
