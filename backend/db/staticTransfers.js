// Physical Transfer Connections between Transport Hubs
// Maps the transfer legs (walking, feeder bus, or local auto) connecting bus stations and railway stations in the same hub towns.

export const STATIC_HUB_TRANSFERS = [
  {
    fromHub: 'Bhimavaram Bus Station',
    toHub: 'Bhimavaram Railway Station',
    distanceKm: 0.9,
    mode: 'walking',
    durationMinutes: 11,
    price: 0,
    transferType: 'walk',
    notes: 'Pedestrian walkway connecting Bhimavaram Old Bus Stand to Railway Station'
  },
  {
    fromHub: 'Bhimavaram Bus Station',
    toHub: 'Bhimavaram Junction',
    distanceKm: 0.9,
    mode: 'walking',
    durationMinutes: 11,
    price: 0,
    transferType: 'walk',
    notes: 'Short walk between Bhimavaram Bus Station and Junction'
  },
  {
    fromHub: 'Bhimavaram Bus Station',
    toHub: 'Bhimavaram Town Railway Station',
    distanceKm: 1.4,
    mode: 'bus',
    durationMinutes: 8,
    price: 15,
    transferType: 'feeder_auto',
    notes: 'Town auto / feeder bus between Bus Station and Town Railway Station'
  },
  {
    fromHub: 'Vijayawada Bus Station',
    toHub: 'Vijayawada Railway Station',
    distanceKm: 1.8,
    mode: 'bus',
    durationMinutes: 10,
    price: 15,
    transferType: 'city_bus',
    notes: 'Frequent APSRTC City Feeder / Metro Express shuttle every 5 mins'
  },
  {
    fromHub: 'Pandit Nehru Bus Station',
    toHub: 'Vijayawada Railway Station',
    distanceKm: 1.8,
    mode: 'bus',
    durationMinutes: 10,
    price: 15,
    transferType: 'city_bus',
    notes: 'City shuttle between PNBS Platform 1 and Vijayawada Station West Booking'
  },
  {
    fromHub: 'Guntur Bus Station',
    toHub: 'Guntur Railway Station',
    distanceKm: 0.8,
    mode: 'walking',
    durationMinutes: 10,
    price: 0,
    transferType: 'walk',
    notes: 'Direct 800m walkway from NTR Bus Station to Guntur Railway Station'
  },
  {
    fromHub: 'Tenali Bus Stand',
    toHub: 'Tenali Railway Station',
    distanceKm: 0.6,
    mode: 'walking',
    durationMinutes: 8,
    price: 0,
    transferType: 'walk',
    notes: 'Short 600m connecting street between Bus Stand and Tenali Jn'
  },
  {
    fromHub: 'Narasaraopet Bus Station',
    toHub: 'Narasaraopet Railway Station',
    distanceKm: 0.9,
    mode: 'walking',
    durationMinutes: 11,
    price: 0,
    transferType: 'walk',
    notes: 'Direct street connection between RTC Bus Station and Narasaraopet Railway Station'
  },
  {
    fromHub: 'Ongole Bus Stand',
    toHub: 'Ongole Railway Station',
    distanceKm: 1.5,
    mode: 'bus',
    durationMinutes: 8,
    price: 15,
    transferType: 'city_feeder',
    notes: 'Town feeder bus / shared auto between Ongole Bus Stand and Railway Station'
  },
  {
    fromHub: 'Rajahmundry Bus Station',
    toHub: 'Rajahmundry Railway Station',
    distanceKm: 2.1,
    mode: 'bus',
    durationMinutes: 12,
    price: 20,
    transferType: 'city_bus',
    notes: 'RTC city feeder bus between Morampudi/RTC Complex and Railway Station'
  },
  {
    fromHub: 'Dwaraka Bus Complex',
    toHub: 'Visakhapatnam Railway Station',
    distanceKm: 1.9,
    mode: 'bus',
    durationMinutes: 10,
    price: 15,
    transferType: 'city_bus',
    notes: 'Frequent RTC city bus from RTC Complex to Vizag Railway Station'
  },
  {
    fromHub: 'Tirupati Bus Station',
    toHub: 'Tirupati Railway Station',
    distanceKm: 0.7,
    mode: 'walking',
    durationMinutes: 9,
    price: 0,
    transferType: 'walk',
    notes: 'Pedestrian connection across Station Road'
  },
  {
    fromHub: 'Akividu Bus Station',
    toHub: 'Akividu Railway Station',
    distanceKm: 0.5,
    mode: 'walking',
    durationMinutes: 6,
    price: 0,
    transferType: 'walk',
    notes: 'Adjacent street connection'
  },
  {
    fromHub: 'Palakollu Bus Station',
    toHub: 'Palakollu Railway Station',
    distanceKm: 0.7,
    mode: 'walking',
    durationMinutes: 9,
    price: 0,
    transferType: 'walk',
    notes: 'Station Road walk'
  },
  {
    fromHub: 'Tanuku Bus Station',
    toHub: 'Tanuku Railway Station',
    distanceKm: 0.8,
    mode: 'walking',
    durationMinutes: 10,
    price: 0,
    transferType: 'walk',
    notes: 'Direct street connection between Bus Station and Station'
  },
  {
    fromHub: 'Tadepalligudem Bus Station',
    toHub: 'Tadepalligudem Railway Station',
    distanceKm: 0.6,
    mode: 'walking',
    durationMinutes: 8,
    price: 0,
    transferType: 'walk',
    notes: 'Walkway between Bus Complex and Tadepalligudem Station'
  },
  {
    fromHub: 'Eluru Bus Station',
    toHub: 'Eluru Railway Station',
    distanceKm: 1.2,
    mode: 'bus',
    durationMinutes: 6,
    price: 15,
    transferType: 'city_feeder',
    notes: 'Local auto / feeder bus between Old Bus Stand and Eluru Railway Station'
  },
  {
    fromHub: 'Town X Bus Stand',
    toHub: 'Town X Railway Station',
    distanceKm: 3.0,
    mode: 'auto',
    durationMinutes: 10,
    price: 40,
    transferType: 'auto',
    notes: 'Local auto / cab transfer between Town X Bus Stand and Town X Railway Station'
  },
  {
    fromHub: 'City B Railway Station',
    toHub: 'City B Bus Stand',
    distanceKm: 2.0,
    mode: 'bus',
    durationMinutes: 8,
    price: 15,
    transferType: 'city_bus',
    notes: 'City feeder bus connecting City B Railway Station to City B Bus Stand'
  },
  {
    fromHub: 'City B Railway Station',
    toHub: 'City B',
    distanceKm: 2.5,
    mode: 'auto',
    durationMinutes: 10,
    price: 35,
    transferType: 'auto',
    notes: 'Local auto from City B Railway Station to City B Center'
  },
  {
    fromHub: 'Ongole Railway Station',
    toHub: 'Final Destination',
    distanceKm: 5.0,
    mode: 'bus',
    durationMinutes: 15,
    price: 15,
    transferType: 'local_bus',
    notes: 'Local town bus / auto from Ongole Railway Station to Final Destination'
  },
  {
    fromHub: 'Village A',
    toHub: 'Village A Bus Stop',
    distanceKm: 1.2,
    mode: 'walking',
    durationMinutes: 15,
    price: 0,
    transferType: 'walk',
    notes: 'Direct 1.2 km pedestrian walk from Village A to Village A Bus Stop'
  },
  {
    fromHub: 'Village A Bus Stop',
    toHub: 'Town X Bus Stand',
    distanceKm: 15.0,
    mode: 'bus',
    durationMinutes: 25,
    price: 25,
    transferType: 'rural_feeder',
    notes: 'Palle Velugu bus connecting Village A Bus Stop to Town X Bus Stand'
  },
  {
    fromHub: 'Village A',
    toHub: 'Town X Bus Stand',
    distanceKm: 15.0,
    mode: 'bus',
    durationMinutes: 25,
    price: 25,
    transferType: 'rural_feeder',
    notes: 'Palle Velugu bus connecting Village A to Town X Bus Stand'
  },
  {
    fromHub: 'Village A',
    toHub: 'Town Y',
    distanceKm: 40.0,
    mode: 'bus',
    durationMinutes: 50,
    price: 50,
    transferType: 'bus',
    notes: 'APSRTC Express connecting Village A to Town Y'
  },
  {
    fromHub: 'Town Y',
    toHub: 'Ongole',
    distanceKm: 60.0,
    mode: 'bus',
    durationMinutes: 70,
    price: 80,
    transferType: 'bus',
    notes: 'APSRTC Express connecting Town Y to Ongole'
  },
  {
    fromHub: 'Town Y',
    toHub: 'City B',
    distanceKm: 65.0,
    mode: 'bus',
    durationMinutes: 75,
    price: 85,
    transferType: 'bus',
    notes: 'APSRTC Express connecting Town Y to City B'
  },
  {
    fromHub: 'Village A',
    toHub: 'Railway Station X',
    distanceKm: 12.0,
    mode: 'bus',
    durationMinutes: 20,
    price: 20,
    transferType: 'feeder_bus',
    notes: 'Local feeder bus connecting Village A to Railway Station X'
  },
  {
    fromHub: 'Village A',
    toHub: 'Railway Station Z',
    distanceKm: 18.0,
    mode: 'bus',
    durationMinutes: 25,
    price: 25,
    transferType: 'feeder_bus',
    notes: 'Local feeder bus connecting Village A to Railway Station Z'
  },
  {
    fromHub: 'Town B Bus Stand',
    toHub: 'Town B Railway Station',
    distanceKm: 2.5,
    mode: 'auto',
    durationMinutes: 8,
    price: 35,
    transferType: 'local_auto',
    notes: 'Local auto shuttle connecting Town B Bus Stand to Town B Railway Station'
  },
  {
    fromHub: 'Town B Railway Station',
    toHub: 'Town B Bus Stand',
    distanceKm: 2.5,
    mode: 'auto',
    durationMinutes: 8,
    price: 35,
    transferType: 'local_auto',
    notes: 'Local auto shuttle connecting Town B Railway Station to Town B Bus Stand'
  },
  {
    fromHub: 'Town C Bus Stand',
    toHub: 'Town C Railway Station',
    distanceKm: 2.8,
    mode: 'auto',
    durationMinutes: 10,
    price: 40,
    transferType: 'local_auto',
    notes: 'Town auto connecting Town C Bus Stand to Town C Railway Station'
  },
  {
    fromHub: 'Town C Railway Station',
    toHub: 'Town C Bus Stand',
    distanceKm: 2.8,
    mode: 'auto',
    durationMinutes: 10,
    price: 40,
    transferType: 'local_auto',
    notes: 'Town auto connecting Town C Railway Station to Town C Bus Stand'
  },
  {
    fromHub: 'City D Railway Station',
    toHub: 'City D',
    distanceKm: 1.5,
    mode: 'auto',
    durationMinutes: 6,
    price: 20,
    transferType: 'local_auto',
    notes: 'Short auto / shared shuttle from City D Railway Station to City D Center'
  },
  {
    fromHub: 'City D',
    toHub: 'City D Railway Station',
    distanceKm: 1.5,
    mode: 'auto',
    durationMinutes: 6,
    price: 20,
    transferType: 'local_auto',
    notes: 'Short auto connection to City D Railway Station'
  },
  {
    fromHub: 'Railway Station Y',
    toHub: 'City D',
    distanceKm: 3.0,
    mode: 'bus',
    durationMinutes: 10,
    price: 15,
    transferType: 'city_bus',
    notes: 'Local city bus connecting Railway Station Y to City D Center'
  },
  {
    fromHub: 'City C Railway Station',
    toHub: 'Final Destination',
    distanceKm: 4.0,
    mode: 'bus',
    durationMinutes: 12,
    price: 15,
    transferType: 'city_bus',
    notes: 'Local city bus connecting City C Railway Station to Final Destination'
  }
];
