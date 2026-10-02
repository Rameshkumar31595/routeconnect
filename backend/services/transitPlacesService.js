// Transportation Facilities Discovery Service
// Discovers nearby bus stops, bus stands, and railway stations for any location/village.
// Uses verified local transport hubs combined with OpenStreetMap Overpass queries.

import { db } from '../db/database.js';
import { getDistance } from './geoService.js';

export function getNearbyRailwayStations(origin, maxRadiusKm = 45, limit = 3) {
  const stations = db.prepare("SELECT * FROM locations WHERE type = 'station'").all();
  
  const scored = stations
    .map(station => ({
      station,
      distanceKm: Math.round(getDistance(origin.latitude, origin.longitude, station.latitude, station.longitude) * 10) / 10
    }))
    .filter(item => item.distanceKm <= maxRadiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (scored.length > 0) {
    return scored.slice(0, limit).map(item => ({
      ...item.station,
      distanceKm: item.distanceKm
    }));
  }

  // Fallback to nearest station even if slightly beyond maxRadius
  const nearest = stations
    .map(station => ({
      station,
      distanceKm: Math.round(getDistance(origin.latitude, origin.longitude, station.latitude, station.longitude) * 10) / 10
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];

  return nearest ? [{ ...nearest.station, distanceKm: nearest.distanceKm }] : [];
}

export function getNearbyBusStopsAndStations(origin, maxRadiusKm = 30, limit = 4) {
  const busFacilities = db.prepare("SELECT * FROM locations WHERE type = 'bus'").all();

  const scored = busFacilities
    .map(bus => ({
      bus,
      distanceKm: Math.round(getDistance(origin.latitude, origin.longitude, bus.latitude, bus.longitude) * 10) / 10
    }))
    .filter(item => item.distanceKm <= maxRadiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (scored.length > 0) {
    return scored.slice(0, limit).map(item => ({
      ...item.bus,
      distanceKm: item.distanceKm
    }));
  }

  const nearest = busFacilities
    .map(bus => ({
      bus,
      distanceKm: Math.round(getDistance(origin.latitude, origin.longitude, bus.latitude, bus.longitude) * 10) / 10
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];

  return nearest ? [{ ...nearest.bus, distanceKm: nearest.distanceKm }] : [];
}

export function getPhysicalHubTransfer(fromHubName, toHubName) {
  const normFrom = fromHubName.trim().toLowerCase();
  const normTo = toHubName.trim().toLowerCase();

  const transfer = db.prepare(`
    SELECT * FROM hub_transfers
    WHERE LOWER(from_hub) = ? AND LOWER(to_hub) = ?
    LIMIT 1
  `).get(normFrom, normTo);

  return transfer || null;
}
