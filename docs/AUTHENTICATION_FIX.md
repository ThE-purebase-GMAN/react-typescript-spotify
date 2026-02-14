# 🚨 401 "Permissions missing" Error - Resolution Guide

## ✅ Updated Implementation

Your Spotify integration now has enhanced authentication with robust error handling and debugging tools.

### 🔧 New Features Added:

1. **`useAuthToken` Hook**: Advanced token management with automatic refresh
2. **Enhanced AuthDebugger**: Comprehensive authentication testing
3. **SpotifyApiTest Component**: Real-time API status monitoring
4. **Automatic Token Refresh**: Handles expired tokens transparently
5. **Detailed Error Logging**: Console logs for debugging authentication issues

---

## 🔍 Step-by-Step Debugging Process

### 1. **Open Your App Dashboard**

The dashboard now shows two debugging components:

- **🐛 Auth Debugger**: Test authentication and tokens
- **🎵 Spotify API Test**: Monitor API calls in real-time

### 2. **Check Authentication Status**

Look at the Auth Debugger panel:

- ✅ **Authenticated**: Should show "Yes"
- ✅ **Token Available**: Should show "Yes"
- ✅ **Token Valid**: Should show "Yes"
- ✅ **Refresh Token**: Should show "Available"

### 3. **Test API Endpoints**

Click the buttons in Auth Debugger to test:

#### **Test Profile API**

- Tests `/me` endpoint
- Should return user profile data
- If 401: Token/permissions issue

#### **Test Player API**

- Tests `/me/player` endpoint (your failing endpoint)
- Should return playback state or 204
- If 401: Missing playback permissions

#### **Test Currently Playing**

- Tests `/me/player/currently-playing` endpoint
- Should return current track or 204
- If 401: Missing playback permissions

### 4. **Common 401 Error Causes & Solutions**

#### **Cause A: Expired/Invalid Token**

**Symptoms:**

- Had working API calls before
- Now getting 401 on all endpoints
- Token shows as expired

**Solution:**

```typescript
// Click "Force Refresh" button or
// Click "Re-authenticate" to get fresh tokens
```

#### **Cause B: Missing Scopes**

**Symptoms:**

- Some API calls work (like profile)
- Player/playback endpoints return 401
- Fresh tokens don't help

**Solution:**

1. Click **"Re-authenticate"** button
2. Make sure to **grant all permissions** in Spotify dialog
3. Check console for scope information

**Required Scopes for Player APIs:**

```
user-read-playback-state
user-modify-playback-state
user-read-currently-playing
```

#### **Cause C: Incorrect Client ID**

**Symptoms:**

- Authentication redirect works
- But no tokens received after callback
- 401 on all API calls

**Solution:**

1. Verify `.env` file has correct `VITE_CLIENT_ID`
2. Restart dev server: `npm run dev`
3. Re-authenticate

#### **Cause D: Spotify App Configuration**

**Symptoms:**

- Random 401 errors
- Authentication sometimes works

**Solution:**

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Check your app settings:
   - **Redirect URIs**: Must include `http://localhost:5174/` (or whatever port Vite is using)
   - **App Type**: Web Application
3. Save changes and re-authenticate

---

## 🔬 Manual Testing Instructions

Open browser console and run these tests:

### **Test 1: Check Stored Tokens**

```javascript
console.log("=== TOKEN INSPECTION ===");
console.log("Access Token:", localStorage.getItem("access_token"));
console.log("Refresh Token:", localStorage.getItem("refresh_token"));
console.log("Expires:", localStorage.getItem("expires"));
console.log("Current Time:", new Date().toISOString());
```

### **Test 2: Direct API Call**

```javascript
const token = localStorage.getItem("access_token");
fetch("https://api.spotify.com/v1/me", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((response) => {
    console.log("Profile API Status:", response.status);
    return response.json();
  })
  .then((data) => console.log("Profile Data:", data))
  .catch((error) => console.error("Profile Error:", error));
```

### **Test 3: Player API Call**

```javascript
const token = localStorage.getItem("access_token");
fetch("https://api.spotify.com/v1/me/player", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((response) => {
    console.log("Player API Status:", response.status);
    if (response.status === 204) {
      console.log("No active device - this is normal");
      return null;
    }
    return response.json();
  })
  .then((data) => console.log("Player Data:", data))
  .catch((error) => console.error("Player Error:", error));
```

---

## 🎯 Expected Responses

### **Profile API (`/me`)**

- **200 + Data**: ✅ Authentication working
- **401**: ❌ Token/authentication issue

### **Player API (`/me/player`)**

- **200 + Data**: ✅ Active playback found
- **204 No Content**: ✅ No active device (normal)
- **401**: ❌ Missing playback permissions
- **403**: ❌ Non-premium account

### **Currently Playing (`/me/player/currently-playing`)**

- **200 + Data**: ✅ Track currently playing
- **204 No Content**: ✅ Nothing playing (normal)
- **401**: ❌ Missing permissions

---

## 🚀 Quick Fix Checklist

1. **✅ Check .env file**: Correct `VITE_CLIENT_ID`
2. **✅ Restart server**: `npm run dev`
3. **✅ Re-authenticate**: Click "Re-authenticate" button
4. **✅ Grant all permissions**: Don't skip any scopes in Spotify dialog
5. **✅ Test endpoints**: Use debugging buttons
6. **✅ Check console**: Look for detailed error logs
7. **✅ Verify premium**: Player APIs require Spotify Premium

---

## 🔧 Advanced Debugging

### **Network Tab Analysis**

1. Open browser DevTools → Network tab
2. Click "Test Player API" button
3. Look for the API request:
   - **Request Headers**: Should include `Authorization: Bearer ...`
   - **Response**: Note status code and response body

### **Token Validation**

The new `useAuthToken` hook includes:

- **Automatic expiration checking**
- **Background token refresh**
- **Error state management**
- **Real-time validation**

### **Console Logging**

Enhanced logging shows:

- **Token operations**: Refresh attempts, errors
- **API calls**: Request/response details
- **Authentication flow**: Step-by-step process
- **Error context**: Detailed error information

---

## 📱 Device & Premium Requirements

**For `/me/player` endpoints to work:**

1. **✅ Spotify Premium Account**: Required for playbook control
2. **✅ Active Spotify Client**: One of these must be running:
   - Spotify Desktop App
   - Spotify Mobile App
   - Spotify Web Player (open.spotify.com)
3. **✅ Device Available**: Must appear in Spotify Connect devices list

**Free accounts can use:**

- Search endpoints
- User profile
- Library management (saved tracks/albums)
- Browse/recommendations

---

## 🆘 Still Having Issues?

If you're still getting 401 errors after following this guide:

1. **Clear all data**: Logout → Clear browser cache → Re-authenticate
2. **Check Spotify status**: [Spotify Status Page](https://status.spotify.com/)
3. **Verify app settings**: Double-check Spotify Developer Dashboard
4. **Use debugging tools**: The enhanced debugger provides detailed logs

The new implementation includes comprehensive error handling and should provide clear feedback about what's causing the 401 error!
