const axios = require('axios');
const HttpError = require('../models/http-error');

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

async function getCoordsForAddress(address) {
  let response;
  try {
    response = await axios.get(NOMINATIM_URL, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'Guidiny/1.0 (contact: chaymabaklouti59@gmail.com)',
        'Accept-Language': 'en',
      },
      timeout: 10000,
    });
  } catch (err) {
    console.error('Geocoding request failed:', err.response?.status, err.message);
    throw new HttpError(
      'Could not resolve that address right now, please try again.',
      502
    );
  }

  const data = response.data;

  if (!Array.isArray(data) || data.length === 0) {
    throw new HttpError(
      'Could not find location for the specified address.',
      422
    );
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

module.exports = getCoordsForAddress;