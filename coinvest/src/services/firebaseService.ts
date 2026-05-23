/**
 * Firebase Service Layer
 * Provides all Firebase operations for Coinvest
 * Gracefully handles missing Firebase configuration
 */

import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { User, Transaction, Investment, Trade, CopyTrader } from '../types';

export const firebaseService = {
  // Check if Firebase is enabled
  isFirebaseEnabled(): boolean {
    return !!(auth && db);
  },

  // ====== AUTHENTICATION ======
  async register(email: string, password: string, name: string): Promise<User | null> {
    if (!this.isFirebaseEnabled()) {
      console.warn('Firebase not configured. Using demo mode.');
      return null;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth!, email, password);
      const user: User = {
        id: userCred.user.uid,
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        balance: 1000.0,
        profits: 0,
        totalWithdrawn: 0,
        activeInvestmentsAmount: 0,
        referralsEarned: 0,
        referralCode: 'PY-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        verificationStatus: 'unverified',
        joinedAt: new Date().toISOString(),
      };

      await setDoc(doc(db!, 'users', userCred.user.uid), user);
      return user;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<User | null> {
    if (!this.isFirebaseEnabled()) {
      console.warn('Firebase not configured. Using demo mode.');
      return null;
    }
    try {
      const userCred = await signInWithEmailAndPassword(auth!, email, password);
      const userDoc = await getDoc(doc(db!, 'users', userCred.user.uid));
      return (userDoc.data() as User) || null;
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  async logout(): Promise<void> {
    if (!this.isFirebaseEnabled()) return;
    try {
      await signOut(auth!);
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw error;
    }
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    if (!this.isFirebaseEnabled()) return () => {};
    return onAuthStateChanged(auth!, callback);
  },

  // ====== USER OPERATIONS ======
  async getUser(userId: string): Promise<User | null> {
    if (!this.isFirebaseEnabled()) return null;
    try {
      const userDoc = await getDoc(doc(db!, 'users', userId));
      return (userDoc.data() as User) || null;
    } catch (error: any) {
      console.error('Get user error:', error.message);
      return null;
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    if (!this.isFirebaseEnabled()) return;
    try {
      await updateDoc(doc(db!, 'users', userId), updates);
    } catch (error: any) {
      console.error('Update user error:', error.message);
      throw error;
    }
  },

  // ====== TRANSACTIONS ======
  async addTransaction(userId: string, transaction: Omit<Transaction, 'id'>): Promise<string> {
    if (!this.isFirebaseEnabled()) return '';
    try {
      const docRef = await addDoc(
        collection(db!, 'users', userId, 'transactions'),
        {
          ...transaction,
          createdAt: new Date(),
        }
      );
      return docRef.id;
    } catch (error: any) {
      console.error('Add transaction error:', error.message);
      throw error;
    }
  },

  async getTransactions(userId: string): Promise<Transaction[]> {
    if (!this.isFirebaseEnabled()) return [];
    try {
      const q = query(collection(db!, 'users', userId, 'transactions'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Transaction[];
    } catch (error: any) {
      console.error('Get transactions error:', error.message);
      return [];
    }
  },

  subscribeToTransactions(
    userId: string,
    callback: (transactions: Transaction[]) => void
  ) {
    if (!this.isFirebaseEnabled()) return () => {};
    const q = query(collection(db!, 'users', userId, 'transactions'));
    return onSnapshot(
      q,
      (querySnapshot) => {
        const transactions = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Transaction[];
        callback(transactions);
      },
      (error) => console.error('Transaction subscription error:', error.message)
    );
  },

  // ====== INVESTMENTS ======
  async addInvestment(userId: string, investment: Omit<Investment, 'id'>): Promise<string> {
    if (!this.isFirebaseEnabled()) return '';
    try {
      const docRef = await addDoc(collection(db!, 'users', userId, 'investments'), investment);
      return docRef.id;
    } catch (error: any) {
      console.error('Add investment error:', error.message);
      throw error;
    }
  },

  async getInvestments(userId: string): Promise<Investment[]> {
    if (!this.isFirebaseEnabled()) return [];
    try {
      const q = query(collection(db!, 'users', userId, 'investments'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Investment[];
    } catch (error: any) {
      console.error('Get investments error:', error.message);
      return [];
    }
  },

  async updateInvestment(userId: string, investmentId: string, updates: Partial<Investment>): Promise<void> {
    if (!this.isFirebaseEnabled()) return;
    try {
      await updateDoc(doc(db!, 'users', userId, 'investments', investmentId), updates);
    } catch (error: any) {
      console.error('Update investment error:', error.message);
      throw error;
    }
  },

  subscribeToInvestments(
    userId: string,
    callback: (investments: Investment[]) => void
  ) {
    if (!this.isFirebaseEnabled()) return () => {};
    const q = query(collection(db!, 'users', userId, 'investments'));
    return onSnapshot(
      q,
      (querySnapshot) => {
        const investments = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Investment[];
        callback(investments);
      },
      (error) => console.error('Investment subscription error:', error.message)
    );
  },

  // ====== TRADES ======
  async addTrade(userId: string, trade: Omit<Trade, 'id'>): Promise<string> {
    if (!this.isFirebaseEnabled()) return '';
    try {
      const docRef = await addDoc(collection(db!, 'users', userId, 'trades'), trade);
      return docRef.id;
    } catch (error: any) {
      console.error('Add trade error:', error.message);
      throw error;
    }
  },

  async getTrades(userId: string): Promise<Trade[]> {
    if (!this.isFirebaseEnabled()) return [];
    try {
      const q = query(collection(db!, 'users', userId, 'trades'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Trade[];
    } catch (error: any) {
      console.error('Get trades error:', error.message);
      return [];
    }
  },

  async updateTrade(userId: string, tradeId: string, updates: Partial<Trade>): Promise<void> {
    if (!this.isFirebaseEnabled()) return;
    try {
      await updateDoc(doc(db!, 'users', userId, 'trades', tradeId), updates);
    } catch (error: any) {
      console.error('Update trade error:', error.message);
      throw error;
    }
  },

  subscribeToTrades(
    userId: string,
    callback: (trades: Trade[]) => void
  ) {
    if (!this.isFirebaseEnabled()) return () => {};
    const q = query(collection(db!, 'users', userId, 'trades'));
    return onSnapshot(
      q,
      (querySnapshot) => {
        const trades = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Trade[];
        callback(trades);
      },
      (error) => console.error('Trade subscription error:', error.message)
    );
  },

  // ====== COPY TRADERS ======
  async getCopyTraders(): Promise<CopyTrader[]> {
    if (!this.isFirebaseEnabled()) return [];
    try {
      const q = query(collection(db!, 'copyTraders'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as CopyTrader[];
    } catch (error: any) {
      console.error('Get copy traders error:', error.message);
      return [];
    }
  },

  subscribeToCopyTraders(
    callback: (traders: CopyTrader[]) => void
  ) {
    if (!this.isFirebaseEnabled()) return () => {};
    const q = query(collection(db!, 'copyTraders'));
    return onSnapshot(
      q,
      (querySnapshot) => {
        const traders = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as CopyTrader[];
        callback(traders);
      },
      (error) => console.error('Copy traders subscription error:', error.message)
    );
  },

  // ====== BATCH OPERATIONS ======
  async batchUpdateUserData(
    userId: string,
    userUpdates: Partial<User>,
    transactions: Transaction[] = [],
    investments: Investment[] = []
  ): Promise<void> {
    if (!this.isFirebaseEnabled()) return;
    try {
      const batch = writeBatch(db!);

      // Update user
      batch.update(doc(db!, 'users', userId), userUpdates);

      // Add transactions
      transactions.forEach((tx) => {
        const txRef = doc(collection(db!, 'users', userId, 'transactions'));
        batch.set(txRef, tx);
      });

      // Update investments
      investments.forEach((inv) => {
        const invRef = doc(db!, 'users', userId, 'investments', inv.id);
        batch.update(invRef, inv);
      });

      await batch.commit();
    } catch (error: any) {
      console.error('Batch update error:', error.message);
      throw error;
    }
  },
};