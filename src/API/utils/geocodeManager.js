// const fetch = require('node-fetch');

const GOOGLE_API_KEY = 'AIzaSyCVdsExOdchWIspVTLcCOgScugWBmgBllw';

// פונקציה לקבלת קואורדינטות מכתובת
async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'OK' && data.results.length > 0) {
    return data.results[0].geometry.location;
  } else {
    throw new Error("Failed to geocode address");
  }
}

// פונקציה לקבלת כתובת לפי קואורדינטות
async function reverseGeocode(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log("Google reverse geocode response:", data);

  if (data.status === 'OK' && data.results.length > 0) {
    return data.results[0].formatted_address;
  } else {
    throw new Error("Failed to reverse geocode coordinates");
  }
}

module.exports = {
  geocodeAddress,
  reverseGeocode,
};
