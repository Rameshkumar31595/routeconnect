// OpenStreetMap Overpass Transit Facility Collector
// Queries open transit infrastructure (bus stops, bus stations, railway stations, railway halts)
// under Open Database License (ODbL) with attribution.
// Persists allowed static infrastructure into transport_stops and locations tables.
// Caches dynamic responses to respect community server rate limits.

import { db } from '../db/database.js';
import { getDistance } from './geoService.js';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

export async function fetchNearbyOsmStops(latitude, longitude, radiusMeters = 3500) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return [];
  }

  const roundedLat = Math.round(latitude * 100) / 100;
  const roundedLon = Math.round(longitude * 100) / 100;
  const cacheKey = `osm_stops_${roundedLat}_${roundedLon}_${radiusMeters}`;

  // 1. Check dynamic cache (24 hours TTL)
  try {
    const cached = db.prepare(`
      SELECT payload, expires_at FROM dynamic_cache
      WHERE cache_key = ? AND expires_at > ?
    `).get(cacheKey, Date.now());

    if (cached) {
      return JSON.parse(cached.payload);
    }
  } catch (err) {
    console.warn('OSM cache read error:', err.message);
  }

  // 2. Query Overpass API with strict timeout
  const query = `
    [out:json][timeout:6];
    (
      node["highway"="bus_stop"](around:${radiusMeters},${latitude},${longitude});
      node["amenity"="bus_station"](around:${radiusMeters},${latitude},${longitude});
      node["railway"="station"](around:${radiusMeters},${latitude},${longitude});
      node["railway"="halt"](around:${radiusMeters},${latitude},${longitude});
    );
    out body 20;
  `;

  let stops = [];
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'RouteConnect-Planner/2.0 (open-transit-collector@routeconnect.local)'
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) continue;

      const data = await response.json();
      if (Array.isArray(data.elements)) {
        stops = data.elements.map(el => {
          const tags = el.tags || {};
          const isRail = Boolean(tags.railway);
          const stopName = tags.name || tags['name:en'] || tags.ref || (isRail ? 'Railway Halt' : 'Bus Stop');
          const type = isRail ? 'station' : 'bus';
          const operator = tags.operator || (isRail ? 'South Central Railway' : 'APSRTC');
          const distKm = Math.round(getDistance(latitude, longitude, el.lat, el.lon) * 10) / 10;

          return {
            stopId: `osm-node-${el.id}`,
            name: stopName,
            latitude: el.lat,
            longitude: el.lon,
            type,
            operator,
            distanceKm: distKm,
            source: 'OpenStreetMap Overpass'
          };
        });
        break; // Successfully received data
      }
    } catch (e) {
      // Try next endpoint or fallback to database
    }
  }

  // 3. Persist allowed static infrastructure into transport_stops and locations
  if (stops.length > 0) {
    const insertStop = db.prepare(`
      INSERT OR IGNORE INTO transport_stops (stop_id, name, latitude, longitude, type, location_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertLoc = db.prepare(`
      INSERT OR IGNORE INTO locations (id, name, latitude, longitude, type, source, verified)
      VALUES (?, ?, ?, ?, ?, 'osm_overpass', 1)
    `);

    for (const stop of stops) {
      try {
        insertStop.run(stop.stopId, stop.name, stop.latitude, stop.longitude, stop.type, stop.stopId);
        insertLoc.run(stop.stopId, stop.name, stop.latitude, stop.longitude, stop.type);
      } catch (e) {
        // ignore unique constraints
      }
    }

    // Save to dynamic cache
    try {
      db.prepare(`
        INSERT OR REPLACE INTO dynamic_cache (cache_key, provider, payload, expires_at, created_at)
        VALUES (?, 'OpenStreetMap', ?, ?, ?)
      `).run(cacheKey, JSON.stringify(stops), Date.now() + 24 * 3600 * 1000, Date.now());
    } catch (e) {
      // ignore
    }

    return stops;
  }

  // 4. Fallback: Query already stored transport stops within radius from local database
  try {
    const localStops = db.prepare("SELECT * FROM transport_stops").all();
    const nearbyLocal = localStops
      .map(s => ({
        stopId: s.stop_id,
        name: s.name,
        latitude: s.latitude,
        longitude: s.longitude,
        type: s.type,
        distanceKm: Math.round(getDistance(latitude, longitude, s.latitude, s.longitude) * 10) / 10,
        source: 'Route Connect Database'
      }))
      .filter(s => s.distanceKm <= (radiusMeters / 1000) * 1.5)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 10);

    return nearbyLocal;
  } catch (err) {
    return [];
  }
}
