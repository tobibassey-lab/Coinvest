# Firebase Integration Guide for Coinvest

## Overview

Coinvest now supports Firebase integration for cloud-based data persistence, real-time synchronization, and secure authentication. The app gracefully falls back to demo mode (localStorage) if Firebase is not configured.

## Prerequisites

- Firebase project (create at https://console.firebase.google.com)
- Node.js 16+
- Vite (already configured)

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `coinvest` (or your preferred name)
4. Follow the setup wizard
5. Select or create a Google Cloud project
6. Enable Google Analytics (optional)
7. Click "Create project"

### 2. Get Firebase Credentials

1. In Firebase Console, click the gear icon → Project Settings
2. Click "Your apps" section
3. Click "Web" icon to create a web app
4. Enter app nickname: `Coinvest Web`
5. Copy the entire config object

### 3. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp coinvest/.env.local.example coinvest/.env.local
   ```

2. Edit `coinvest/.env.local` and paste your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=coinvest.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=coinvest-abc123
   VITE_FIREBASE_STORAGE_BUCKET=coinvest.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcd1234...
   ```

### 4. Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Select region (e.g., `us-central1`)
4. Choose **Start in test mode** for development
5. Click **Create**

### 5. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider:
   - Click **Email/Password**
   - Toggle "Email/Password" ON
   - Toggle "Email link (passwordless sign-in)" OFF
   - Click **Save**

### 6. Create Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Subcollections
      match /transactions/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
      
      match /investments/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
      
      match /trades/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
      
      match /copyTraders/{document=**} {
        allow read: if request.auth != null;
      }
    }
    
    // Public copy traders collection
    match /copyTraders/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Firestore Database Structure

```
Firestore Root
├── users/
│   ├── {userId}/
│   │   ├── id: string
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── balance: number
│   │   ├── profits: number
│   │   ├── totalWithdrawn: number
│   │   ├── activeInvestmentsAmount: number
│   │   ├── referralsEarned: number
│   │   ├── referralCode: string
│   │   ├── verificationStatus: string
│   │   ├── joinedAt: timestamp
│   │   │
│   │   ├── transactions/ (subcollection)
│   │   │   └── {transactionId}/
│   │   │       ├── id: string
│   │   │       ├── type: string (deposit/withdrawal/investment/payout)
│   │   │       ├── amount: number
│   │   │       ├── method: string
│   │   │       ├── status: string (pending/completed/failed)
│   │   │       ├── details: string
│   │   │       ├── timestamp: timestamp
│   │   │       └── txHash?: string
│   │   │
│   │   ├── investments/ (subcollection)
│   │   │   └── {investmentId}/
│   │   │       ├── id: string
│   │   │       ├── planId: string
│   │   │       ├── planName: string
│   │   │       ├── amount: number
│   │   │       ├── startDate: timestamp
│   │   │       ├── endDate: timestamp
│   │   │       ├── dailyRoi: number
│   │   │       ├── durationDays: number
│   │   │       ├── status: string (active/completed/cancelled)
│   │   │       ├── totalEarned: number
│   │   │       └── lastClaimDate: timestamp
│   │   │
│   │   ├── trades/ (subcollection)
│   │   │   └── {tradeId}/
│   │   │       ├── id: string
│   │   │       ├── symbol: string
│   │   │       ├── type: string (buy/sell)
│   │   │       ├── entryPrice: number
│   │   │       ├── currentPrice: number
│   │   │       ├── amount: number
│   │   │       ├── leverage: number
│   │   │       ├── timestamp: timestamp
│   │   │       ├── pnl: number
│   │   │       ├── status: string (open/closed)
│   │   │       └── closedPrice?: number
│   │   │
│   │   └── copyTraders/ (subcollection)
│   │       └── {traderId}/
│   │           ├── isCopied: boolean
│   │           └── copiedAmount: number
│
└── copyTraders/ (shared collection)
    └── {traderId}/
        ├── id: string
        ├── name: string
        ├── avatar: string
        ├── winRate: number
        ├── roi30D: number
        ├── aum: number
        ├── riskScore: number
        ├── copiers: number
        └── preferredAssets: array
```

## Usage in Components

### Using Firebase Service

```typescript
import { firebaseService } from './services/firebaseService';

// Check if Firebase is enabled
if (firebaseService.isFirebaseEnabled()) {
  console.log('Firebase is active');
}

// Register user
const user = await firebaseService.register(email, password, name);

// Login
const user = await firebaseService.login(email, password);

// Add transaction
const txId = await firebaseService.addTransaction(userId, {
  type: 'deposit',
  amount: 100,
  method: 'Card',
  status: 'pending',
  details: 'Test deposit',
  timestamp: new Date().toISOString()
});

// Subscribe to real-time updates
const unsubscribe = firebaseService.subscribeToTransactions(
  userId,
  (transactions) => {
    console.log('Transactions updated:', transactions);
  }
);

// Cleanup subscription
unsubscribe();
```

### DashboardContext Integration

The `DashboardContext` automatically:
1. Detects if Firebase is enabled
2. Uses Firebase for data persistence if available
3. Falls back to localStorage if Firebase is not configured
4. Manages real-time subscriptions
5. Keeps data in sync across tabs/devices (when Firebase is enabled)

## Running the Application

### Development Mode with Firebase

```bash
cd coinvest

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will:
- Check for Firebase configuration
- Log Firebase status to console
- Use cloud data if Firebase is configured
- Use demo mode (localStorage) if not configured

### Demo Mode (No Firebase)

Simply remove/comment out environment variables to run in demo mode with localStorage.

## Testing

### Test Firebase Connection

1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for Firebase status message:
   - ✅ "Firebase enabled - Using cloud data"
   - ℹ️ "Firebase disabled - Using demo mode (localStorage)"

### Test Authentication

```typescript
// In browser console
const { firebaseService } = await import('./src/services/firebaseService.ts');

// Register
await firebaseService.register('test@example.com', 'password', 'Test User');

// Login
await firebaseService.login('test@example.com', 'password');
```

### Test Real-time Updates

1. Open app in two browser tabs
2. Log in to both with same account
3. Add a transaction in one tab
4. Verify it appears in other tab instantly (when Firebase is enabled)

## Deployment

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Build the app
npm run build

# Deploy
firebase deploy
```

### Environment Variables in Production

1. In Firebase Console, go to **Extensions** or use Cloud Run
2. Set environment variables in your hosting configuration
3. Or use Firebase Secrets for sensitive data

## Troubleshooting

### Firebase not initializing

**Issue**: Console shows "Firebase config is incomplete"

**Solution**:
1. Check `.env.local` file exists and has all 6 variables
2. All values should be non-empty strings
3. Restart dev server after changing env vars
4. Check for typos in variable names (must start with `VITE_`)

### Authentication failing

**Issue**: Login/register returns error

**Solution**:
1. Ensure Authentication is enabled in Firebase Console
2. Check Email/Password provider is toggled ON
3. Verify security rules allow authentication
4. Check Firebase quota (free tier has limits)

### Firestore write errors

**Issue**: Transactions not saving

**Solution**:
1. Check Firestore Database is created
2. Review security rules (test mode allows all writes)
3. Check user is authenticated (uid matches)
4. Monitor Firestore usage in Console

### Real-time updates not working

**Issue**: Data not syncing between tabs

**Solution**:
1. Verify Firebase is enabled: `firebaseService.isFirebaseEnabled()` → true
2. Check subscription callbacks are working
3. Monitor Network tab in DevTools for Firestore connections
4. Check security rules allow read access

### Cold start or slow performance

**Issue**: App takes time to load data

**Solution**:
1. Enable Firestore offline persistence
2. Add data indexing for complex queries
3. Implement pagination for large collections
4. Use caching strategies in context providers

## Security Best Practices

✅ **DO:**
- Keep API keys secret (use .env.local)
- Review security rules regularly
- Use production mode rules when deploying
- Enable 2FA on Firebase account
- Monitor Firestore usage and costs
- Validate all user inputs on backend

❌ **DON'T:**
- Commit `.env.local` to git
- Use test mode rules in production
- Store sensitive data in Firestore (unencrypted)
- Expose API keys in public repositories
- Trust client-side validation alone

## Performance Optimization

### Firestore Indexes

Create composite indexes for complex queries:

```firestore
# Example for transaction filtering
Collection: users/{userId}/transactions
Fields:
  - status (Ascending)
  - timestamp (Descending)
```

### Query Optimization

```typescript
// ❌ Bad: loads all transactions
const all = await firebaseService.getTransactions(userId);

// ✅ Good: only active transactions
const q = query(
  collection(db, 'users', userId, 'transactions'),
  where('status', '==', 'completed'),
  limit(20)
);
```

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Vite Guide](https://vitejs.dev/)

## Next Steps

1. ✅ Create Firebase project
2. ✅ Configure environment variables
3. ✅ Set up Firestore and Auth
4. ✅ Test the integration
5. 📝 Add Cloud Functions for complex operations
6. 🔒 Implement backup and recovery systems
7. 📊 Set up monitoring and analytics
8. 🚀 Deploy to production
