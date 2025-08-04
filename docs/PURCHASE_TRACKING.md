# Purchase Tracking System

## Overview

This document outlines the robust purchase tracking system that replaces the previous hacky first purchase logic.

## ❌ Previous Problems

### Hacky First Purchase Detection
```javascript
// OLD - UNRELIABLE
const isFirstPurchase = user?.credits === 3 || user?.credits === 6;
```

**Issues:**
- Broke when users earned referral credits before purchasing
- Failed after any credit changes (bonus credits, partial usage)
- No audit trail for debugging
- Race conditions in payment processing

## ✅ New Architecture

### Database Schema Changes

#### Users Table - Added Fields
```javascript
users: defineTable({
    // ... existing fields
    hasEverPurchased: v.optional(v.boolean()),    // Simple flag
    firstPurchaseAt: v.optional(v.string()),       // Timestamp
    totalPurchased: v.optional(v.number()),        // Total USD spent
})
```

#### New Purchases Table
```javascript
purchases: defineTable({
    userId: v.id('users'),
    amount: v.number(),           // USD amount
    credits: v.number(),          // Credits purchased  
    paymentMethod: v.string(),     // "PayPal", "Stripe", etc.
    transactionId: v.string(),     // Payment processor ID
    status: v.string(),           // "pending", "completed", "failed"
    createdAt: v.string(),
    isFirstPurchase: v.boolean(), // Explicitly tracked
}).index("by_userId", ["userId"])
  .index("by_transactionId", ["transactionId"])
```

### Robust Purchase Flow

1. **Create Purchase Record** - Atomic transaction with `isFirstPurchase` flag
2. **Update User Credits & Flags** - Set `hasEverPurchased: true` 
3. **Credit Referral Reward** - Only if `isFirstPurchase === true`
4. **Update Session** - Reflect new credits in UI

### Key Functions

#### `ProcessPurchase` Mutation
- Handles complete purchase flow atomically
- Determines first purchase via `!user.hasEverPurchased`
- Creates purchase record with explicit tracking
- Credits referral rewards automatically

#### `processPurchaseHelper` Function  
- Core business logic for purchase processing
- Returns structured data about the purchase
- Handles all database updates in correct order

#### Migration Support
```javascript
// Migrate existing users
MigratePurchaseFields() // Sets hasEverPurchased: false, totalPurchased: 0
```

## Benefits

✅ **Reliable** - No dependency on current credit balance  
✅ **Audit Trail** - Complete purchase history in database  
✅ **Transaction Safe** - Atomic operations prevent race conditions  
✅ **Extensible** - Easy to add purchase analytics features  
✅ **Debuggable** - Clear data for troubleshooting billing issues  

## Usage Example

### Frontend (Billing Page)
```javascript
const onPaymentSuccess = async (cost, credits, transactionId) => {
  const result = await processPurchase({
    userId: user._id,
    amount: cost,
    credits: credits,
    paymentMethod: "PayPal",
    transactionId: transactionId,
  });

  if (result.success) {
    // Handle successful purchase
    if (result.referralReward?.success) {
      // Show referral bonus message
    }
  }
};
```

### Backend (Convex)
```javascript
// Automatic first purchase detection
const isFirstPurchase = !user.hasEverPurchased;

// Create purchase record
await db.insert("purchases", {
  userId,
  amount,
  credits,
  paymentMethod,
  transactionId,
  status: "completed",
  createdAt: new Date().toISOString(),
  isFirstPurchase, // Explicitly tracked
});

// Update user
await db.patch(userId, {
  credits: newCredits,
  hasEverPurchased: true,
  totalPurchased: (user.totalPurchased || 0) + amount,
  ...(isFirstPurchase && { firstPurchaseAt: currentTime })
});
```

## Migration Notes

- Run `MigratePurchaseFields` mutation to update existing users
- All existing users will have `hasEverPurchased: false` initially
- First purchase after migration will be properly detected and rewarded

## Future Enhancements

- Purchase analytics dashboard
- Subscription management
- Refund tracking
- Payment method preferences
- Purchase history API endpoints
