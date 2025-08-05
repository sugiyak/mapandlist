# Map and List

A React-based web application that helps users find nearby places and calculate multiple routes to get there. Built with Google Maps API integration for comprehensive location services.

## Features

- **Interactive Map**: Google Maps integration with custom markers and route visualization
- **Smart Search**: Dual search functionality for origin/destination with autocomplete
- **Route Calculation**: Automatic distance and duration calculations between points
- **Place Discovery**: Find nearby places with detailed information including ratings
- **Responsive Design**: Bootstrap-styled interface that works across devices
- **Location Services**: Automatic user location detection with fallback options

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Google Maps API key with Places API enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mapandlist
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```
REACT_APP_API_KEY=your_google_maps_api_key
REACT_APP_GA_TRACKING_ID=your_google_analytics_id
```

### Development

Start the development server:
```bash
npm run dev
```

The application will open at [http://localhost:3000](http://localhost:3000).

### Production

Build the application for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server (serves built files)
- `npm run build` - Build for production
- `npm test` - Run tests in watch mode

## Architecture

### Core Components

- **Home** (`src/home.js`) - Main application container handling Google Maps API loading, geolocation, and analytics
- **Map** (`src/components/map.js`) - Google Maps rendering with markers and route visualization
- **SearchBox** (`src/components/searchBox.js`) - Search functionality with autocomplete and direction calculation
- **PlaceTable** (`src/components/table.js`) - Results display with place details and calculated metrics

### Key Technologies

- React 18 with hooks for state management
- Google Maps JavaScript API with Places library
- React Bootstrap for UI components
- Google Analytics for user tracking
- React Cookie Consent for privacy compliance

### API Integration

The application integrates with Google Maps APIs:
- **Maps JavaScript API** - Core map functionality
- **Places API** - Location search and autocomplete
- **Directions API** - Route calculation with rate limiting (700ms intervals)

## Environment Variables

Required environment variables:

- `REACT_APP_API_KEY` - Google Maps API key
- `REACT_APP_GA_TRACKING_ID` - Google Analytics tracking ID (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.