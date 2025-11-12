# Migration Guide: Old Login → New JWT Authentication

## What Changed

The application now uses **JWT (JSON Web Token) authentication** instead of the old login system.

## For Existing Users

### Automatic Migration

If you were logged in before this update:

1. **When you visit the site**, old authentication data is automatically cleared
2. You'll see the "Sign in with Google" button
3. **Log back in** with Google
4. Your data will be preserved (matched by email)
5. You'll receive a new JWT token

### Why?

- Old login stored user data in `localStorage.collector-data`
- New login stores JWT token in `localStorage.auth`
- The backend now requires JWT tokens for write operations
- Old auth data is automatically cleaned up on page load

## Quick Fix

### Option 1: Clear Browser Storage (Easiest)

Open browser console (F12) and run:
```javascript
localStorage.clear()
```

Then refresh the page and log in again.

---

### Option 2: Manual Logout

1. Click your profile picture in the header
2. Click "Log Out"
3. Log back in with Google

---

### Option 3: Check Your Auth Status

Open browser console and run:
```javascript
// Check if you have a JWT token
const auth = JSON.parse(localStorage.getItem('auth'));
console.log('JWT Token:', auth?.token ? 'Present ✓' : 'Missing ✗');
console.log('User:', auth?.user);
```

If "Missing ✗", you need to log in again.

---

## What Gets Stored Now

### New Auth Format:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "Your Name",
    "email": "your@email.com",
    "logo": "https://...",
    "type": 1
  }
}
```

### Token Usage:
- Automatically included in all API requests
- Valid for 7 days
- Automatically cleared if invalid/expired

---

## Troubleshooting

### "401 Unauthorized" Error While Logged In

**Cause:** You're logged in with the old system but don't have a JWT token.

**Fix:** Log out and log back in.

---

### "Authentication required" in Console

**Cause:** No JWT token in localStorage.

**Fix:** Log in with Google.

---

### Changes Don't Save

**Cause:** JWT token missing or expired.

**Fix:** Log out and log back in.

---

### Still See Profile Picture But Can't Edit

**Cause:** Old user data in localStorage but no JWT token.

**Fix:** 
```javascript
localStorage.clear()
// Then refresh and log in
```

---

## For Developers

### How to Test

1. **Clear all storage:**
   ```javascript
   localStorage.clear()
   ```

2. **Log in with Google**

3. **Verify JWT token:**
   ```javascript
   const auth = JSON.parse(localStorage.getItem('auth'));
   console.log('Token:', auth.token);
   ```

4. **Test protected operations:**
   - Try adding a number to a collection
   - Try creating a set
   - Try updating your profile

5. **Check browser network tab:**
   - All requests should have `Authorization: Bearer <token>` header

---

## What Stays Public

These operations still work **without login**:
- Viewing all users
- Viewing all sets
- Viewing all collections
- Viewing exchange opportunities
- Browsing the site

Only **write operations** require authentication:
- Creating/editing sets
- Adding/removing numbers
- Updating your profile
- Deleting your account

---

## Support

If you still have issues after logging out and back in:

1. Open browser console (F12)
2. Check for errors
3. Run: `console.log(localStorage)`
4. Take a screenshot
5. Report the issue

