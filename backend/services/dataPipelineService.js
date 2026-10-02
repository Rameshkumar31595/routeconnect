// Route Connect Multi-Modal Transportation Data Pipeline
// Orchestrates permitted and authoritative data collection across:
// 1. Google Maps Platform (Directions, Geocoding, Places) with strict TOS compliance (Place IDs only, no permanent map geometry storage)
// 2. Official State Road Transport Corporation (APSRTC / TSRTC) bus network & stage timetables
// 3. Official Indian Railways timetable & running days verification
// 4. OpenStreetMap Overpass & Nominatim open transit infrastructure (ODbL)
// 5. Data validation, deduplication, and estimation transparency

import { resolveLocation, getDistance, normalizePlaceKey } from './geoService.js';
import { fetchNearbyOsmStops } from './osmTransitService.js';
import { findDirectBusRoutes, findMultiStageBusRoutes, findRuralFeederBus } from './busService.js';
import { findDirectTrains, findConnectingTrains, isTrainRunningOnDate } from './railwayService.js';
import { requestGoogleRoute, decodeGooglePolyline } from './googleMapsService.js';

export async function verifyLocationExists(query, originCoordinates = null) {
  if (originCoordinates) {
    return {
      id: 'current-gps-location',
      name: '📍 Current Location',
      latitude: originCoordinates.latitude,
      longitude: originCoordinates.longitude,
      type: 'CURRENT_GPS_LOCATION',
      verified: 1,
      source: 'device_gps'
    };
  }

  const loc = await resolveLocation(query);
  if (!loc) {
    return null;
  }

  return {
    ...loc,
    verified: 1
  };
}

export async function discoverTransportInfrastructure(location, radiusMeters = 3500) {
  if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
    return [];
  }

  try {
    const stops = await fetchNearbyOsmStops(location.latitude, location.longitude, radiusMeters);
    return stops;
  } catch (err) {
    console.warn('Transport infrastructure discovery error:', err.message);
    return [];
  }
}

export function validateRouteIntegrity(route, fromLoc, toLoc) {
  if (!route || !route.segments || route.segments.length === 0) return false;

  const directDist = getDistance(fromLoc.latitude, fromLoc.longitude, toLoc.latitude, toLoc.longitude);
  const routeDist = route.distanceKm || route.segments.reduce((acc, s) => acc + (s.distanceKm || 0), 0);

  // 1. Flights are strictly prohibited for short/medium journeys (< 350 km)
  const hasFlight = route.segments.some(s => s.mode === 'flight');
  if (hasFlight) {
    if (directDist < 350) return false;
    if (routeDist > directDist * 1.6) return false;
    return true;
  }

  // 2. Minimum distance coverage: Route must cover at least 65% of straight-line distance
  // (Prevents broken walking-only or single-hop routes when traveling between distant cities)
  if (directDist >= 15 && routeDist < directDist * 0.65) {
    return false;
  }

  // 3. Maximum detour limit: Ground routes must not exceed 2.2x direct distance or +65 km
  if (directDist >= 15 && routeDist > Math.max(directDist * 2.2, directDist + 65)) {
    return false;
  }

  // 4. Check if segments flow logically and connect physically
  for (let i = 1; i < route.segments.length; i++) {
    const prev = route.segments[i - 1];
    const curr = route.segments[i];

    // Check circular bounce
    if (prev.from.toLowerCase() === curr.to.toLowerCase() && prev.to.toLowerCase() === curr.from.toLowerCase()) {
      return false;
    }

    // Physical connection check between adjacent segments:
    // If destination of previous segment does not match origin of current segment,
    // they must at least share the same town/city name or be within walkable/transfer distance.
    const normPrevTo = normalizePlaceKey(prev.to || '');
    const normCurrFrom = normalizePlaceKey(curr.from || '');
    if (normPrevTo !== normCurrFrom) {
      // Extract base city/town keywords (e.g. "narasaraopet", "ongole", "guntur", "chilakaluripeta")
      const prevTown = normPrevTo.replace(/\s*(bus\s*(station|stand|stop)|railway\s*station|station|junction|airport)/gi, '').trim();
      const currTown = normCurrFrom.replace(/\s*(bus\s*(station|stand|stop)|railway\s*station|station|junction|airport)/gi, '').trim();
      
      if (prevTown && currTown && prevTown !== currTown && !prevTown.includes(currTown) && !currTown.includes(prevTown)) {
        // Disconnected jump across different towns with no transit link!
        return false;
      }
    }
  }

  // 5. Origin and Destination Relevance
  const firstSeg = route.segments[0];
  const lastSeg = route.segments[route.segments.length - 1];
  const normFrom = normalizePlaceKey(fromLoc.name || '');
  const normTo = normalizePlaceKey(toLoc.name || '');
  const normFirstFrom = normalizePlaceKey(firstSeg.from || '');
  const normLastTo = normalizePlaceKey(lastSeg.to || '');

  const fromTown = normFrom.replace(/\s*(bus\s*(station|stand|stop)|railway\s*station|station|junction)/gi, '').trim();
  const toTown = normTo.replace(/\s*(bus\s*(station|stand|stop)|railway\s*station|station|junction)/gi, '').trim();
  const firstTown = normFirstFrom.replace(/\s*(bus\s*(station|stand|stop)|railway\s*station|station|junction)/gi, '').trim();
  const lastTown = normLastTo.replace(/\s*(bus\s*(station|stand|stop)|railway\s*station|station|junction)/gi, '').trim();

  if (fromTown && firstTown && fromTown !== firstTown && !firstTown.includes(fromTown) && !fromTown.includes(firstTown)) {
    // Route doesn't start at or near origin town!
    if (directDist > 15) return false;
  }

  if (toTown && lastTown && toTown !== lastTown && !lastTown.includes(toTown) && !toTown.includes(lastTown)) {
    // Route doesn't end at or near destination town!
    if (directDist > 15) return false;
  }

  // If first segment is walking from origin, the subsequent transit segment MUST board in origin town/area
  if (route.segments.length > 1 && route.segments[0].mode === 'walking') {
    const nextSeg = route.segments[1];
    const normNextFrom = normalizePlaceKey(nextSeg.from || '').replace(/\s*(bus\s*(station|stand|stop)|railway\s*station|station|junction|airport)/gi, '').trim();
    if (fromTown && normNextFrom && fromTown !== normNextFrom && !normNextFrom.includes(fromTown) && !fromTown.includes(normNextFrom)) {
      return false;
    }
  }

  // If last segment is walking to destination, the previous transit segment MUST arrive in destination town/area
  if (route.segments.length > 1 && route.segments[route.segments.length - 1].mode === 'walking') {
    const prevSeg = route.segments[route.segments.length - 2];
    const normPrevTo = normalizePlaceKey(prevSeg.to || '').replace(/\s*(bus\s*(station|stand|stop)|railway\s*station|station|junction|airport)/gi, '').trim();
    if (toTown && normPrevTo && toTown !== normPrevTo && !normPrevTo.includes(toTown) && !toTown.includes(normPrevTo)) {
      return false;
    }
  }

  return true;
}

export function removeDuplicateTrajectories(routes) {
  const seenSignatures = new Set();
  const clean = [];

  for (const r of routes) {
    const sig = r.segments
      .map(s => `${s.mode}:${s.provider}:${s.from.toLowerCase()}->${s.to.toLowerCase()}`)
      .join('|');

    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      clean.push(r);
    }
  }

  return clean;
}

export function auditAndFlagRouteData(route) {
  const auditedSegments = route.segments.map(seg => {
    // If estimated, provide clear notice
    if (seg.estimated && !seg.estimatedNote) {
      return {
        ...seg,
        estimated: true,
        estimatedNote: 'Estimated local transit link based on regional network schedule frequency.'
      };
    }
    return seg;
  });

  return {
    ...route,
    segments: auditedSegments
  };
}

export async function executeDataPipeline({ from, to, date, timeStr, passengers, originCoordinates }) {
  const pipelineLog = {
    startedAt: new Date().toISOString(),
    dataSourcesConsulted: [],
    validationNotes: []
  };

  // Stage 1: Location Verification (Requirement 8)
  const [fromLoc, toLoc] = await Promise.all([
    verifyLocationExists(from, originCoordinates),
    verifyLocationExists(to)
  ]);

  if (!fromLoc) {
    throw new Error(`Location "${from}" could not be verified in regional transit network.`);
  }
  if (!toLoc) {
    throw new Error(`Location "${to}" could not be verified in regional transit network.`);
  }

  pipelineLog.dataSourcesConsulted.push('Verified Geographic Locations (Local DB / Google / OSM Nominatim)');

  // Stage 2: Open Transit Infrastructure Discovery (Requirement 1 & 5)
  const [originInfrastructure, destInfrastructure] = await Promise.all([
    discoverTransportInfrastructure(fromLoc),
    discoverTransportInfrastructure(toLoc)
  ]);

  if (originInfrastructure.length > 0 || destInfrastructure.length > 0) {
    pipelineLog.dataSourcesConsulted.push('OpenStreetMap Overpass (Permitted Transit Infrastructure ODbL)');
  }

  // Stage 3: Official Railway Timetable & Operating Days (Requirement 3 & 8)
  const directTrains = findDirectTrains(fromLoc.name, toLoc.name, passengers);
  const connectingTrains = findConnectingTrains(fromLoc.name, toLoc.name, passengers, date);
  if (directTrains.length > 0 || connectingTrains.length > 0) {
    pipelineLog.dataSourcesConsulted.push('Indian Railways Timetables & South Central Railway Halts');
  }

  // Stage 4: Official State RTC Bus Data & Multi-Stage Chaining (Requirement 2 & 8)
  const directBuses = findDirectBusRoutes(fromLoc.name, toLoc.name, passengers);
  const multiStageBuses = findMultiStageBusRoutes(fromLoc.name, toLoc.name, passengers);
  if (directBuses.length > 0 || multiStageBuses.length > 0) {
    pipelineLog.dataSourcesConsulted.push('State Road Transport Corporation (APSRTC Timetables & Stage Fares)');
  }

  return {
    fromLoc,
    toLoc,
    originInfrastructure,
    destInfrastructure,
    directTrains,
    connectingTrains,
    directBuses,
    multiStageBuses,
    pipelineLog
  };
}
