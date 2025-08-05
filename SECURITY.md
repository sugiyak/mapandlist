# Security Implementation

## Google Maps API Key Security

This application implements a secure architecture to protect Google Maps API keys from exposure and abuse.

### Architecture Overview

**Before (Insecure):**
- Single API key exposed in frontend JavaScript
- All API calls made directly from browser
- Key visible in network requests and bundled code
- Vulnerable to quota exhaustion and billing abuse

**After (Secure):**
- Dual API key strategy with Netlify Functions proxy
- Sensitive API calls moved to server-side
- Frontend key restricted to domain and map display only
- Backend key secured in environment variables

### Implementation Details

#### Frontend API Key
- **Purpose**: Map display only
- **Restrictions**: 
  - HTTP referrer restriction to your domain
  - Only Maps JavaScript API enabled
  - Places, Directions, and Geocoding APIs disabled
- **Exposure**: Still visible in frontend (acceptable for restricted key)

#### Backend API Key  
- **Purpose**: Places, Directions, and Geocoding API calls
- **Security**: Stored in Netlify environment variables
- **Access**: Server-side only via Netlify Functions
- **APIs Enabled**: Places API, Directions API, Geocoding API

### Netlify Functions

#### `/netlify/functions/places-search`
- Proxies Google Places API nearby search
- Validates input parameters
- Rate limiting preserved (server-side)
- Returns JSON response to frontend

#### `/netlify/functions/directions`
- Proxies Google Directions API
- Supports all travel modes (DRIVING, WALKING, BICYCLING, TRANSIT)
- Handles origin/destination validation
- Returns route data with distance/duration

#### `/netlify/functions/geocode`
- Proxies Google Geocoding API
- Converts addresses to coordinates
- Used for origin/destination input processing

### Security Benefits

1. **Key Protection**: Backend API key never exposed to clients
2. **Request Validation**: Server-side parameter validation and sanitation  
3. **Rate Limiting**: Maintained at server level
4. **Cost Control**: Server can implement additional usage limits
5. **Monitoring**: Centralized logging of API usage
6. **Domain Restriction**: Frontend key limited to specific domains

### Setup Instructions

1. **Create Two API Keys in Google Cloud Console:**
   - **Frontend Key**: Restrict to HTTP referrers (your domain)
   - **Backend Key**: No restrictions (server-side use only)

2. **Configure Frontend Key:**
   ```
   Application restrictions: HTTP referrers
   Website restrictions: Add your domain(s)
   API restrictions: Maps JavaScript API only
   ```

3. **Configure Backend Key:**
   ```
   Application restrictions: None
   API restrictions: Places API, Directions API, Geocoding API
   ```

4. **Environment Variables:**
   ```bash
   # .env (frontend)
   REACT_APP_API_KEY=your_restricted_frontend_key
   
   # Netlify environment variables (backend)
   GOOGLE_MAPS_API_KEY=your_unrestricted_backend_key
   ```

### Monitoring and Alerts

Recommended Google Cloud Console settings:
- Enable billing alerts
- Set daily/monthly quotas
- Monitor API usage by key
- Set up alerts for unusual usage patterns

This architecture significantly reduces security risks while maintaining full functionality.