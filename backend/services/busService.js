// State Road Transport Corporation (RTC) Bus Transit Service
// Provides authoritative bus routes, route numbers, service types (Palle Velugu, Express, Super Luxury),
// intermediate stop sequences, journey distance, travel time, frequency, first/last timings, and stage fares.

import { STATIC_BUS_SERVICES } from '../db/staticTransitData.js';
import { db } from '../db/database.js';
import { normalizePlaceKey, getDistance } from './geoService.js';

function matchStop(stopName, candidate) {
  if (!stopName || !candidate) return false;
  const s1 = normalizePlaceKey(stopName);
  const s2 = normalizePlaceKey(candidate);
  if (s1 === s2) return true;
  if (s1.length >= 4 && s2.length >= 4) {
    return s1.includes(s2) || s2.includes(s1);
  }
  return false;
}

export function findDirectBusRoutes(fromPlace, toPlace, passengers = 1) {
  const options = [];
  const normFrom = normalizePlaceKey(fromPlace);
  const normTo = normalizePlaceKey(toPlace);

  // 1. Search authoritative bus routes with intermediate stop sequences
  for (const bus of STATIC_BUS_SERVICES) {
    let fromIdx = -1;
    let toIdx = -1;

    for (let i = 0; i < bus.stops.length; i++) {
      const stop = bus.stops[i];
      if (fromIdx === -1 && matchStop(stop, normFrom)) {
        fromIdx = i;
      }
      if (fromIdx !== -1 && i > fromIdx && matchStop(stop, normTo)) {
        toIdx = i;
        break;
      }
    }

    if (fromIdx !== -1 && toIdx !== -1) {
      const startStop = bus.stops[fromIdx];
      const endStop = bus.stops[toIdx];
      const intermediateStops = bus.stops.slice(fromIdx + 1, toIdx);

      // Estimate distance and time proportion
      const fraction = (toIdx - fromIdx) / (bus.stops.length - 1 || 1);
      const dist = Math.max(5, Math.round(bus.distanceKm * fraction * 10) / 10);
      const durationMinutes = Math.max(15, Math.round(bus.durationMinutes * fraction));
      const fare = Math.max(15, Math.round(bus.fare * fraction));

      options.push({
        mode: 'bus',
        provider: bus.operator || 'APSRTC',
        from: startStop,
        to: endStop,
        routeNumber: bus.routeNumber,
        serviceName: bus.serviceName,
        busType: bus.serviceName,
        firstService: bus.firstService,
        lastService: bus.lastService,
        frequency: bus.frequency,
        durationMinutes,
        distanceKm: dist,
        price: fare * passengers,
        departure: bus.firstService || '07:00',
        arrival: null,
        stops: intermediateStops.join(', ') || null,
        isRuralFeeder: Boolean(bus.isRuralFeeder),
        estimated: false,
        fareAvailable: true
      });
    }
  }

  // 2. Also check segments table for seeded intercity bus links
  const segs = db.prepare(`
    SELECT * FROM segments
    WHERE mode = 'bus' AND (LOWER(from_location) LIKE ? OR LOWER(from_location) LIKE ?)
      AND (LOWER(to_location) LIKE ? OR LOWER(to_location) LIKE ?)
  `).all(`%${normFrom}%`, normFrom, `%${normTo}%`, normTo);

  for (const s of segs) {
    if (!options.some(o => o.serviceName === s.service_name && o.from === s.from_location)) {
      options.push({
        mode: 'bus',
        provider: s.operator || 'APSRTC',
        from: s.from_location,
        to: s.to_location,
        routeNumber: null,
        serviceName: s.service_name || 'Express',
        busType: s.service_name || 'Express',
        firstService: '05:00',
        lastService: '22:30',
        frequency: 'Every 30 mins',
        durationMinutes: s.duration_minutes,
        distanceKm: s.distance_km,
        price: s.price * passengers,
        departure: s.departure_time || '08:00',
        arrival: s.arrival_time || '11:00',
        stops: s.stops || null,
        isRuralFeeder: false,
        estimated: false,
        fareAvailable: true
      });
    }
  }

  return options;
}

export function findRuralFeederBus(fromLoc, toHub, passengers = 1) {
  // 1. First check if a direct route or feeder route already matches
  const directMatches = findDirectBusRoutes(fromLoc.name, toHub.name, passengers);
  const directFeeder = directMatches.find(r => r.isRuralFeeder) || directMatches[0];
  if (directFeeder) return directFeeder;

  // 2. Calculate distance between Village and Hub
  const dist = getDistance(fromLoc.latitude, fromLoc.longitude, toHub.latitude, toHub.longitude);
  if (dist > 35) return null; // Outside realistic feeder range

  const roundedDist = Math.round(dist * 10) / 10;
  const duration = Math.max(10, Math.round(dist * 2.2));
  // Official RTC rural stage fare formula: ~₹10 base + ₹1.2/km
  const fare = Math.max(15, Math.round(10 + dist * 1.25));

  return {
    mode: 'bus',
    provider: 'APSRTC Rural Feeder',
    from: fromLoc.name,
    to: toHub.name,
    routeNumber: 'PV-FEEDER',
    serviceName: 'Palle Velugu',
    busType: 'Palle Velugu',
    firstService: '05:30',
    lastService: '20:30',
    frequency: 'Every 30 mins',
    durationMinutes: duration,
    distanceKm: roundedDist,
    price: fare * passengers,
    departure: '07:15',
    arrival: null,
    stops: null,
    isRuralFeeder: true,
    estimated: true,
    estimatedNote: 'Estimated local RTC Palle Velugu feeder schedule based on state road transit network frequency.',
    fareAvailable: true
  };
}

export function findConnectingBusJourney(fromLoc, intermediateHub, destinationHub, passengers = 1) {
  const leg1 = findRuralFeederBus(fromLoc, intermediateHub, passengers);
  const leg2Matches = findDirectBusRoutes(intermediateHub.name, destinationHub.name, passengers);
  const leg2 = leg2Matches[0];

  if (!leg1 || !leg2) return null;

  const transferBufferMinutes = 15;
  const totalDuration = leg1.durationMinutes + transferBufferMinutes + leg2.durationMinutes;
  const totalPrice = leg1.price + leg2.price;
  const totalDistance = Math.round((leg1.distanceKm + leg2.distanceKm) * 10) / 10;

  return {
    transferHub: intermediateHub.name,
    totalDurationMinutes: totalDuration,
    totalPrice,
    distanceKm: totalDistance,
    segments: [leg1, leg2]
  };
}

export function findMultiStageBusRoutes(fromPlace, toPlace, passengers = 1) {
  const multiStageRoutes = [];
  const normFrom = normalizePlaceKey(fromPlace);
  const normTo = normalizePlaceKey(toPlace);

  if (!normFrom || !normTo || normFrom === normTo) return [];

  // Find all candidate transfer stops across RTC bus network
  const allStops = new Set();
  for (const bus of STATIC_BUS_SERVICES) {
    for (const stop of bus.stops) {
      const norm = normalizePlaceKey(stop);
      if (norm !== normFrom && norm !== normTo) {
        allStops.add(stop);
      }
    }
  }

  // 1. 2-stage connecting buses: From -> M1 -> To
  for (const m1 of allStops) {
    const leg1Options = findDirectBusRoutes(fromPlace, m1, passengers);
    if (leg1Options.length === 0) continue;

    const leg2Options = findDirectBusRoutes(m1, toPlace, passengers);
    if (leg2Options.length === 0) continue;

    const leg1 = leg1Options[0];
    const leg2 = leg2Options[0];

    const layoverMinutes = 15;
    const totalDist = Math.round((leg1.distanceKm + leg2.distanceKm) * 10) / 10;
    const totalDur = leg1.durationMinutes + layoverMinutes + leg2.durationMinutes;
    const totalPrice = leg1.price + leg2.price;

    multiStageRoutes.push({
      routeType: 'connecting_bus_2_stage',
      routeName: `Route – Bus Only via ${m1}`,
      from: fromPlace,
      to: toPlace,
      distanceKm: totalDist,
      totalDurationMinutes: totalDur,
      totalPrice,
      totalTransfers: 1,
      segments: [
        { ...leg1, layoverMinutes: null },
        { ...leg2, layoverMinutes }
      ],
      transfers: [
        {
          transferNumber: 1,
          location: m1,
          fromMode: 'bus',
          toMode: 'bus',
          nextBoardingPoint: m1,
          transferMode: 'walk',
          transferDistanceKm: 0.1,
          transferDurationMinutes: 5,
          transferPrice: 0,
          instruction: `Get down at ${m1}. Transfer to connecting ${leg2.serviceName || 'bus'} (${leg2.routeNumber || 'RTC Service'}) towards ${toPlace}.`,
          layoverMinutes
        }
      ]
    });

    if (multiStageRoutes.length >= 4) break;
  }

  // 2. 3-stage connecting buses: From -> M1 -> M2 -> To
  for (const m1 of allStops) {
    const leg1Options = findDirectBusRoutes(fromPlace, m1, passengers);
    if (leg1Options.length === 0) continue;

    for (const m2 of allStops) {
      if (m1 === m2) continue;
      const leg2Options = findDirectBusRoutes(m1, m2, passengers);
      if (leg2Options.length === 0) continue;

      const leg3Options = findDirectBusRoutes(m2, toPlace, passengers);
      if (leg3Options.length === 0) continue;

      const leg1 = leg1Options[0];
      const leg2 = leg2Options[0];
      const leg3 = leg3Options[0];

      const layover1 = 15;
      const layover2 = 15;
      const totalDist = Math.round((leg1.distanceKm + leg2.distanceKm + leg3.distanceKm) * 10) / 10;
      const totalDur = leg1.durationMinutes + layover1 + leg2.durationMinutes + layover2 + leg3.durationMinutes;
      const totalPrice = leg1.price + leg2.price + leg3.price;

      multiStageRoutes.push({
        routeType: 'connecting_bus_3_stage',
        routeName: `Route – Bus via ${m1} & ${m2}`,
        from: fromPlace,
        to: toPlace,
        distanceKm: totalDist,
        totalDurationMinutes: totalDur,
        totalPrice,
        totalTransfers: 2,
        segments: [
          { ...leg1, layoverMinutes: null },
          { ...leg2, layoverMinutes: layover1 },
          { ...leg3, layoverMinutes: layover2 }
        ],
        transfers: [
          {
            transferNumber: 1,
            location: m1,
            fromMode: 'bus',
            toMode: 'bus',
            nextBoardingPoint: m1,
            transferMode: 'walk',
            transferDistanceKm: 0.1,
            transferDurationMinutes: 5,
            transferPrice: 0,
            instruction: `Get down at ${m1}. Transfer to connecting bus (${leg2.serviceName || 'RTC'} ${leg2.routeNumber || ''}) toward ${m2}.`,
            layoverMinutes: layover1
          },
          {
            transferNumber: 2,
            location: m2,
            fromMode: 'bus',
            toMode: 'bus',
            nextBoardingPoint: m2,
            transferMode: 'walk',
            transferDistanceKm: 0.1,
            transferDurationMinutes: 5,
            transferPrice: 0,
            instruction: `Get down at ${m2}. Board onward ${leg3.serviceName || 'Express Bus'} (${leg3.routeNumber || ''}) to final destination ${toPlace}.`,
            layoverMinutes: layover2
          }
        ]
      });
      break;
    }
    if (multiStageRoutes.filter(r => r.routeType === 'connecting_bus_3_stage').length >= 2) break;
  }

  return multiStageRoutes;
}

