import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Transaction, Investment, Trade, CopyTrader, InvestmentPlan, MarketAsset, TransactionStatus } from '../types';

interface DashboardContextType {
  user: User | null;
  transactions: Transaction[];
  investments: Investment[];
  trades: Trade[];
  copyTraders: CopyTrader[];
  marketAssets: MarketAsset[];
  investmentPlans: InvestmentPlan[];
  login: (email: string, name: string) => void;
  register: (email: string, name: string) => void;
  logout: () => void;
  deposit: (amount: number, method: string, details: string) => void;
  withdraw: (amount: number, method: string, details: string) => { success: boolean; message: string };
  invest: (planId: string, amount: number) => { success: boolean; message: string };
  claimInvestment: (investmentId: string) => void;
  openTrade: (symbol: string, type: 'buy' | 'sell', amount: number, leverage: number) => { success: boolean; message: string };
  closeTrade: (tradeId: string) => void;
  toggleCopyTrader: (traderId: string, amount: number) => { success: boolean; message: string };
  adminUpdateUser: (fields: Partial<User>) => void;
  adminApproveTransaction: (txId: string) => void;
  adminRejectTransaction: (txId: string) => void;
  triggerMarketTick: () => void;
  verifyAccount: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const INITIAL_PLANS: InvestmentPlan[] = [
  {
    id: 'beginner',
    name: 'Beginner Plan',
    min: 100,
    max: 1499,
    dailyRoi: 1.5,
    durationDays: 7,
    description: 'Perfect for trading novices starting their CFD and crypto journey.',
    features: ['1.5% Daily Interest Payout', 'Duration: 7 Days', '24/7 Priority Support', 'Basic Market Signals', 'Direct Crypto/Wire Deposits']
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    min: 1500,
    max: 4999,
    dailyRoi: 2.5,
    durationDays: 14,
    description: 'Ideal plan for growing your portfolio with consistent daily rewards.',
    features: ['2.5% Daily Interest Payout', 'Duration: 14 Days', 'Personal Technical Analyst Access', 'Standard Trading Signals', 'Risk-free Trial Tools']
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    min: 5000,
    max: 19999,
    dailyRoi: 3.5,
    durationDays: 30,
    description: 'Our most popular high-yield trading and copy-matching plan.',
    features: ['3.5% Daily Interest Payout', 'Duration: 30 Days', 'Dedicated Wealth Manager', 'Advanced Trading Dashboard', 'Copy-Match Professional Strategies']
  },
  {
    id: 'business',
    name: 'Business Plan',
    min: 20000,
    max: 250000,
    dailyRoi: 5.0,
    durationDays: 60,
    description: 'For corporate institutions and veteran high-volume investors.',
    features: ['5.0% Daily Interest Payout', 'Duration: 60 Days', 'Executive Financial Consultant', 'Premium Grounding Analytics', 'Custom OTC Execution Station']
  }
];

const INITIAL_ASSETS: MarketAsset[] = [
  { symbol: 'BTC/USD', name: 'Bitcoin', category: 'crypto', price: 92450.75, change24h: 3.42, history24h: [91000, 91400, 91200, 91800, 92100, 92450] },
  { symbol: 'ETH/USD', name: 'Ethereum', category: 'crypto', price: 3480.95, change24h: -1.25, history24h: [3530, 3510, 3490, 3470, 3460, 3480.95] },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', price: 1.0845, change24h: 0.12, history24h: [1.0820, 1.0830, 1.0825, 1.0840, 1.0845] },
  { symbol: 'GBP/USD', name: 'Pound / US Dollar', category: 'forex', price: 1.2678, change24h: 0.45, history24h: [1.2610, 1.2630, 1.2640, 1.2660, 1.2678] },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stock', price: 182.45, change24h: -0.80, history24h: [184.20, 183.50, 182.10, 181.90, 182.45] },
  { symbol: 'XAU/USD', name: 'Gold Spot', category: 'commodity', price: 2342.15, change24h: 1.95, history24h: [2310, 2320, 2315, 2330, 2342.15] }
];

const INITIAL_TRADERS: CopyTrader[] = [
  { id: 't1', name: 'Marcus Sterling', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', winRate: 88, roi30D: 42.5, aum: 1450000, riskScore: 3, copiers: 1240, preferredAsset: 'BTC/USD' },
  { id: 't2', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', winRate: 94, roi30D: 68.2, aum: 2890000, riskScore: 4, copiers: 2850, preferredAsset: 'EUR/USD' },
  { id: 't3', name: 'Devon Keanu', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', winRate: 81, roi30D: 29.8, aum: 980000, riskScore: 2, copiers: 860, preferredAsset: 'XAU/USD' }
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('py_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('py_transactions');
    if (saved) return JSON.parse(saved);
    return [
      { id: 't_init_1', type: 'deposit', amount: 5000, method: 'USDT (TRC20)', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', details: 'Initial Platform Loading Grant', txHash: '0x3a4b...e8f9' },
      { id: 't_init_2', type: 'investment', amount: 2000, method: 'Main Balance', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', details: 'Allocation to Basic Plan' }
    ];
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('py_investments');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'inv_init',
        planId: 'basic',
        planName: 'Basic Plan',
        amount: 2000,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        dailyRoi: 2.5,
        durationDays: 14,
        status: 'active',
        totalEarned: 100.0,
        lastClaimDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  });

  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('py_trades');
    return saved ? JSON.parse(saved) : [];
  });

  const [copyTraders, setCopyTraders] = useState<CopyTrader[]>(() => {
    const saved = localStorage.getItem('py_copy_traders');
    return saved ? JSON.parse(saved) : INITIAL_TRADERS;
  });

  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>(() => {
    const saved = localStorage.getItem('py_market_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  // Keep references for stable ticking interval callbacks
  const stateRef = useRef({ user, investments, trades, marketAssets, copyTraders });
  stateRef.current = { user, investments, trades, marketAssets, copyTraders };

  // Persist values dynamically when updated
  useEffect(() => {
    if (user) {
      localStorage.setItem('py_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('py_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('py_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('py_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('py_trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('py_copy_traders', JSON.stringify(copyTraders));
  }, [copyTraders]);

  useEffect(() => {
    localStorage.setItem('py_market_assets', JSON.stringify(marketAssets));
  }, [marketAssets]);

  // Auth Functions
  const login = (email: string, name: string) => {
    const formattedName = name.trim() || email.split('@')[0];
    const dummyUser: User = {
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
      email: email.trim().toLowerCase(),
      balance: 15450.50,
      profits: 1245.80,
      totalWithdrawn: 2500.00,
      activeInvestmentsAmount: 2000.00,
      referralsEarned: 350.00,
      referralCode: 'PY-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      verificationStatus: 'verified',
      joinedAt: new Date().toISOString()
    };
    setUser(dummyUser);
  };

  const register = (email: string, name: string) => {
    const tempUser: User = {
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      name: name.trim() || 'New Member',
      email: email.trim().toLowerCase(),
      balance: 1000.00, // Gift a trial $1000 balance to registration! Great UX!
      profits: 0,
      totalWithdrawn: 0,
      activeInvestmentsAmount: 0,
      referralsEarned: 0,
      referralCode: 'PY-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      verificationStatus: 'unverified',
      joinedAt: new Date().toISOString()
    };
    setUser(tempUser);

    setTransactions(prev => [
      {
        id: 'tx_welcome',
        type: 'deposit',
        amount: 1000.00,
        method: 'Registration Bonus',
        timestamp: new Date().toISOString(),
        status: 'completed',
        details: 'Welcome to coinvest credit grant!'
      },
      ...prev
    ]);
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
    setInvestments([]);
    setTrades([]);
    setCopyTraders(INITIAL_TRADERS);
    localStorage.removeItem('py_user');
    localStorage.removeItem('py_transactions');
    localStorage.removeItem('py_investments');
    localStorage.removeItem('py_trades');
    localStorage.removeItem('py_copy_traders');
  };

  // Verification
  const verifyAccount = () => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, verificationStatus: 'pending' } : null);
    // Simulate automated compliance check which approves after 20 seconds!
    setTimeout(() => {
      setUser(prev => {
        if (prev && prev.verificationStatus === 'pending') {
          return { ...prev, verificationStatus: 'verified' };
        }
        return prev;
      });
    }, 20000);
  };

  // Wallet Actions
  const deposit = (amount: number, method: string, details: string) => {
    if (!user) return;
    const newTx: Transaction = {
      id: 'tx_dep_' + Math.random().toString(36).substring(2, 9),
      type: 'deposit',
      amount,
      method,
      timestamp: new Date().toISOString(),
      status: 'pending',
      details,
      txHash: method.toLowerCase().includes('wire') ? undefined : '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
    };

    setTransactions(prev => [newTx, ...prev]);

    // Admin automation: auto-approve wire/crypto deposits after 20 seconds so user sees balance update!
    setTimeout(() => {
      adminApproveTransaction(newTx.id);
    }, 15000);
  };

  const withdraw = (amount: number, method: string, details: string) => {
    if (!user) return { success: false, message: 'Not logged in' };
    if (amount > user.balance) {
      return { success: false, message: 'Insufficient clear funds available in your account.' };
    }

    // Deduct immediate balance
    setUser(prev => prev ? { ...prev, balance: prev.balance - amount, totalWithdrawn: prev.totalWithdrawn + amount } : null);

    const newTx: Transaction = {
      id: 'tx_wd_' + Math.random().toString(36).substring(2, 9),
      type: 'withdrawal',
      amount,
      method,
      timestamp: new Date().toISOString(),
      status: 'pending',
      details
    };

    setTransactions(prev => [newTx, ...prev]);

    // Fast-approving system simulator: auto-approve withdrawals after 30 seconds
    setTimeout(() => {
      setTransactions(prev => prev.map(t => t.id === newTx.id ? { ...t, status: 'completed' } : t));
    }, 30000);

    return { success: true, message: 'Withdrawal protocol initialized. Our audit desk is reviewing your ticket.' };
  };

  // Investment Allocation
  const invest = (planId: string, amount: number) => {
    if (!user) return { success: false, message: 'Not logged in' };
    const plan = INITIAL_PLANS.find(p => p.id === planId);
    if (!plan) return { success: false, message: 'Invalid plan selected.' };

    if (amount < plan.min || amount > plan.max) {
      return { success: false, message: `Investment amount details: Minimum is $${plan.min} and Maximum is $${plan.max} for ${plan.name}.` };
    }

    if (amount > user.balance) {
      return { success: false, message: 'Insufficient core balances. Please complete a deposit request first.' };
    }

    // Allocate funds
    setUser(prev => prev ? {
      ...prev,
      balance: prev.balance - amount,
      activeInvestmentsAmount: prev.activeInvestmentsAmount + amount
    } : null);

    const newInvestment: Investment = {
      id: 'inv_' + Math.random().toString(36).substring(2, 9),
      planId: plan.id,
      planName: plan.name,
      amount,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString(),
      dailyRoi: plan.dailyRoi,
      durationDays: plan.durationDays,
      status: 'active',
      totalEarned: 0,
      lastClaimDate: new Date().toISOString()
    };

    setInvestments(prev => [newInvestment, ...prev]);

    setTransactions(prev => [
      {
        id: 'tx_inv_lc_' + Math.random().toString(36).substring(2, 9),
        type: 'investment',
        amount,
        method: 'Main Balance',
        timestamp: new Date().toISOString(),
        status: 'completed',
        details: `Subscribing to ${plan.name} package.`
      },
      ...prev
    ]);

    return { success: true, message: `Successfully allocated $${amount.toLocaleString()} into the ${plan.name}!` };
  };

  const claimInvestment = (investmentId: string) => {
    setInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId && inv.status === 'active') {
        const claims = inv.totalEarned;
        if (claims <= 0) return inv;

        // Credit to profits & back to overall balance if compounding or claiming
        setUser(curr => curr ? {
          ...curr,
          balance: curr.balance + claims,
          profits: curr.profits + claims
        } : null);

        // Add Transaction
        const claimTx: Transaction = {
          id: 'tx_claim_' + Math.random().toString(36).substring(2, 9),
          type: 'payout',
          amount: claims,
          method: 'Yield Settle',
          timestamp: new Date().toISOString(),
          status: 'completed',
          details: `Yield claim from ${inv.planName} contract.`
        };
        setTransactions(t => [claimTx, ...t]);

        return {
          ...inv,
          totalEarned: 0,
          lastClaimDate: new Date().toISOString()
        };
      }
      return inv;
    }));
  };

  // CFD Live Trading Engine
  const openTrade = (symbol: string, type: 'buy' | 'sell', amount: number, leverage: number) => {
    if (!user) return { success: false, message: 'Not logged in' };
    
    // Required margin is standard: amount / leverage
    const requiredMargin = amount; // Let's use amount as margin to keep trading simple, or direct margin
    if (requiredMargin > user.balance) {
      return { success: false, message: 'Insufficient funds for required margin.' };
    }

    const asset = marketAssets.find(a => a.symbol === symbol);
    if (!asset) return { success: false, message: 'Asset ticker unavailable.' };

    const entryPrice = asset.price;

    // Deduct margin from active balance
    setUser(prev => prev ? { ...prev, balance: prev.balance - requiredMargin } : null);

    const newTrade: Trade = {
      id: 'tr_' + Math.random().toString(36).substring(2, 9),
      symbol,
      type,
      entryPrice,
      currentPrice: entryPrice,
      amount: requiredMargin,
      leverage,
      timestamp: new Date().toISOString(),
      pnl: 0,
      status: 'open'
    };

    setTrades(prev => [newTrade, ...prev]);

    setTransactions(prev => [
      {
        id: 'tx_tr_op_' + Math.random().toString(36).substring(2, 9),
        type: 'investment',
        amount: requiredMargin,
        method: 'CFD Margin Secure',
        timestamp: new Date().toISOString(),
        status: 'completed',
        details: `Opened Position: ${type.toUpperCase()} ${symbol} @ $${entryPrice.toLocaleString()} (${leverage}x Leverage)`
      },
      ...prev
    ]);

    return { success: true, message: `Successfully executed position: ${type.toUpperCase()} ${symbol} with ${leverage}x leverage!` };
  };

  const closeTrade = (tradeId: string) => {
    setTrades(prev => prev.map(tr => {
      if (tr.id === tradeId && tr.status === 'open') {
        const netReturn = tr.amount + tr.pnl; // Return initial margin + running P&L
        
        setUser(curr => {
          if (!curr) return null;
          // Refund margin + P&L back to balance, and increase/decrease profit records
          const updatedBalance = Math.max(0, curr.balance + netReturn);
          const updatedProfit = curr.profits + tr.pnl;
          return {
            ...curr,
            balance: parseFloat(updatedBalance.toFixed(2)),
            profits: parseFloat(updatedProfit.toFixed(2))
          };
        });

        const closeTx: Transaction = {
          id: 'tx_tr_cl_' + Math.random().toString(36).substring(2, 9),
          type: 'payout',
          amount: Math.abs(tr.pnl),
          method: 'CFD Position Close',
          timestamp: new Date().toISOString(),
          status: 'completed',
          details: `Closed:<sup>${tr.type.toUpperCase()}</sup> ${tr.symbol} P&L: ${tr.pnl >= 0 ? '+' : '-'}$${Math.abs(tr.pnl).toLocaleString()}`
        };
        setTransactions(t => [closeTx, ...t]);

        return {
          ...tr,
          status: 'closed',
          closedPrice: tr.currentPrice
        };
      }
      return tr;
    }));
  };

  // Copy Trading
  const toggleCopyTrader = (traderId: string, amount: number) => {
    if (!user) return { success: false, message: 'Not logged in' };
    const trader = copyTraders.find(t => t.id === traderId);
    if (!trader) return { success: false, message: 'Trader profile data mismatch.' };

    if (trader.isCopied) {
      // Release Copy
      const refund = trader.copiedAmount || 0;
      setUser(prev => prev ? {
        ...prev,
        balance: prev.balance + refund,
        activeInvestmentsAmount: Math.max(0, prev.activeInvestmentsAmount - refund)
      } : null);

      setCopyTraders(prev => prev.map(t => t.id === traderId ? { ...t, isCopied: false, copiedAmount: 0 } : t));

      setTransactions(prev => [
        {
          id: 'tx_cop_rel_' + Math.random().toString(36).substring(2, 9),
          type: 'payout',
          amount: refund,
          method: 'Strategy Allocation Release',
          timestamp: new Date().toISOString(),
          status: 'completed',
          details: `Stopped copying strategist ${trader.name}. Allocated capital returned.`
        },
        ...prev
      ]);

      return { success: true, message: `Allocated copy funds returned to your balance.` };
    } else {
      // Allocate to trader
      if (!amount || amount <= 0) return { success: false, message: 'Enter a valid positive copy allocation.' };
      if (amount > user.balance) return { success: false, message: 'Insufficient balance available to copy.' };

      setUser(prev => prev ? {
        ...prev,
        balance: prev.balance - amount,
        activeInvestmentsAmount: prev.activeInvestmentsAmount + amount
      } : null);

      setCopyTraders(prev => prev.map(t => t.id === traderId ? { ...t, isCopied: true, copiedAmount: amount } : t));

      setTransactions(prev => [
        {
          id: 'tx_cop_alloc_' + Math.random().toString(36).substring(2, 9),
          type: 'investment',
          amount,
          method: 'Mirror Strategy Alloc',
          timestamp: new Date().toISOString(),
          status: 'completed',
          details: `Copied elite strategist ${trader.name} with allocation.`
        },
        ...prev
      ]);

      return { success: true, message: `Capital assigned. Tracking ${trader.name}'s active trade profiles successfully!` };
    }
  };

  // Administrative Manipulations
  const adminUpdateUser = (fields: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...fields } : null);
  };

  const adminApproveTransaction = (txId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'pending') {
        // Correctly credit user balances
        if (tx.type === 'deposit') {
          setUser(curr => curr ? { ...curr, balance: curr.balance + tx.amount } : null);
        }
        return { ...tx, status: 'completed' };
      }
      return tx;
    }));
  };

  const adminRejectTransaction = (txId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'pending') {
        // Rollback withdrawals
        if (tx.type === 'withdrawal') {
          setUser(curr => curr ? {
            ...curr,
            balance: curr.balance + tx.amount,
            totalWithdrawn: Math.max(0, curr.totalWithdrawn - tx.amount)
          } : null);
        }
        return { ...tx, status: 'failed' };
      }
      return tx;
    }));
  };

  // Real-time trading ticking intervals engine!
  const triggerMarketTick = () => {
    const s = stateRef.current;
    if (!s.user) return;

    // 1. Tick Prices
    const tickedAssets = s.marketAssets.map(asset => {
      // Ticking delta -0.5% to +0.55% (slight upward bias overall)
      const changePercent = (Math.random() * 1.05 - 0.5) / 100;
      const originalPrice = asset.price;
      const newPrice = originalPrice * (1 + changePercent);
      const isForex = asset.category === 'forex';
      
      const newHistory = [...asset.history24h.slice(1), parseFloat(newPrice.toFixed(isForex ? 5 : 2))];

      return {
        ...asset,
        price: parseFloat(newPrice.toFixed(isForex ? 5 : 2)),
        change24h: parseFloat((asset.change24h + changePercent * 10).toFixed(2)),
        history24h: newHistory
      };
    });

    setMarketAssets(tickedAssets);

    // 2. Adjust Running CFDs Live Values
    if (s.trades.length > 0) {
      setTrades(currTrades => currTrades.map(tr => {
        if (tr.status === 'open') {
          const currentAsset = tickedAssets.find(a => a.symbol === tr.symbol);
          if (currentAsset) {
            const priceChangeRatio = (currentAsset.price - tr.entryPrice) / tr.entryPrice;
            const direction = tr.type === 'buy' ? 1 : -1;
            // Running profit calculation: margin * priceChange * leverage * multiplier
            const leverageProfit = tr.amount * priceChangeRatio * tr.leverage * direction;
            
            // Auto liquidation security guard: if loss matches margin, margin gets liquidated
            if (leverageProfit <= -tr.amount) {
              const liquidatedTrade: Trade = {
                ...tr,
                currentPrice: currentAsset.price,
                pnl: -tr.amount,
                status: 'closed',
                closedPrice: currentAsset.price
              };
              
              // Add a bad event transaction
              setTransactions(t => [
                {
                  id: 'tx_liq_' + Math.random().toString(36).substring(2, 9),
                  type: 'withdrawal',
                  amount: tr.amount,
                  method: 'CFD Margin Liquidation',
                  timestamp: new Date().toISOString(),
                  status: 'failed',
                  details: `Margin Liquidated: Position ${tr.type.toUpperCase()} ${tr.symbol} hit stop-level liquidation @ $${currentAsset.price.toLocaleString()}`
                },
                ...t
              ]);

              return liquidatedTrade;
            }

            return {
              ...tr,
              currentPrice: currentAsset.price,
              pnl: parseFloat(leverageProfit.toFixed(2))
            };
          }
        }
        return tr;
      }));
    }

    // 3. Increment Active Investment Yields dynamically in real-time!
    // We award a tiny fraction of their daily ROI every tick!
    // Since 1 Day ROI pays out daily, we'll simulate real-time growth by adding (Daily ROI % / 1000) of the investment amount to "totalEarned" with each tick.
    if (s.investments.length > 0) {
      setInvestments(currInvestments => currInvestments.map(inv => {
        if (inv.status === 'active') {
          // Fraction of expected ROI
          const stepGain = inv.amount * (inv.dailyRoi / 100) * 0.005; 
          return {
            ...inv,
            totalEarned: inv.totalEarned + stepGain
          };
        }
        return inv;
      }));
    }

    // 4. Copy traders generate yield splits too!
    const activeCopies = s.copyTraders.filter(t => t.isCopied && t.copiedAmount && t.copiedAmount > 0);
    if (activeCopies.length > 0) {
      // Add split yields into active balance/profits
      const hourlyGrowth = activeCopies.reduce((sum, trader) => {
        const allocated = trader.copiedAmount || 0;
        // Each copied strategist generates continuous small increments (approx 40% APY / tick equivalent)
        const earnFraction = allocated * (trader.roi30D / 30 / 100) * 0.004;
        return sum + earnFraction;
      }, 0);

      if (hourlyGrowth > 0) {
        setUser(curr => curr ? {
          ...curr,
          balance: parseFloat((curr.balance + hourlyGrowth * 0.4).toFixed(4)), // Share to balance
          profits: parseFloat((curr.profits + hourlyGrowth).toFixed(4)) // Display tracking
        } : null);
      }
    }
  };

  // Run the universal engine real-time interval
  useEffect(() => {
    const timer = setInterval(() => {
      triggerMarketTick();
    }, 4500); // Ticks every 4.5 seconds for incredible realism!
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        user,
        transactions,
        investments,
        trades,
        copyTraders,
        marketAssets,
        investmentPlans: INITIAL_PLANS,
        login,
        register,
        logout,
        deposit,
        withdraw,
        invest,
        claimInvestment,
        openTrade,
        closeTrade,
        toggleCopyTrader,
        adminUpdateUser,
        adminApproveTransaction,
        adminRejectTransaction,
        triggerMarketTick,
        verifyAccount
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
