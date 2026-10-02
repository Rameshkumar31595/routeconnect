// Static & Curated Domestic Airline Flight Schedules
// Contains verified domestic flight routes with real airlines, flight numbers,
// aircraft, departure/arrival schedules, layovers, and baggage allowances.

export const DOMESTIC_FLIGHT_SCHEDULES = [
  // -----------------------------------------------------------------
  // 1. Vijayawada (VGA) Flights
  // -----------------------------------------------------------------
  {
    flightId: 'FL-VGA-BLR-6E7245',
    airline: 'IndiGo',
    flightNumber: '6E-7245',
    originIata: 'VGA',
    originAirport: 'Vijayawada International Airport',
    destIata: 'BLR',
    destAirport: 'Kempegowda International Airport',
    departureTime: '09:25',
    arrivalTime: '10:45',
    durationMinutes: 80,
    distanceKm: 510,
    baseFare: 3450,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Airbus A320neo',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-VGA-BLR-QP1422',
    airline: 'Akasa Air',
    flightNumber: 'QP-1422',
    originIata: 'VGA',
    originAirport: 'Vijayawada International Airport',
    destIata: 'BLR',
    destAirport: 'Kempegowda International Airport',
    departureTime: '17:15',
    arrivalTime: '18:30',
    durationMinutes: 75,
    distanceKm: 510,
    baseFare: 3150,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Boeing 737 MAX 8',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-VGA-HYD-6E7128',
    airline: 'IndiGo',
    flightNumber: '6E-7128',
    originIata: 'VGA',
    originAirport: 'Vijayawada International Airport',
    destIata: 'HYD',
    destAirport: 'Rajiv Gandhi International Airport',
    departureTime: '08:40',
    arrivalTime: '09:40',
    durationMinutes: 60,
    distanceKm: 290,
    baseFare: 2750,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'ATR 72-600',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-VGA-HYD-AI542',
    airline: 'Air India',
    flightNumber: 'AI-542',
    originIata: 'VGA',
    originAirport: 'Vijayawada International Airport',
    destIata: 'HYD',
    destAirport: 'Rajiv Gandhi International Airport',
    departureTime: '14:20',
    arrivalTime: '15:20',
    durationMinutes: 60,
    distanceKm: 290,
    baseFare: 3100,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Airbus A320',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-VGA-MAA-6E7911',
    airline: 'IndiGo',
    flightNumber: '6E-7911',
    originIata: 'VGA',
    originAirport: 'Vijayawada International Airport',
    destIata: 'MAA',
    destAirport: 'Chennai International Airport',
    departureTime: '11:10',
    arrivalTime: '12:20',
    durationMinutes: 70,
    distanceKm: 390,
    baseFare: 3200,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'ATR 72-600',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-VGA-DEL-AI458',
    airline: 'Air India',
    flightNumber: 'AI-458',
    originIata: 'VGA',
    originAirport: 'Vijayawada International Airport',
    destIata: 'DEL',
    destAirport: 'Indira Gandhi International Airport',
    departureTime: '10:15',
    arrivalTime: '12:45',
    durationMinutes: 150,
    distanceKm: 1400,
    baseFare: 5600,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Airbus A320neo',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },

  // -----------------------------------------------------------------
  // 2. Hyderabad (HYD) Flights
  // -----------------------------------------------------------------
  {
    flightId: 'FL-HYD-BLR-6E451',
    airline: 'IndiGo',
    flightNumber: '6E-451',
    originIata: 'HYD',
    originAirport: 'Rajiv Gandhi International Airport',
    destIata: 'BLR',
    destAirport: 'Kempegowda International Airport',
    departureTime: '10:30',
    arrivalTime: '11:45',
    durationMinutes: 75,
    distanceKm: 500,
    baseFare: 2950,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Airbus A321neo',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-HYD-MAA-6E602',
    airline: 'IndiGo',
    flightNumber: '6E-602',
    originIata: 'HYD',
    originAirport: 'Rajiv Gandhi International Airport',
    destIata: 'MAA',
    destAirport: 'Chennai International Airport',
    departureTime: '10:15',
    arrivalTime: '11:30',
    durationMinutes: 75,
    distanceKm: 520,
    baseFare: 3100,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Airbus A320neo',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-HYD-DEL-6E2051',
    airline: 'IndiGo',
    flightNumber: '6E-2051',
    originIata: 'HYD',
    originAirport: 'Rajiv Gandhi International Airport',
    destIata: 'DEL',
    destAirport: 'Indira Gandhi International Airport',
    departureTime: '11:30',
    arrivalTime: '13:45',
    durationMinutes: 135,
    distanceKm: 1260,
    baseFare: 4850,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Airbus A321neo',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-HYD-BOM-6E5316',
    airline: 'IndiGo',
    flightNumber: '6E-5316',
    originIata: 'HYD',
    originAirport: 'Rajiv Gandhi International Airport',
    destIata: 'BOM',
    destAirport: 'Chhatrapati Shivaji Maharaj International Airport',
    departureTime: '12:00',
    arrivalTime: '13:30',
    durationMinutes: 90,
    distanceKm: 620,
    baseFare: 3600,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Airbus A320neo',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },

  // -----------------------------------------------------------------
  // 3. Tirupati (TIR) Flights
  // -----------------------------------------------------------------
  {
    flightId: 'FL-TIR-BLR-6E7922',
    airline: 'IndiGo',
    flightNumber: '6E-7922',
    originIata: 'TIR',
    originAirport: 'Tirupati International Airport',
    destIata: 'BLR',
    destAirport: 'Kempegowda International Airport',
    departureTime: '10:45',
    arrivalTime: '11:45',
    durationMinutes: 60,
    distanceKm: 210,
    baseFare: 2900,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'ATR 72-600',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-TIR-HYD-SG1092',
    airline: 'SpiceJet',
    flightNumber: 'SG-1092',
    originIata: 'TIR',
    originAirport: 'Tirupati International Airport',
    destIata: 'HYD',
    destAirport: 'Rajiv Gandhi International Airport',
    departureTime: '10:20',
    arrivalTime: '11:30',
    durationMinutes: 70,
    distanceKm: 430,
    baseFare: 3200,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Bombardier Q400',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },

  // -----------------------------------------------------------------
  // 4. Visakhapatnam (VTZ) Flights
  // -----------------------------------------------------------------
  {
    flightId: 'FL-VTZ-BLR-6E731',
    airline: 'IndiGo',
    flightNumber: '6E-731',
    originIata: 'VTZ',
    originAirport: 'Visakhapatnam International Airport',
    destIata: 'BLR',
    destAirport: 'Kempegowda International Airport',
    departureTime: '08:30',
    arrivalTime: '10:10',
    durationMinutes: 100,
    distanceKm: 800,
    baseFare: 4200,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Airbus A320neo',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },
  {
    flightId: 'FL-VTZ-DEL-6E2122',
    airline: 'IndiGo',
    flightNumber: '6E-2122',
    originIata: 'VTZ',
    originAirport: 'Visakhapatnam International Airport',
    destIata: 'DEL',
    destAirport: 'Indira Gandhi International Airport',
    departureTime: '13:00',
    arrivalTime: '15:25',
    durationMinutes: 145,
    distanceKm: 1350,
    baseFare: 5500,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'Airbus A320neo',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  },

  // -----------------------------------------------------------------
  // 5. Rajahmundry (RJA) Flights
  // -----------------------------------------------------------------
  {
    flightId: 'FL-RJA-HYD-6E7281',
    airline: 'IndiGo',
    flightNumber: '6E-7281',
    originIata: 'RJA',
    originAirport: 'Rajahmundry Airport',
    destIata: 'HYD',
    destAirport: 'Rajiv Gandhi International Airport',
    departureTime: '09:10',
    arrivalTime: '10:15',
    durationMinutes: 65,
    distanceKm: 360,
    baseFare: 3300,
    stops: 0,
    stopType: 'Non-stop',
    baggage: '15 kg Check-in, 7 kg Cabin',
    aircraft: 'ATR 72-600',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availabilityStatus: 'Available'
  }
];

// Connecting Flight Definitions (Chained through Hubs when direct air service is unavailable or as alternative options)
export const CONNECTING_FLIGHT_CHAINS = [
  // 1. Vijayawada (VGA) -> Hyderabad (HYD) -> Delhi (DEL)
  {
    chainId: 'CHAIN-VGA-HYD-DEL',
    originIata: 'VGA',
    originAirport: 'Vijayawada International Airport',
    hubIata: 'HYD',
    hubAirport: 'Rajiv Gandhi International Airport',
    destIata: 'DEL',
    destAirport: 'Indira Gandhi International Airport',
    leg1: {
      airline: 'IndiGo',
      flightNumber: '6E-7128',
      departureTime: '08:40',
      arrivalTime: '09:40',
      durationMinutes: 60,
      aircraft: 'ATR 72-600'
    },
    layoverMinutes: 110, // 1h 50m layover at HYD
    leg2: {
      airline: 'IndiGo',
      flightNumber: '6E-2051',
      departureTime: '11:30',
      arrivalTime: '13:45',
      durationMinutes: 135,
      aircraft: 'Airbus A321neo'
    },
    totalDurationMinutes: 305, // 60 + 110 + 135 = 5h 05m
    totalDistanceKm: 1550,
    baseFare: 6800,
    baggage: '15 kg Check-in (Through Checked), 7 kg Cabin',
    availabilityStatus: 'Connecting Seats Available'
  },

  // 2. Vijayawada (VGA) -> Hyderabad (HYD) -> Mumbai (BOM)
  {
    chainId: 'CHAIN-VGA-HYD-BOM',
    originIata: 'VGA',
    originAirport: 'Vijayawada International Airport',
    hubIata: 'HYD',
    hubAirport: 'Rajiv Gandhi International Airport',
    destIata: 'BOM',
    destAirport: 'Chhatrapati Shivaji Maharaj International Airport',
    leg1: {
      airline: 'IndiGo',
      flightNumber: '6E-7128',
      departureTime: '08:40',
      arrivalTime: '09:40',
      durationMinutes: 60,
      aircraft: 'ATR 72-600'
    },
    layoverMinutes: 140, // 2h 20m layover at HYD
    leg2: {
      airline: 'IndiGo',
      flightNumber: '6E-5316',
      departureTime: '12:00',
      arrivalTime: '13:30',
      durationMinutes: 90,
      aircraft: 'Airbus A320neo'
    },
    totalDurationMinutes: 290,
    totalDistanceKm: 910,
    baseFare: 5700,
    baggage: '15 kg Check-in (Through Checked), 7 kg Cabin',
    availabilityStatus: 'Connecting Seats Available'
  },

  // 3. Tirupati (TIR) -> Hyderabad (HYD) -> Delhi (DEL)
  {
    chainId: 'CHAIN-TIR-HYD-DEL',
    originIata: 'TIR',
    originAirport: 'Tirupati International Airport',
    hubIata: 'HYD',
    hubAirport: 'Rajiv Gandhi International Airport',
    destIata: 'DEL',
    destAirport: 'Indira Gandhi International Airport',
    leg1: {
      airline: 'SpiceJet',
      flightNumber: 'SG-1092',
      departureTime: '08:15',
      arrivalTime: '09:25',
      durationMinutes: 70,
      aircraft: 'Bombardier Q400'
    },
    layoverMinutes: 125, // 2h 05m layover at HYD
    leg2: {
      airline: 'IndiGo',
      flightNumber: '6E-2051',
      departureTime: '11:30',
      arrivalTime: '13:45',
      durationMinutes: 135,
      aircraft: 'Airbus A321neo'
    },
    totalDurationMinutes: 330,
    totalDistanceKm: 1690,
    baseFare: 7200,
    baggage: '15 kg Check-in (Through Checked), 7 kg Cabin',
    availabilityStatus: 'Connecting Seats Available'
  },

  // 4. Rajahmundry (RJA) -> Hyderabad (HYD) -> Bengaluru (BLR)
  {
    chainId: 'CHAIN-RJA-HYD-BLR',
    originIata: 'RJA',
    originAirport: 'Rajahmundry Airport',
    hubIata: 'HYD',
    hubAirport: 'Rajiv Gandhi International Airport',
    destIata: 'BLR',
    destAirport: 'Kempegowda International Airport',
    leg1: {
      airline: 'IndiGo',
      flightNumber: '6E-7281',
      departureTime: '09:10',
      arrivalTime: '10:15',
      durationMinutes: 65,
      aircraft: 'ATR 72-600'
    },
    layoverMinutes: 80, // 1h 20m layover at HYD
    leg2: {
      airline: 'IndiGo',
      flightNumber: '6E-451',
      departureTime: '11:35',
      arrivalTime: '12:50',
      durationMinutes: 75,
      aircraft: 'Airbus A321neo'
    },
    totalDurationMinutes: 220,
    totalDistanceKm: 860,
    baseFare: 5600,
    baggage: '15 kg Check-in (Through Checked), 7 kg Cabin',
    availabilityStatus: 'Connecting Seats Available'
  }
];
