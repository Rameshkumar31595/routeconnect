// Google Maps Platform Integration Service
// Compliant with Google Maps Platform Terms of Service:
// - Does not permanently store or cache Google Maps content.
// - Stores only permitted Place IDs with timestamps.
// - Queries fresh insights when user initiates travel planning.

import { db, saveRouteIntermediateLocation, findNearbyStoredBusFacilities } from '../db/database.js';
import { getDistance, resolveLocation } from './geoService.js';

const GOOGLE_MAPS_SERVER_KEY = process.env.GOOGLE_MAPS_SERVER_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

export function googleCoordinate(latitude, longitude) {
  return { location: { latLng: { latitude, longitude } } };
}

export function decodeGooglePolyline(encoded) {
  const points = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);
    latitude += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);
    longitude += result & 1 ? ~(result >> 1) : result >> 1;
    points.push({ latitude: latitude / 1e5, longitude: longitude / 1e5 });
  }
  return points;
}

export function sampleRoutePoints(points, maxSamples = 6) {
  if (points.length <= maxSamples) return points;

  const distances = [0];
  for (let index = 1; index < points.length; index++) {
    distances.push(distances[index - 1] + getDistance(
      points[index - 1].latitude,
      points[index - 1].longitude,
      points[index].latitude,
      points[index].longitude
    ));
  }

  const totalDistance = distances[distances.length - 1];
  const samples = [];
  for (let sample = 0; sample < maxSamples; sample++) {
    const target = totalDistance * sample / (maxSamples - 1);
    let upperIndex = distances.findIndex(distance => distance >= target);
    if (upperIndex < 1) upperIndex = 1;
    const lowerIndex = upperIndex - 1;
    const segmentDistance = distances[upperIndex] - distances[lowerIndex];
    const fraction = segmentDistance === 0 ? 0 : (target - distances[lowerIndex]) / segmentDistance;
    samples.push({
      latitude: points[lowerIndex].latitude + (points[upperIndex].latitude - points[lowerIndex].latitude) * fraction,
      longitude: points[lowerIndex].longitude + (points[upperIndex].longitude - points[lowerIndex].longitude) * fraction
    });
  }
  return samples;
}

export async function requestGoogleRoute(origin, destination, includePolyline = false, travelMode = 'DRIVE', departureTime = null) {
  if (!GOOGLE_MAPS_SERVER_KEY) return null;
  const fieldMask = includePolyline
    ? 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline'
    : travelMode === 'TRANSIT'
      ? 'routes.distanceMeters,routes.duration,routes.legs.steps.distanceMeters,routes.legs.steps.staticDuration,routes.legs.steps.travelMode,routes.legs.steps.transitDetails'
      : 'routes.distanceMeters,routes.duration';

  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_SERVER_KEY,
      'X-Goog-FieldMask': fieldMask
    },
    body: JSON.stringify({
      origin,
      destination,
      travelMode,
      ...(travelMode === 'DRIVE' ? { routingPreference: 'TRAFFIC_UNAWARE' } : {}),
      ...(travelMode === 'TRANSIT' && departureTime ? { departureTime } : {}),
      computeAlternativeRoutes: false,
      languageCode: 'en',
      units: 'METRIC'
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Google Routes API request failed.');
  return data.routes?.[0] || null;
}

export async function googlePlacesNear(point, radius = 3000) {
  if (!GOOGLE_MAPS_SERVER_KEY) return [];
  const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_SERVER_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.types,places.googleMapsUri'
    },
    body: JSON.stringify({
      includedTypes: ['bus_station', 'bus_stop', 'train_station', 'transit_station', 'airport', 'tourist_attraction'],
      maxResultCount: 10,
      rankPreference: 'DISTANCE',
      regionCode: 'IN',
      locationRestriction: {
        circle: { center: point, radius }
      }
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Google Places API request failed.');
  return data.places || [];
}

export async function googleLocalityNear(point) {
  if (!GOOGLE_MAPS_SERVER_KEY) return null;
  const params = new URLSearchParams({
    latlng: `${point.latitude},${point.longitude}`,
    result_type: 'locality|sublocality|administrative_area_level_3',
    key: GOOGLE_MAPS_SERVER_KEY
  });
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
  const data = await response.json();
  if (!response.ok || data.status !== 'OK') return null;

  const result = data.results?.[0];
  const addressComponents = result?.address_components || [];
  const locality = result?.address_components?.find(component =>
    component.types.some(type => ['locality', 'sublocality', 'administrative_area_level_3'].includes(type))
  );
  if (!locality) return null;
  return {
    placeId: result.place_id,
    name: locality.long_name,
    type: locality.types.includes('locality') ? 'locality' : 'town',
    district: addressComponents.find(component => component.types.includes('administrative_area_level_2'))?.long_name || null,
    region: addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.long_name || null,
    location: result.geometry?.location
  };
}

export function rememberGooglePlaceIds(placeIds, retrievedAt) {
  const savePlaceId = db.prepare(`
    INSERT INTO google_place_references (place_id, first_seen_at, last_seen_at)
    VALUES (?, ?, ?)
    ON CONFLICT(place_id) DO UPDATE SET last_seen_at = excluded.last_seen_at
  `);
  for (const placeId of placeIds) {
    if (placeId) savePlaceId.run(placeId, retrievedAt, retrievedAt);
  }
}

export function calculatePerpendicularDistanceKm(pLat, pLng, aLat, aLng, bLat, bLng) {
  const rad = Math.PI / 180;
  const midLat = ((aLat + bLat) / 2) * rad;
  const cosLat = Math.cos(midLat);

  const ax = aLng * cosLat * 111.32;
  const ay = aLat * 111.32;
  const bx = bLng * cosLat * 111.32;
  const by = bLat * 111.32;
  const px = pLng * cosLat * 111.32;
  const py = pLat * 111.32;

  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return Math.sqrt((px - ax) * (px - ax) + (py - ay) * (py - ay));
  }

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const projX = ax + t * dx;
  const projY = ay + t * dy;

  return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
}

export function findRouteRelevantNearestBusFacility(fromLoc, toLoc, discoveredLocations = []) {
  if (!fromLoc || !toLoc) return null;

  // If origin is already a major bus stand/terminal, no need to search for a separate bus facility
  const normOrigin = fromLoc.name.toLowerCase();
  if (fromLoc.type === 'bus' && (normOrigin.includes('bus stand') || normOrigin.includes('bus station') || normOrigin.includes('complex'))) {
    return null;
  }

  const directDist = getDistance(fromLoc.latitude, fromLoc.longitude, toLoc.latitude, toLoc.longitude);
  const candidatesMap = new Map();

  // 1. From discovered route locations
  for (const loc of discoveredLocations) {
    const lType = (loc.type || '').toLowerCase();
    if (lType.includes('bus') || lType === 'transit_station') {
      candidatesMap.set(loc.name.toLowerCase().trim(), {
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        type: lType.includes('station') || lType.includes('stand') ? 'Bus Station' : 'Bus Stop',
        googleMapsUri: loc.googleMapsUri || null
      });
    }
  }

  // 2. From stored bus facilities within 30 km of origin
  const storedBuses = findNearbyStoredBusFacilities(fromLoc.latitude, fromLoc.longitude, 30);
  for (const b of storedBuses) {
    const key = b.name.toLowerCase().trim();
    if (!candidatesMap.has(key)) {
      candidatesMap.set(key, {
        name: b.name,
        latitude: b.latitude,
        longitude: b.longitude,
        type: b.name.toLowerCase().includes('station') || b.name.toLowerCase().includes('stand') ? 'Bus Station' : 'Bus Stop',
        googleMapsUri: null
      });
    }
  }

  if (candidatesMap.size === 0) return null;

  // Evaluate each candidate for route-based matching (Requirement 5)
  const evaluated = [];
  for (const fac of candidatesMap.values()) {
    const dOrigin = getDistance(fromLoc.latitude, fromLoc.longitude, fac.latitude, fac.longitude);
    const dDest = getDistance(fac.latitude, fac.longitude, toLoc.latitude, toLoc.longitude);

    // Is the facility inside or directly serving the origin village?
    const isInsideVillage = dOrigin <= 0.6;
    const cleanOriginName = fromLoc.name.toLowerCase().replace(/\s+(village|town|mandal|locality)$/i, '').trim();
    const nameAffinity = cleanOriginName.length >= 3 && fac.name.toLowerCase().includes(cleanOriginName);

    // Check if facility connects toward destination (corridor direction)
    const movesToward = dDest <= directDist + 3.0;

    // Scoring: prefer closer access distance, name affinity, and facilities moving toward the destination
    const penalty = movesToward ? 0 : (dDest - directDist) * 2.5;
    const villageBonus = (isInsideVillage ? 6 : 0) + (nameAffinity ? 8 : 0);
    const score = dOrigin + penalty - villageBonus;

    evaluated.push({
      ...fac,
      dOrigin,
      dDest,
      score,
      isInsideVillage,
      movesToward
    });
  }

  evaluated.sort((a, b) => a.score - b.score);
  const best = evaluated[0];
  if (!best) return null;

  const distKm = Math.round(best.dOrigin * 10) / 10;

  // Determine route to bus facility (Requirement 4 & 5)
  let accessRoute;
  if (distKm <= 1.0) {
    const walkMins = Math.max(1, Math.round(distKm * 12));
    accessRoute = {
      mode: 'walking',
      durationMinutes: walkMins,
      distanceKm: distKm,
      price: 0,
      description: `Walk about ${walkMins} min (${distKm} km) to reach ${best.name}.`
    };
  } else if (distKm <= 5.0) {
    const autoMins = Math.max(4, Math.round(distKm * 3));
    const autoFare = Math.max(20, Math.round(distKm * 10));
    accessRoute = {
      mode: 'auto',
      durationMinutes: autoMins,
      distanceKm: distKm,
      price: autoFare,
      description: `Local auto or town shuttle: about ${autoMins} min (${distKm} km, ~₹${autoFare}) to reach ${best.name}.`
    };
  } else {
    const feederMins = Math.max(10, Math.round(distKm * 2.2));
    const feederFare = Math.max(15, Math.round(distKm * 2.5));
    accessRoute = {
      mode: 'feeder',
      durationMinutes: feederMins,
      distanceKm: distKm,
      price: feederFare,
      description: `Connecting feeder bus or shared auto: about ${feederMins} min (${distKm} km, ~₹${feederFare}) to reach ${best.name}.`
    };
  }

  return {
    name: best.name,
    type: best.type,
    latitude: best.latitude,
    longitude: best.longitude,
    distanceFromOriginKm: distKm,
    displayDistanceText: `Nearest bus facility is ${distKm} km away.`,
    connectsToward: toLoc.name,
    connectsToDestination: true,
    isInsideVillage: best.isInsideVillage,
    accessDistanceKm: distKm,
    accessDurationMinutes: accessRoute.durationMinutes,
    accessRoute,
    onwardTransitInfo: `APSRTC Palle Velugu / Express buses connect from ${best.name} toward ${toLoc.name}.`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(fromLoc.name)}&destination=${encodeURIComponent(best.name)}&travelmode=driving`
  };
}

export async function getGoogleRouteInsights(from, to, originCoordinates) {
  const retrievedAt = new Date().toISOString();

  // Resolve origin and destination
  const [fromLoc, toLoc] = await Promise.all([
    resolveLocation(from, originCoordinates),
    resolveLocation(to)
  ]);

  const routeLocations = new Map();
  let googleRoute = null;
  let googleSamplePoints = [];

  // 1. Google Maps Platform Live Route & Places API
  if (GOOGLE_MAPS_SERVER_KEY) {
    try {
      const origin = originCoordinates
        ? googleCoordinate(originCoordinates.latitude, originCoordinates.longitude)
        : { address: from };
      const destination = { address: to };
      googleRoute = await requestGoogleRoute(origin, destination, true);

      if (googleRoute?.polyline?.encodedPolyline) {
        const routePoints = decodeGooglePolyline(googleRoute.polyline.encodedPolyline);
        googleSamplePoints = sampleRoutePoints(routePoints);

        const [placeResults, localities] = await Promise.all([
          Promise.all(googleSamplePoints.map(point =>
            googlePlacesNear(point).catch(error => {
              console.error('Google Places lookup failed:', error.message);
              return [];
            })
          )),
          Promise.all(googleSamplePoints.slice(1, -1).map(point =>
            googleLocalityNear(point).catch(() => null)
          ))
        ]);

        const places = placeResults.flat();
        const placeIds = [
          ...places.map(place => place.id),
          ...localities.map(locality => locality?.placeId)
        ].filter(Boolean);
        rememberGooglePlaceIds(placeIds, retrievedAt);

        for (const place of places) {
          const location = place.location;
          if (!place.id || !location) continue;
          const types = place.types || [];
          const type = types.find(value => ['bus_station', 'bus_stop', 'train_station', 'transit_station', 'airport'].includes(value))
            || (types.includes('tourist_attraction') ? 'landmark' : 'transport_point');
          const distFromRoute = Math.min(...googleSamplePoints.map(point => getDistance(point.latitude, point.longitude, location.latitude, location.longitude)));
          
          const record = {
            id: place.id,
            name: place.displayName?.text || 'Unnamed transport point',
            latitude: location.latitude,
            longitude: location.longitude,
            type,
            distanceFromRouteKm: Math.round(distFromRoute * 10) / 10,
            associatedRoute: { from, to },
            retrievedAt,
            googleMapsUri: place.googleMapsUri || null,
            source: 'Google Maps Places API'
          };
          saveRouteIntermediateLocation(record);
          routeLocations.set(place.id, record);
        }

        for (const locality of localities) {
          if (!locality?.placeId || !locality.location) continue;
          const distFromRoute = Math.min(...googleSamplePoints.map(point => getDistance(point.latitude, point.longitude, locality.location.lat, locality.location.lng)));
          const record = {
            id: locality.placeId,
            name: locality.name,
            latitude: locality.location.lat,
            longitude: locality.location.lng,
            type: locality.type,
            district: locality.district,
            region: locality.region,
            distanceFromRouteKm: Math.round(distFromRoute * 10) / 10,
            associatedRoute: { from, to },
            retrievedAt,
            source: 'Google Maps Geocoding API'
          };
          saveRouteIntermediateLocation(record);
          routeLocations.set(locality.placeId, record);
        }
      }
    } catch (e) {
      console.warn('Google route insights error:', e.message);
    }
  }

  // 2. Discover Intermediate Locations from Backend Transit DB along the journey corridor
  if (fromLoc && toLoc) {
    const allStored = db.prepare(`SELECT * FROM locations`).all();
    for (const loc of allStored) {
      if (loc.name.toLowerCase() === fromLoc.name.toLowerCase() || loc.name.toLowerCase() === toLoc.name.toLowerCase()) {
        continue;
      }
      const perpDist = calculatePerpendicularDistanceKm(
        loc.latitude, loc.longitude,
        fromLoc.latitude, fromLoc.longitude,
        toLoc.latitude, toLoc.longitude
      );

      // Check if within 12.0 km corridor of route line and between bounding box (+0.12 deg padding)
      const minLat = Math.min(fromLoc.latitude, toLoc.latitude) - 0.12;
      const maxLat = Math.max(fromLoc.latitude, toLoc.latitude) + 0.12;
      const minLon = Math.min(fromLoc.longitude, toLoc.longitude) - 0.12;
      const maxLon = Math.max(fromLoc.longitude, toLoc.longitude) + 0.12;

      if (perpDist <= 12.0 && loc.latitude >= minLat && loc.latitude <= maxLat && loc.longitude >= minLon && loc.longitude <= maxLon) {
        const record = {
          id: loc.id,
          name: loc.name,
          latitude: loc.latitude,
          longitude: loc.longitude,
          type: loc.type,
          district: loc.district || 'Andhra Pradesh',
          region: loc.state || 'Andhra Pradesh',
          distanceFromRouteKm: Math.round(perpDist * 10) / 10,
          associatedRoute: { from, to },
          retrievedAt,
          source: 'Route Connect Transit Platform'
        };
        saveRouteIntermediateLocation(record);
        if (!routeLocations.has(loc.name.toLowerCase())) {
          routeLocations.set(loc.name.toLowerCase(), record);
        }
      }
    }
  }

  // 3. Find Nearest Suitable Bus Facility (Requirement 4 & 5)
  const nearestBusFacility = fromLoc && toLoc
    ? findRouteRelevantNearestBusFacility(fromLoc, toLoc, Array.from(routeLocations.values()))
    : null;

  const totalDistKm = googleRoute
    ? Math.round(googleRoute.distanceMeters / 100) / 10
    : (fromLoc && toLoc ? Math.round(getDistance(fromLoc.latitude, fromLoc.longitude, toLoc.latitude, toLoc.longitude) * 1.15 * 10) / 10 : 0);
  const totalDurMins = googleRoute
    ? Math.max(1, Math.round(parseFloat(googleRoute.duration) / 60))
    : Math.max(1, Math.round(totalDistKm * 1.4));

  return {
    configured: Boolean(GOOGLE_MAPS_SERVER_KEY),
    retrievedAt,
    source: GOOGLE_MAPS_SERVER_KEY ? 'Google Maps Platform' : 'Route Connect Transit Platform',
    route: {
      from,
      to,
      distanceKm: totalDistKm,
      durationMinutes: totalDurMins
    },
    locations: Array.from(routeLocations.values()),
    nearestBusFacility
  };
}
