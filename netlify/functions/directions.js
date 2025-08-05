// Netlify Function for Google Directions API
// This secures the API key on the server side

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    const { origin, destination, travelMode = 'DRIVING', alternatives = false } = JSON.parse(event.body);

    // Validate required parameters
    if (!origin || !destination) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Origin and destination parameters are required' }),
      };
    }

    // Validate travel mode
    const validTravelModes = ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'];
    if (!validTravelModes.includes(travelMode.toUpperCase())) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Invalid travel mode', 
          validModes: validTravelModes 
        }),
      };
    }

    // Build the Google Directions API URL
    const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
    const params = new URLSearchParams({
      origin: typeof origin === 'object' ? `${origin.lat},${origin.lng}` : origin,
      destination: typeof destination === 'object' ? `${destination.lat},${destination.lng}` : destination,
      mode: travelMode.toLowerCase(),
      alternatives: alternatives.toString(),
      key: process.env.GOOGLE_MAPS_API_KEY,
    });

    const apiUrl = `${baseUrl}?${params.toString()}`;
    
    // Make request to Google Directions API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if the Google API returned an error
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Directions API error:', data.status, data.error_message);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Google Directions API error', 
          status: data.status,
          message: data.error_message 
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Directions function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};