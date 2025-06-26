// src/API/geocodeRoutes.js
const express = require('express');
const router = express.Router();

const GOOGLE_API_KEY = 'AIzaSyCVdsExOdchWIspVTLcCOgScugWBmgBllw';

// GET /geocode/geocode?address=...
router.get('/geocode', async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'Missing address' });

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
  console.log('Geocode URL:', url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Google Response:', data);
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch geocode' });
  }
});

// GET /geocode/distance?origin=...&destination=...&mode=driving
router.get('/distance', async (req, res) => {
  const { origin, destination, mode = 'driving' } = req.query;
  if (!origin || !destination)
    return res.status(400).json({ error: 'Missing origin or destination' });

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=${mode}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch distance' });
  }
});
// GET /geocode/directions?origin=...&destination=...&mode=driving
router.get('/directions', async (req, res) => {
  const { origin, destination, mode = 'driving' } = req.query;
  if (!origin || !destination)
    return res.status(400).json({ error: 'Missing origin or destination' });

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Directions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch directions' });
  }
});

module.exports = router;
