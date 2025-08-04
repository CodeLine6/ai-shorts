# NextAuth Session Invalidation for Deleted Users

This document explains how the session invalidation system works when users are deleted from the database.

## Overview

The system automatically invalidates NextAuth sessions when users no longer exist in the Convex database. This prevents deleted users from accessing the application with their existing JWT tokens.

## Implementation Details

### 1. User Validation Query (`convex/user.js`)

```javascript
export const ValidateUserExists = query({
    args: {
        userId: v.id('users')
    },
    handler: async ({db}, {userId}) => {
        try {
            const user = await db.get(userId);
            return user ? {
                exists: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    isVerified: user.isVerified,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    contactNumber: user.contactNumber,
                    credits: user.credits,
                    image: user.image
                }
            } : { exists: false, user: null };
        } catch (error) {
            return { exists: false, user: null };
        }
    }
});
```

### 2. Session Callback Validation (`src/app/api/auth/[...nextauth]/option.ts`)

The session callback now:
- Queries the database to verify user existence on every session access
- Returns invalidated session data if user doesn't exist
- Falls back to cached token data if database query fails (graceful degradation)
- Updates session with fresh user data from database

### 3. Enhanced Middleware (`src/middleware.js`)

The middleware now:
- Checks for invalidated sessions (empty user ID)
- Redirects users with invalidated sessions to sign-in with a message
- Prevents access to dashboard routes with invalid sessions

### 4. User Feedback (`src/app/(auth)/sign-in/page.tsx`)

The sign-in page:
- Displays a toast notification when users are redirected due to session expiration
- Provides clear feedback about why re-authentication is required

## How It Works

### Normal Flow
1. User signs in and receives a JWT token
2. On each request, the session callback validates user existence
3. If user exists, session is populated with fresh data
4. User continues to access the application normally

### Deletion Flow
1. User account is deleted from the Convex database
2. On next request, session callback queries database
3. User validation returns `exists: false`
4. Session is invalidated with empty user data
5. Middleware detects invalid session and redirects to sign-in
6. User sees session expired message and must re-authenticate

## Security Benefits

1. **Immediate Invalidation**: Sessions are invalidated as soon as user data is accessed after deletion
2. **Fresh Data**: Session always contains up-to-date user information
3. **Graceful Degradation**: System remains functional even if database is temporarily unavailable
4. **User Feedback**: Clear communication about why re-authentication is required

## Performance Considerations

- **Database Query Overhead**: Each session access triggers a database query
- **Caching**: Consider implementing Redis or in-memory caching for high-traffic applications
- **Graceful Fallback**: Database errors don't prevent access (uses cached session data)

## Usage Examples

### Deleting a User
```javascript
// When deleting a user, their session will automatically be invalidated
// on their next request
await db.delete(userId);
```

### Testing Session Invalidation
1. Sign in to the application
2. Delete your user account from the database (using Convex dashboard or API)
3. Navigate to any dashboard page
4. You should be redirected to sign-in with a "Session Expired" message

## Error Handling

The system includes comprehensive error handling:
- Database connection failures fall back to cached session data
- Invalid user IDs are handled gracefully
- Users receive clear feedback about session status

## Customization

### Changing Redirect Behavior
Modify `src/middleware.js` to change where users are redirected:

```javascript
return NextResponse.redirect(new URL('/custom-page?reason=deleted', request.url))
```

### Customizing User Feedback
Update `src/app/(auth)/sign-in/page.tsx` to change the notification message:

```javascript
toast({
    title: "Account Unavailable",
    description: "Your account is no longer active. Please contact support.",
    variant: "destructive"
})
```

### Adding Caching
Implement caching in the session callback to reduce database queries:

```javascript
// Example with simple in-memory cache
const userCache = new Map();

async session({ session, token }) {
    const cacheKey = token._id;
    const cached = userCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 60000) { // 1 minute cache
        // Use cached data
    } else {
        // Query database and update cache
    }
}
```

## Troubleshooting

### Sessions Not Being Invalidated
1. Check that the `ValidateUserExists` query is properly exported
2. Verify Convex API is accessible from the NextAuth configuration
3. Check console logs for database query errors

### Users Getting Locked Out
1. Verify database connection is stable
2. Check that fallback logic is working in the session callback
3. Ensure error handling doesn't prevent session creation

### Performance Issues
1. Consider implementing caching for user validation
2. Monitor database query frequency
3. Optimize the `ValidateUserExists` query if needed

## Best Practices

1. **Monitor Performance**: Track database query frequency and response times
2. **Log Events**: Add logging for session invalidations to monitor system behavior
3. **User Communication**: Provide clear feedback when sessions are invalidated
4. **Graceful Degradation**: Always provide fallback behavior for database errors
5. **Testing**: Regularly test the invalidation flow in development and staging environments
