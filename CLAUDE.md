# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `npm run dev` - Start development server (runs react-scripts start)
- `npm start` - Start production server (serves built files with serve -s build)
- `npm run build` - Build for production
- `npm test` - Run tests in watch mode
- ESLint is configured but no specific lint command is defined

## Application Architecture

This is a React-based map application that helps users find nearby places and calculate routes/distances. The application uses Google Maps API extensively.

### Key Components Structure

- **Home** (`src/home.js`) - Main application container that handles:
  - Google Maps API loading via `@react-google-maps/api`
  - User geolocation detection and permission handling
  - Google Analytics tracking integration
  - Cookie consent management

- **Map** (`src/components/map.js`) - Core map component that manages:
  - GoogleMap rendering with custom options (no default UI, non-clickable icons)
  - Marker display for user location (blue marker) and search results (numbered markers)
  - DirectionsRenderer for route visualization
  - State management for places, directions, and map bounds

- **SearchBox** (`src/components/searchBox.js`) - Complex search functionality:
  - Dual search inputs: origin/center and destination search
  - Place autocomplete using Google Places API
  - Direction calculation with rate limiting (700ms intervals between requests)
  - Travel mode selection and route optimization
  - Handles Google Maps API query limits with setTimeout intervals

- **PlaceTable** (`src/components/table.js`) - Results display:
  - Bootstrap-styled table showing place details
  - Conditionally displays distance/duration when directions are loaded
  - Shows place name, address, rating, and calculated metrics

### State Management Patterns

The app uses React useState extensively with prop drilling for state sharing:
- `userLocation` - User's current coordinates (lat/lng)
- `places` - Array of search results with enhanced data (index, latlng, distance, duration)
- `directionsLoaded` - Boolean indicating if route calculations are complete
- `directionResults` - Array of Google Maps DirectionsService responses
- `bounds` - Map viewport bounds for search optimization

### Google Maps API Integration

- Requires `REACT_APP_API_KEY` environment variable for Google Maps
- Uses libraries: `["places"]` for autocomplete functionality
- Implements custom rate limiting for direction requests (20 places max, 700ms intervals)
- Custom marker icons and route visualization options

### Environment Variables Required

- `REACT_APP_API_KEY` - Google Maps API key
- `REACT_APP_GA_TRACKING_ID` - Google Analytics tracking ID

### Notable Implementation Details

- Geolocation fallback to Seattle coordinates if permission denied
- Direction requests are batched with setTimeout to respect API rate limits
- Custom error handling for location permissions and API failures
- Commented out CSV/JSON download functionality (likely due to Google API policy concerns)
- Uses react-bootstrap for UI components and styling