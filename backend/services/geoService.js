// Geographic and Location Resolution Service
// Uses multi-tiered resolution:
// 1. Local verified database lookup
// 2. Google Geocoding API (when configured)
// 3. OpenStreetMap Nominatim API (open data under ODbL with attribution)
// Stores only legally permitted static geographic metadata (names, coordinates, administrative hierarchy).

import { db } from '../db/database.js';

const GOOGLE_MAPS_SERVER_KEY = process.env.GOOGLE_MAPS_SERVER_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function normalizePlaceKey(str) {
  if (!str) return '';
  const lower = str.toLowerCase().trim().replace(/\s+/g, ' ');
  let cleaned = lower
    .replace(/\b(bus station|bus stand|railway station|junction|central|terminal)\b/gi, '')
    .trim();
  if (cleaned.length <= 2) {
    return lower;
  }
  return cleaned;
}

export function searchStoredLocations(query, district = '') {
  const q = String(query || '').trim().toLowerCase();
  const d = String(district || '').trim().toLowerCase();

  return db.prepare(`
    SELECT id, name, latitude, longitude, mandal, district, state, type, code
    FROM locations
    WHERE (? = '' OR LOWER(name) LIKE '%' || ? || '%' OR LOWER(mandal) LIKE '%' || ? || '%' OR LOWER(district) LIKE '%' || ? || '%')
      AND (? = '' OR LOWER(district) = ?)
    ORDER BY name
    LIMIT 50
  `).all(q, q, q, q, d, d);
}

export async function resolveLocation(query, originCoordinates = null) {
  const rawQuery = String(query || '').trim();
  const isExplicitCurrentLocation = /^(?:📍\s*)?(?:my\s+)?current\s+location$/i.test(rawQuery);

  // Strict Rule: ONLY return CURRENT_GPS_LOCATION when the query explicitly specifies "Current Location"
  if (isExplicitCurrentLocation && originCoordinates) {
    return {
      id: 'current-gps-location',
      name: '📍 Current Location',
      latitude: originCoordinates.latitude,
      longitude: originCoordinates.longitude,
      mandal: '',
      district: '',
      state: '',
      type: 'CURRENT_GPS_LOCATION',
      verified: 1,
      source: 'device_gps'
    };
  }

  if (!rawQuery) return null;
  const normalized = rawQuery.toLowerCase();
  const strippedKey = normalizePlaceKey(rawQuery);

  // 1. Check local verified database
  const localMatch = db.prepare(`
    SELECT * FROM locations
    WHERE LOWER(name) = ? OR id = ? OR LOWER(code) = ?
    LIMIT 1
  `).get(normalized, normalized, normalized);

  if (localMatch) {
    return localMatch;
  }

  // Check loose / partial matches in local database
  const looseMatch = db.prepare(`
    SELECT * FROM locations
    WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ?
    LIMIT 1
  `).get(`${normalized}%`, `%${strippedKey}%`);

  if (looseMatch && strippedKey.length >= 3) {
    return looseMatch;
  }

  // 2. Query Google Maps Geocoding API if key is present
  if (GOOGLE_MAPS_SERVER_KEY) {
    try {
      const googleLoc = await geocodeWithGoogle(rawQuery);
      if (googleLoc) {
        saveDiscoveredLocation(googleLoc);
        return googleLoc;
      }
    } catch (e) {
      console.warn('Google Geocoding failed:', e.message);
    }
  }

  // 3. Query OpenStreetMap Nominatim API (Permitted Open Data under ODbL)
  try {
    const osmLoc = await geocodeWithNominatim(rawQuery);
    if (osmLoc) {
      saveDiscoveredLocation(osmLoc);
      return osmLoc;
    }
  } catch (e) {
    console.warn('OSM Nominatim Geocoding failed:', e.message);
  }

  return null;
}

async function geocodeWithGoogle(address) {
  const params = new URLSearchParams({
    address: `${address}, India`,
    key: GOOGLE_MAPS_SERVER_KEY
  });
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
  const data = await response.json();
  if (!response.ok || data.status !== 'OK' || !data.results?.[0]) return null;

  const result = data.results[0];
  const loc = result.geometry?.location;
  if (!loc) return null;

  const comps = result.address_components || [];
  const getComp = (type) => comps.find(c => c.types.includes(type))?.long_name || null;

  const name = result.formatted_address.split(',')[0].trim() || address;
  const district = getComp('administrative_area_level_2');
  const state = getComp('administrative_area_level_1') || 'Andhra Pradesh';
  const mandal = getComp('administrative_area_level_3') || district;
  const types = result.types || [];

  let type = 'village';
  if (types.includes('locality') || types.includes('administrative_area_level_2')) type = 'city';
  else if (types.includes('administrative_area_level_3') || types.includes('sublocality')) type = 'town';
  else if (types.includes('transit_station') || types.includes('bus_station')) type = 'bus';
  else if (types.includes('train_station')) type = 'station';

  return {
    id: address.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: name,
    latitude: loc.lat,
    longitude: loc.lng,
    mandal,
    district,
    state,
    type,
    code: null,
    source: 'google_geocoding',
    verified: 1
  };
}

async function geocodeWithNominatim(address) {
  const params = new URLSearchParams({
    q: `${address}, India`,
    format: 'json',
    addressdetails: '1',
    limit: '1',
    countrycodes: 'in'
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      'User-Agent': 'RouteConnect-Planner/2.0 (open-transit-data@routeconnect.local)'
    },
    signal: AbortSignal.timeout(6000)
  });

  if (!response.ok) return null;
  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) return null;

  const res = results[0];
  const lat = parseFloat(res.lat);
  const lon = parseFloat(res.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const addr = res.address || {};
  const placeName = addr.village || addr.town || addr.city || addr.suburb || addr.hamlet || res.name || address;
  const district = addr.county || addr.state_district || null;
  const state = addr.state || 'Andhra Pradesh';
  const mandal = addr.taluk || addr.tehsil || addr.subdistrict || district;

  let type = 'village';
  if (addr.city) type = 'city';
  else if (addr.town) type = 'town';
  else if (res.type === 'station' || res.category === 'railway') type = 'station';
  else if (res.type === 'bus_stop' || res.type === 'bus_station') type = 'bus';

  return {
    id: address.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: placeName,
    latitude: lat,
    longitude: lon,
    mandal,
    district,
    state,
    type,
    code: null,
    source: 'osm_nominatim',
    verified: 1
  };
}

function saveDiscoveredLocation(loc) {
  try {
    db.prepare(`
      INSERT OR IGNORE INTO locations (id, name, latitude, longitude, mandal, district, state, type, code, source, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      loc.id,
      loc.name,
      loc.latitude,
      loc.longitude,
      loc.mandal || null,
      loc.district || null,
      loc.state || null,
      loc.type,
      loc.code || null,
      loc.source,
      1
    );
  } catch (e) {
    // Ignore duplicate or unique constraint errors
  }
}

export async function reverseGeocode(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return { name: 'Current Location', address: 'Unknown Location', latitude: lat, longitude: lon };
  }

  // 1. Try reverse geocoding with OpenStreetMap Nominatim
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      format: 'json',
      addressdetails: '1'
    });
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      headers: {
        'User-Agent': 'RouteConnect-Planner/2.0 (open-transit-data@routeconnect.local)'
      },
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const place = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city || addr.hamlet || data.name;
      const district = addr.county || addr.state_district || addr.state;
      if (place) {
        return {
          name: place,
          address: `${place}${district ? `, ${district}` : ''}`,
          display: data.display_name,
          latitude: lat,
          longitude: lon
        };
      }
    }
  } catch (err) {
    // Ignore and fallback to local DB lookup
  }

  // 2. Query nearest location from local verified database
  try {
    const allLocs = db.prepare('SELECT name, mandal, district, state, latitude, longitude FROM locations').all();
    let best = null;
    let minD = Infinity;
    for (const loc of allLocs) {
      const d = getDistance(lat, lon, loc.latitude, loc.longitude);
      if (d < minD) {
        minD = d;
        best = loc;
      }
    }
    if (best && minD < 20) { // within 20 km
      return {
        name: best.name,
        address: `${best.name}, ${best.district || best.state || 'Andhra Pradesh'}`,
        latitude: lat,
        longitude: lon
      };
    }
  } catch (err) {
    // Ignore
  }

  return {
    name: 'Current Location',
    address: `Current Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
    latitude: lat,
    longitude: lon
  };
}
