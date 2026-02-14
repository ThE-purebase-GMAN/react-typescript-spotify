# 🔧 Spotify API Authentication Troubleshooting

## Issue: 401 "Permissions missing" Error

You're experiencing a 401 error when calling the Spotify API, specifically the `/me/player/currently-playing` endpoint. This typically indicates an authentication or permissions issue.

## 🔍 Troubleshooting Steps

### 1. **Check Your Setup**

1. **Verify Environment Variables:**

   ```bash
   # Check if your .env file contains:
   VITE_CLIENT_ID=your_actual_spotify_client_id
   ```

2. **Restart Development Server:**
   ```bash
   npm run dev
   ```
   Environment variables require a restart to take effect.

### 2. **Check Spotify App Configuration**

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Verify settings:
   - **Redirect URIs:** Must include `http://localhost:5173/`
   - **App Type:** Should be Web App
   - **Save** any changes

### 3. **Re-authenticate to Get Fresh Tokens**

The auth debugger has been added to your Dashboard. Use it to:

1. Click **"Show Debug Info"** - Check console for token status
2. Click **"Test Profile API"** - Test basic API access
3. Click **"Test Currently Playing"** - Test the specific endpoint
4. Click **"Re-authenticate"** - Get fresh tokens with all scopes

### 4. **Common Issues & Solutions**

#### **Issue A: Token Expired**

- **Symptom:** Had working tokens, now getting 401
- **Solution:** Click "Refresh Token" in debugger or re-authenticate

#### **Issue B: Insufficient Scopes**

- **Symptom:** Some endpoints work, others return 401
- **Solution:** Re-authenticate to get all required scopes
- **Required Scopes:**
  ```
  user-read-currently-playing
  user-read-playback-state
  user-modify-playback-state
  ```

#### **Issue C: No Active Playback**

- **Symptom:** 204 "No Content" response
- **Solution:** Start playing music on any Spotify client:
  - Spotify Desktop App
  - Spotify Mobile App
  - Spotify Web Player
  - Must have **Spotify Premium**

#### **Issue D: Wrong Client ID**

- **Symptom:** Authentication redirects but no tokens received
- **Solution:** Double-check Client ID in `.env` file

### 5. **Manual Token Validation**

Open browser console and run:

```javascript
// Check stored tokens
console.log("Access Token:", localStorage.getItem("access_token"));
console.log("Refresh Token:", localStorage.getItem("refresh_token"));
console.log("Expires:", localStorage.getItem("expires"));

// Test API manually
fetch("https://api.spotify.com/v1/me", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  },
})
  .then((r) => r.json())
  .then(console.log);
```

### 6. **Test Currently Playing Endpoint**

```javascript
// Test the specific endpoint that's failing
fetch("https://api.spotify.com/v1/me/player/currently-playing", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  },
}).then(async (response) => {
  console.log("Status:", response.status);
  if (response.status === 204) {
    console.log("No track currently playing");
  } else {
    const data = await response.json();
    console.log("Response:", data);
  }
});
```

### 7. **Premium Account Required**

**Important:** Spotify Connect APIs (playback control) require:

- ✅ **Spotify Premium subscription**
- ✅ **Active playback** on any device
- ✅ **Device available** in Spotify Connect

To test without Premium:

- Use search, browse, and library endpoints
- View track/artist/album information
- Access user profile data

### 8. **Network/CORS Issues**

If running on different port or domain:

1. Update redirect URI in Spotify app settings
2. Update `redirectUrl` in `auth.service.ts`
3. Clear browser cache and localStorage

## 🔧 Updated Features

### Automatic Token Refresh

- Tokens automatically refresh when expired
- 401 errors trigger refresh attempt
- Failed refresh redirects to login

### Enhanced Debugging

- AuthDebugger component added to Dashboard
- Console logging for token operations
- Direct API testing buttons

### Better Error Handling

- Axios interceptors handle 401s
- Detailed error logging
- Graceful fallbacks

## 🚀 Next Steps

1. **Use the Auth Debugger** in your Dashboard
2. **Re-authenticate** to ensure fresh tokens
3. **Check Console** for detailed error messages
4. **Test with Premium Account** for full functionality
5. **Start Spotify Playback** before testing player endpoints

## ⚠️ Important Notes

- The `/me/player/currently-playing` endpoint returns 204 (No Content) when nothing is playing
- This is **not an error** - it's the expected response when no track is active
- Only Premium users can use playback control endpoints
- Free users can still access search, browse, and library data

The AuthDebugger component is now available in your Dashboard to help identify and resolve authentication issues!
