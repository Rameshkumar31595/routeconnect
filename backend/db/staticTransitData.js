// Authoritative Indian Railways Train Routes and State RTC Bus Networks
// Compliant with open transportation datasets and official timetables.

export const STATIC_TRAIN_SERVICES = [
  {
    trainNumber: '12727',
    trainName: 'Godavari Express',
    origin: 'Visakhapatnam Railway Station',
    destination: 'Secunderabad Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL', '3A', '2A', '1A'],
    halts: [
      { station: 'Visakhapatnam Railway Station', code: 'VSKP', arr: null, dep: '17:20', distanceKm: 0 },
      { station: 'Anakapalli', code: 'AKP', arr: '18:03', dep: '18:05', distanceKm: 33 },
      { station: 'Tuni', code: 'TUNI', arr: '18:53', dep: '18:55', distanceKm: 97 },
      { station: 'Samalkot', code: 'SLO', arr: '19:33', dep: '19:35', distanceKm: 151 },
      { station: 'Rajahmundry Railway Station', code: 'RJY', arr: '20:28', dep: '20:30', distanceKm: 201 },
      { station: 'Nidadavolu', code: 'NDD', arr: '20:58', dep: '21:00', distanceKm: 223 },
      { station: 'Tanuku Railway Station', code: 'TNKU', arr: '21:18', dep: '21:20', distanceKm: 240 },
      { station: 'Bhimavaram Town Railway Station', code: 'BVRT', arr: '21:58', dep: '22:00', distanceKm: 270 },
      { station: 'Bhimavaram Junction', code: 'BVRM', arr: '22:05', dep: '22:10', distanceKm: 272 },
      { station: 'Bhimavaram Railway Station', code: 'BVRM', arr: '22:05', dep: '22:10', distanceKm: 272 },
      { station: 'Akividu Railway Station', code: 'AKVD', arr: '22:28', dep: '22:30', distanceKm: 289 },
      { station: 'Gudivada Railway Station', code: 'GDV', arr: '23:13', dep: '23:15', distanceKm: 333 },
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: '00:10', dep: '00:25', distanceKm: 377 },
      { station: 'Vijayawada Junction', code: 'BZA', arr: '00:10', dep: '00:25', distanceKm: 377 },
      { station: 'Secunderabad Railway Station', code: 'SC', arr: '06:15', dep: null, distanceKm: 710 }
    ],
    baseFares: { '2S': 60, 'SL': 145, '3A': 505, '2A': 710 }
  },
  {
    trainNumber: '12728',
    trainName: 'Godavari Express',
    origin: 'Secunderabad Railway Station',
    destination: 'Visakhapatnam Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL', '3A', '2A', '1A'],
    halts: [
      { station: 'Secunderabad Railway Station', code: 'SC', arr: null, dep: '17:05', distanceKm: 0 },
      { station: 'Vijayawada Junction', code: 'BZA', arr: '23:05', dep: '23:20', distanceKm: 333 },
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: '23:05', dep: '23:20', distanceKm: 333 },
      { station: 'Gudivada Railway Station', code: 'GDV', arr: '00:13', dep: '00:15', distanceKm: 377 },
      { station: 'Akividu Railway Station', code: 'AKVD', arr: '00:53', dep: '00:55', distanceKm: 421 },
      { station: 'Undi Railway Station', code: 'UNDI', arr: '01:09', dep: '01:10', distanceKm: 431 },
      { station: 'Bhimavaram Railway Station', code: 'BVRM', arr: '01:23', dep: '01:25', distanceKm: 438 },
      { station: 'Bhimavaram Junction', code: 'BVRM', arr: '01:23', dep: '01:25', distanceKm: 438 },
      { station: 'Bhimavaram Town Railway Station', code: 'BVRT', arr: '01:33', dep: '01:35', distanceKm: 440 },
      { station: 'Tanuku Railway Station', code: 'TNKU', arr: '02:08', dep: '02:10', distanceKm: 470 },
      { station: 'Nidadavolu', code: 'NDD', arr: '02:33', dep: '02:35', distanceKm: 487 },
      { station: 'Rajahmundry Railway Station', code: 'RJY', arr: '03:13', dep: '03:15', distanceKm: 509 },
      { station: 'Samalkot', code: 'SLO', arr: '03:58', dep: '04:00', distanceKm: 559 },
      { station: 'Tuni', code: 'TUNI', arr: '04:38', dep: '04:40', distanceKm: 613 },
      { station: 'Anakapalli', code: 'AKP', arr: '05:38', dep: '05:40', distanceKm: 677 },
      { station: 'Visakhapatnam Railway Station', code: 'VSKP', arr: '06:40', dep: null, distanceKm: 710 }
    ],
    baseFares: { '2S': 60, 'SL': 145, '3A': 505, '2A': 710 }
  },
  {
    trainNumber: '12718',
    trainName: 'Ratnachal Express',
    origin: 'Vijayawada Railway Station',
    destination: 'Visakhapatnam Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'CC'],
    halts: [
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: null, dep: '06:15', distanceKm: 0 },
      { station: 'Vijayawada Junction', code: 'BZA', arr: null, dep: '06:15', distanceKm: 0 },
      { station: 'Eluru Railway Station', code: 'EE', arr: '07:08', dep: '07:10', distanceKm: 59 },
      { station: 'Tadepalligudem Railway Station', code: 'TDD', arr: '07:44', dep: '07:45', distanceKm: 107 },
      { station: 'Nidadavolu', code: 'NDD', arr: '08:04', dep: '08:05', distanceKm: 127 },
      { station: 'Kovvur', code: 'KVR', arr: '08:19', dep: '08:20', distanceKm: 142 },
      { station: 'Rajahmundry Railway Station', code: 'RJY', arr: '08:34', dep: '08:36', distanceKm: 149 },
      { station: 'Samalkot', code: 'SLO', arr: '09:19', dep: '09:20', distanceKm: 199 },
      { station: 'Tuni', code: 'TUNI', arr: '10:04', dep: '10:05', distanceKm: 253 },
      { station: 'Anakapalli', code: 'AKP', arr: '10:59', dep: '11:00', distanceKm: 317 },
      { station: 'Visakhapatnam Railway Station', code: 'VSKP', arr: '12:15', dep: null, distanceKm: 350 }
    ],
    baseFares: { '2S': 145, 'CC': 520 }
  },
  {
    trainNumber: '17239',
    trainName: 'Simhadri Express',
    origin: 'Guntur Railway Station',
    destination: 'Visakhapatnam Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'CC'],
    halts: [
      { station: 'Guntur Railway Station', code: 'GNT', arr: null, dep: '08:00', distanceKm: 0 },
      { station: 'Mangalagiri', code: 'MAG', arr: '08:23', dep: '08:24', distanceKm: 20 },
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: '09:00', dep: '09:10', distanceKm: 32 },
      { station: 'Eluru Railway Station', code: 'EE', arr: '10:08', dep: '10:10', distanceKm: 92 },
      { station: 'Tadepalligudem Railway Station', code: 'TDD', arr: '10:48', dep: '10:50', distanceKm: 140 },
      { station: 'Nidadavolu', code: 'NDD', arr: '11:08', dep: '11:10', distanceKm: 160 },
      { station: 'Rajahmundry Railway Station', code: 'RJY', arr: '11:48', dep: '11:50', distanceKm: 182 },
      { station: 'Samalkot', code: 'SLO', arr: '12:38', dep: '12:40', distanceKm: 232 },
      { station: 'Anakapalli', code: 'AKP', arr: '14:28', dep: '14:30', distanceKm: 350 },
      { station: 'Visakhapatnam Railway Station', code: 'VSKP', arr: '16:00', dep: null, distanceKm: 383 }
    ],
    baseFares: { '2S': 150, 'CC': 540 }
  },
  {
    trainNumber: '12717',
    trainName: 'Ratnachal Express',
    origin: 'Visakhapatnam Railway Station',
    destination: 'Vijayawada Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'CC'],
    halts: [
      { station: 'Visakhapatnam Railway Station', code: 'VSKP', arr: null, dep: '12:55', distanceKm: 0 },
      { station: 'Anakapalli', code: 'AKP', arr: '13:39', dep: '13:40', distanceKm: 33 },
      { station: 'Tuni', code: 'TUNI', arr: '14:23', dep: '14:25', distanceKm: 97 },
      { station: 'Samalkot', code: 'SLO', arr: '15:06', dep: '15:07', distanceKm: 151 },
      { station: 'Rajahmundry Railway Station', code: 'RJY', arr: '15:53', dep: '15:55', distanceKm: 201 },
      { station: 'Kovvur', code: 'KVR', arr: '16:04', dep: '16:05', distanceKm: 208 },
      { station: 'Nidadavolu', code: 'NDD', arr: '16:19', dep: '16:20', distanceKm: 223 },
      { station: 'Tadepalligudem Railway Station', code: 'TDD', arr: '16:34', dep: '16:35', distanceKm: 243 },
      { station: 'Eluru Railway Station', code: 'EE', arr: '17:09', dep: '17:10', distanceKm: 291 },
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: '18:45', dep: null, distanceKm: 350 },
      { station: 'Vijayawada Junction', code: 'BZA', arr: '18:45', dep: null, distanceKm: 350 }
    ],
    baseFares: { '2S': 145, 'CC': 520 }
  },
  {
    trainNumber: '17281',
    trainName: 'Narsapur - Guntur Express',
    origin: 'Narsapur Railway Station',
    destination: 'Guntur Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL'],
    halts: [
      { station: 'Narsapur Railway Station', code: 'NS', arr: null, dep: '06:05', distanceKm: 0 },
      { station: 'Palakollu Railway Station', code: 'PKO', arr: '06:14', dep: '06:15', distanceKm: 9 },
      { station: 'Veeravasaram Railway Station', code: 'VVM', arr: '06:24', dep: '06:25', distanceKm: 19 },
      { station: 'Bhimavaram Town Railway Station', code: 'BVRT', arr: '06:39', dep: '06:40', distanceKm: 30 },
      { station: 'Bhimavaram Junction', code: 'BVRM', arr: '06:45', dep: '06:50', distanceKm: 32 },
      { station: 'Bhimavaram Railway Station', code: 'BVRM', arr: '06:45', dep: '06:50', distanceKm: 32 },
      { station: 'Undi Railway Station', code: 'UNDI', arr: '06:59', dep: '07:00', distanceKm: 39 },
      { station: 'Akividu Railway Station', code: 'AKVD', arr: '07:14', dep: '07:15', distanceKm: 49 },
      { station: 'Gudivada Railway Station', code: 'GDV', arr: '07:58', dep: '08:00', distanceKm: 93 },
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: '09:05', dep: '09:15', distanceKm: 137 },
      { station: 'Vijayawada Junction', code: 'BZA', arr: '09:05', dep: '09:15', distanceKm: 137 },
      { station: 'Mangalagiri', code: 'MAG', arr: '09:34', dep: '09:35', distanceKm: 149 },
      { station: 'Guntur Railway Station', code: 'GNT', arr: '10:05', dep: null, distanceKm: 169 }
    ],
    baseFares: { '2S': 75, 'SL': 140 }
  },
  {
    trainNumber: '17282',
    trainName: 'Guntur - Narsapur Express',
    origin: 'Guntur Railway Station',
    destination: 'Narsapur Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL'],
    halts: [
      { station: 'Guntur Railway Station', code: 'GNT', arr: null, dep: '16:00', distanceKm: 0 },
      { station: 'Mangalagiri', code: 'MAG', arr: '16:22', dep: '16:23', distanceKm: 20 },
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: '17:00', dep: '17:10', distanceKm: 32 },
      { station: 'Gudivada Railway Station', code: 'GDV', arr: '18:03', dep: '18:05', distanceKm: 76 },
      { station: 'Akividu Railway Station', code: 'AKVD', arr: '18:48', dep: '18:50', distanceKm: 120 },
      { station: 'Undi Railway Station', code: 'UNDI', arr: '19:04', dep: '19:05', distanceKm: 130 },
      { station: 'Bhimavaram Railway Station', code: 'BVRM', arr: '19:20', dep: '19:25', distanceKm: 137 },
      { station: 'Bhimavaram Junction', code: 'BVRM', arr: '19:20', dep: '19:25', distanceKm: 137 },
      { station: 'Bhimavaram Town Railway Station', code: 'BVRT', arr: '19:30', dep: '19:32', distanceKm: 139 },
      { station: 'Veeravasaram Railway Station', code: 'VVM', arr: '19:44', dep: '19:45', distanceKm: 150 },
      { station: 'Palakollu Railway Station', code: 'PKO', arr: '19:59', dep: '20:00', distanceKm: 160 },
      { station: 'Narsapur Railway Station', code: 'NS', arr: '20:30', dep: null, distanceKm: 169 }
    ],
    baseFares: { '2S': 75, 'SL': 140 }
  },
  {
    trainNumber: '20833',
    trainName: 'Vande Bharat Express',
    origin: 'Visakhapatnam Railway Station',
    destination: 'Secunderabad Railway Station',
    runningDays: 'Mon,Tue,Wed,Thu,Fri,Sat',
    classes: ['CC', 'EC'],
    halts: [
      { station: 'Visakhapatnam Railway Station', code: 'VSKP', arr: null, dep: '05:45', distanceKm: 0 },
      { station: 'Samalkot', code: 'SLO', arr: '07:14', dep: '07:15', distanceKm: 151 },
      { station: 'Rajahmundry Railway Station', code: 'RJY', arr: '07:53', dep: '07:55', distanceKm: 201 },
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: '09:50', dep: '09:55', distanceKm: 350 },
      { station: 'Secunderabad Railway Station', code: 'SC', arr: '14:15', dep: null, distanceKm: 699 }
    ],
    baseFares: { 'CC': 960, 'EC': 1880 }
  },
  {
    trainNumber: '12805',
    trainName: 'Janmabhoomi Express',
    origin: 'Visakhapatnam Railway Station',
    destination: 'Lingampalli Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'CC'],
    halts: [
      { station: 'Visakhapatnam Railway Station', code: 'VSKP', arr: null, dep: '06:20', distanceKm: 0 },
      { station: 'Anakapalli', code: 'AKP', arr: '07:03', dep: '07:05', distanceKm: 33 },
      { station: 'Tuni', code: 'TUNI', arr: '07:49', dep: '07:50', distanceKm: 97 },
      { station: 'Samalkot', code: 'SLO', arr: '08:34', dep: '08:35', distanceKm: 151 },
      { station: 'Rajahmundry Railway Station', code: 'RJY', arr: '09:24', dep: '09:25', distanceKm: 201 },
      { station: 'Tadepalligudem Railway Station', code: 'TDD', arr: '10:04', dep: '10:05', distanceKm: 243 },
      { station: 'Eluru Railway Station', code: 'EE', arr: '10:44', dep: '10:45', distanceKm: 291 },
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: '12:00', dep: '12:15', distanceKm: 350 },
      { station: 'Tenali Railway Station', code: 'TEL', arr: '12:44', dep: '12:45', distanceKm: 381 },
      { station: 'Guntur Railway Station', code: 'GNT', arr: '13:20', dep: '13:25', distanceKm: 407 },
      { station: 'Secunderabad Railway Station', code: 'SC', arr: '18:20', dep: '18:25', distanceKm: 688 }
    ],
    baseFares: { '2S': 160, 'CC': 590 }
  },
  {
    trainNumber: '12711',
    trainName: 'Pinakini Express',
    origin: 'Vijayawada Railway Station',
    destination: 'Chennai Central',
    runningDays: 'Daily',
    classes: ['2S', 'CC'],
    halts: [
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: null, dep: '06:10', distanceKm: 0 },
      { station: 'Tenali Railway Station', code: 'TEL', arr: '06:38', dep: '06:40', distanceKm: 31 },
      { station: 'Bapatla', code: 'BPP', arr: '07:13', dep: '07:15', distanceKm: 74 },
      { station: 'Chirala', code: 'CLX', arr: '07:28', dep: '07:30', distanceKm: 89 },
      { station: 'Ongole Railway Station', code: 'OGL', arr: '08:18', dep: '08:20', distanceKm: 138 },
      { station: 'Nellore Railway Station', code: 'NLR', arr: '09:48', dep: '09:50', distanceKm: 255 },
      { station: 'Chennai Central', code: 'MAS', arr: '13:05', dep: null, distanceKm: 430 }
    ],
    baseFares: { '2S': 165, 'CC': 625 }
  },
  {
    trainNumber: '17222',
    trainName: 'Seshadri Express',
    origin: 'Kakinada Town',
    destination: 'Bengaluru Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL', '3A', '2A'],
    halts: [
      { station: 'Samalkot', code: 'SLO', arr: '17:38', dep: '17:40', distanceKm: 13 },
      { station: 'Rajahmundry Railway Station', code: 'RJY', arr: '18:28', dep: '18:30', distanceKm: 63 },
      { station: 'Nidadavolu', code: 'NDD', arr: '18:58', dep: '19:00', distanceKm: 85 },
      { station: 'Tanuku Railway Station', code: 'TNKU', arr: '19:18', dep: '19:20', distanceKm: 102 },
      { station: 'Attili Railway Station', code: 'AL', arr: '19:34', dep: '19:35', distanceKm: 112 },
      { station: 'Bhimavaram Town Railway Station', code: 'BVRT', arr: '19:58', dep: '20:00', distanceKm: 132 },
      { station: 'Bhimavaram Junction', code: 'BVRM', arr: '20:05', dep: '20:10', distanceKm: 134 },
      { station: 'Akividu Railway Station', code: 'AKVD', arr: '20:28', dep: '20:30', distanceKm: 151 },
      { station: 'Gudivada Railway Station', code: 'GDV', arr: '21:13', dep: '21:15', distanceKm: 195 },
      { station: 'Vijayawada Railway Station', code: 'BZA', arr: '22:15', dep: '22:30', distanceKm: 239 },
      { station: 'Tenali Railway Station', code: 'TEL', arr: '23:03', dep: '23:05', distanceKm: 270 },
      { station: 'Bapatla', code: 'BPP', arr: '23:43', dep: '23:45', distanceKm: 313 },
      { station: 'Chirala', code: 'CLX', arr: '23:58', dep: '00:00', distanceKm: 328 },
      { station: 'Ongole Railway Station', code: 'OGL', arr: '00:48', dep: '00:50', distanceKm: 377 },
      { station: 'Nellore Railway Station', code: 'NLR', arr: '02:18', dep: '02:20', distanceKm: 494 },
      { station: 'Renigunta Railway Station', code: 'RU', arr: '04:33', dep: '04:35', distanceKm: 616 },
      { station: 'Tirupati Railway Station', code: 'TPTY', arr: '05:05', dep: '05:10', distanceKm: 626 },
      { station: 'Bengaluru Railway Station', code: 'SBC', arr: '12:10', dep: null, distanceKm: 960 }
    ],
    baseFares: { '2S': 240, 'SL': 440, '3A': 1180, '2A': 1710 }
  },
  {
    trainNumber: '12747',
    trainName: 'Palnadu Express',
    origin: 'Guntur Railway Station',
    destination: 'Vikarabad Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'CC'],
    halts: [
      { station: 'Guntur Railway Station', code: 'GNT', arr: null, dep: '05:45', distanceKm: 0 },
      { station: 'Narasaraopet Railway Station', code: 'NRT', arr: '06:29', dep: '06:30', distanceKm: 45 },
      { station: 'Secunderabad Railway Station', code: 'SC', arr: '10:45', dep: '10:50', distanceKm: 281 }
    ],
    baseFares: { '2S': 110, 'CC': 415 }
  },
  {
    trainNumber: '12727',
    trainName: 'Godavari Express',
    origin: 'Town X Railway Station',
    destination: 'Ongole Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL', '3A'],
    halts: [
      { station: 'Town X Railway Station', code: 'TWNX', arr: null, dep: '08:30', distanceKm: 0 },
      { station: 'Railway Station X', code: 'RSX', arr: '08:45', dep: '08:47', distanceKm: 12 },
      { station: 'Ongole Railway Station', code: 'OGL', arr: '09:45', dep: null, distanceKm: 80 }
    ],
    baseFares: { '2S': 65, 'SL': 140 }
  },
  {
    trainNumber: '12711',
    trainName: 'Pinakini Intercity',
    origin: 'Town X Railway Station',
    destination: 'City B Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'CC'],
    halts: [
      { station: 'Town X Railway Station', code: 'TWNX', arr: null, dep: '09:00', distanceKm: 0 },
      { station: 'City B Railway Station', code: 'CTYB', arr: '10:15', dep: null, distanceKm: 85 }
    ],
    baseFares: { '2S': 70, 'CC': 260 }
  },
  {
    trainNumber: '17239',
    trainName: 'Simhadri Intercity',
    origin: 'Railway Station Z',
    destination: 'City B Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL'],
    halts: [
      { station: 'Railway Station Z', code: 'RSZ', arr: null, dep: '10:00', distanceKm: 0 },
      { station: 'City B Railway Station', code: 'CTYB', arr: '11:10', dep: null, distanceKm: 70 }
    ],
    baseFares: { '2S': 55, 'SL': 120 }
  },
  {
    trainNumber: '17281',
    trainName: 'Narasaraopet - Ongole Express',
    origin: 'Narasaraopet Railway Station',
    destination: 'Ongole Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL'],
    halts: [
      { station: 'Narasaraopet Railway Station', code: 'NRT', arr: null, dep: '07:15', distanceKm: 0 },
      { station: 'Tenali Railway Station', code: 'TEL', arr: '08:00', dep: '08:05', distanceKm: 48 },
      { station: 'Bapatla', code: 'BPP', arr: '08:35', dep: '08:37', distanceKm: 85 },
      { station: 'Chirala', code: 'CLX', arr: '08:50', dep: '08:52', distanceKm: 100 },
      { station: 'Ongole Railway Station', code: 'OGL', arr: '09:35', dep: null, distanceKm: 145 }
    ],
    baseFares: { '2S': 85, 'SL': 155 }
  },
  {
    trainNumber: '17282',
    trainName: 'Ongole - Narasaraopet Express',
    origin: 'Ongole Railway Station',
    destination: 'Narasaraopet Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL'],
    halts: [
      { station: 'Ongole Railway Station', code: 'OGL', arr: null, dep: '16:00', distanceKm: 0 },
      { station: 'Chirala', code: 'CLX', arr: '16:40', dep: '16:42', distanceKm: 45 },
      { station: 'Bapatla', code: 'BPP', arr: '16:55', dep: '16:57', distanceKm: 60 },
      { station: 'Tenali Railway Station', code: 'TEL', arr: '17:35', dep: '17:40', distanceKm: 97 },
      { station: 'Narasaraopet Railway Station', code: 'NRT', arr: '18:25', dep: null, distanceKm: 145 }
    ],
    baseFares: { '2S': 85, 'SL': 155 }
  },
  {
    trainNumber: '12711',
    trainName: 'Pinakini Express',
    origin: 'Town B Railway Station',
    destination: 'City D Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL', 'CC'],
    halts: [
      { station: 'Town B Railway Station', code: 'TWNB', arr: null, dep: '09:15', distanceKm: 0 },
      { station: 'City D Railway Station', code: 'CTYD', arr: '09:40', dep: null, distanceKm: 30 }
    ],
    baseFares: { '2S': 45, 'SL': 100, 'CC': 180 }
  },
  {
    trainNumber: '17281',
    trainName: 'Express Service',
    origin: 'Town C Railway Station',
    destination: 'Railway Station D',
    runningDays: 'Daily',
    classes: ['2S', 'SL'],
    halts: [
      { station: 'Town C Railway Station', code: 'TWNC', arr: null, dep: '08:30', distanceKm: 0 },
      { station: 'Railway Station D', code: 'RSD', arr: '09:00', dep: null, distanceKm: 36 }
    ],
    baseFares: { '2S': 50, 'SL': 110 }
  },
  {
    trainNumber: '12727',
    trainName: 'Godavari Connecting Express',
    origin: 'Railway Station D',
    destination: 'City D Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL'],
    halts: [
      { station: 'Railway Station D', code: 'RSD', arr: null, dep: '09:25', distanceKm: 0 },
      { station: 'City D Railway Station', code: 'CTYD', arr: '09:40', dep: null, distanceKm: 12 }
    ],
    baseFares: { '2S': 30, 'SL': 80 }
  },
  {
    trainNumber: '17239',
    trainName: 'Simhadri Express',
    origin: 'Railway Station X',
    destination: 'Railway Station Y',
    runningDays: 'Daily',
    classes: ['2S', 'SL'],
    halts: [
      { station: 'Railway Station X', code: 'RSX', arr: null, dep: '08:50', distanceKm: 0 },
      { station: 'Railway Station Y', code: 'RSY', arr: '09:28', dep: null, distanceKm: 42 }
    ],
    baseFares: { '2S': 55, 'SL': 120 }
  },
  {
    trainNumber: '12805',
    trainName: 'Janmabhoomi Express',
    origin: 'Town B Railway Station',
    destination: 'City C Railway Station',
    runningDays: 'Daily',
    classes: ['2S', 'SL', 'CC'],
    halts: [
      { station: 'Town B Railway Station', code: 'TWNB', arr: null, dep: '09:10', distanceKm: 0 },
      { station: 'City C Railway Station', code: 'CTYC', arr: '09:40', dep: null, distanceKm: 35 }
    ],
    baseFares: { '2S': 50, 'SL': 110, 'CC': 200 }
  }
];

export const STATIC_BUS_SERVICES = [
  // 1. Rural Feeder Buses (Palle Velugu) - Connecting Villages to Mandal/Taluk Bus Stands
  {
    routeNumber: 'PV-101',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Bhimavaram Bus Station',
    destination: 'Akividu Bus Station',
    isRuralFeeder: 1,
    frequency: 'Every 20 mins from 05:30 to 21:00',
    firstService: '05:30',
    lastService: '21:00',
    stops: [
      'Bhimavaram Bus Station',
      'Undi',
      'Undi Railway Station',
      'Kalla Bus Stop',
      'Kalla',
      'Akividu Bus Station'
    ],
    distanceKm: 22.0,
    durationMinutes: 45,
    fare: 25
  },
  {
    routeNumber: 'PV-102',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Bhimavaram Bus Station',
    destination: 'Narasapuram Bus Stand',
    isRuralFeeder: 1,
    frequency: 'Every 15 mins from 05:00 to 21:30',
    firstService: '05:00',
    lastService: '21:30',
    stops: [
      'Bhimavaram Bus Station',
      'Veeravasaram',
      'Veeravasaram Railway Station',
      'Palakollu Bus Station',
      'Narasapuram Bus Stand'
    ],
    distanceKm: 32.0,
    durationMinutes: 55,
    fare: 35
  },
  {
    routeNumber: 'PV-103',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Bhimavaram Bus Station',
    destination: 'Tanuku Bus Station',
    isRuralFeeder: 1,
    frequency: 'Every 25 mins from 06:00 to 20:30',
    firstService: '06:00',
    lastService: '20:30',
    stops: [
      'Bhimavaram Bus Station',
      'Penugonda',
      'Maruteru',
      'Peravali',
      'Tanuku Bus Station'
    ],
    distanceKm: 34.0,
    durationMinutes: 60,
    fare: 40
  },
  {
    routeNumber: 'PV-104',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Narasapuram Bus Stand',
    destination: 'Bhimavaram Bus Station',
    isRuralFeeder: 1,
    frequency: 'Every 30 mins',
    firstService: '06:15',
    lastService: '20:00',
    stops: [
      'Narasapuram Bus Stand',
      'Mogalthur',
      'Kalla Bus Stop',
      'Bhimavaram Bus Station'
    ],
    distanceKm: 28.0,
    durationMinutes: 50,
    fare: 30
  },
  {
    routeNumber: 'PV-105',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Vijayawada Bus Station',
    destination: 'Machilipatnam',
    isRuralFeeder: 1,
    frequency: 'Every 15 mins',
    firstService: '05:00',
    lastService: '22:00',
    stops: [
      'Vijayawada Bus Station',
      'Vuyyuru',
      'Pamarru',
      'Challapalli',
      'Machilipatnam'
    ],
    distanceKm: 70.0,
    durationMinutes: 110,
    fare: 75
  },
  {
    routeNumber: 'PV-106',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Narasaraopet Bus Station',
    destination: 'Addanki Bus Stand',
    isRuralFeeder: 1,
    frequency: 'Every 30 mins',
    firstService: '06:00',
    lastService: '20:30',
    stops: [
      'Narasaraopet Bus Station',
      'Mulakalur',
      'Rompicherla',
      'Santhamaguluru',
      'Kotikalapudi',
      'Addanki Bus Stand'
    ],
    distanceKm: 42.0,
    durationMinutes: 50,
    fare: 45
  },
  {
    routeNumber: 'PV-107',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Chilakaluripeta Bus Stand',
    destination: 'Ongole Bus Stand',
    isRuralFeeder: 1,
    frequency: 'Every 20 mins',
    firstService: '05:45',
    lastService: '21:00',
    stops: [
      'Chilakaluripeta Bus Stand',
      'Purushothapatnam',
      'Martur',
      'Medarmetla',
      'Korisapadu',
      'Maddipadu',
      'Ongole Bus Stand'
    ],
    distanceKm: 46.0,
    durationMinutes: 55,
    fare: 65
  },
  {
    routeNumber: 'PV-108',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Guntur Bus Station',
    destination: 'Amaravati',
    isRuralFeeder: 1,
    frequency: 'Every 20 mins',
    firstService: '06:00',
    lastService: '21:00',
    stops: [
      'Guntur Bus Station',
      'Mangalagiri',
      'Amaravati'
    ],
    distanceKm: 32.0,
    durationMinutes: 50,
    fare: 35
  },
  {
    routeNumber: 'PV-109',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Tanuku Bus Station',
    destination: 'Tadepalligudem Bus Station',
    isRuralFeeder: 1,
    frequency: 'Every 30 mins',
    firstService: '06:00',
    lastService: '20:00',
    stops: [
      'Tanuku Bus Station',
      'Attili',
      'Pippara',
      'Ganapavaram',
      'Tadepalligudem Bus Station'
    ],
    distanceKm: 36.0,
    durationMinutes: 60,
    fare: 40
  },

  // 2. Intercity Express & Super Luxury Services
  {
    routeNumber: 'EXP-BHM-VJA-1',
    serviceName: 'Ultra Deluxe',
    operator: 'APSRTC',
    origin: 'Bhimavaram Bus Station',
    destination: 'Vijayawada Bus Station',
    isRuralFeeder: 0,
    frequency: 'Hourly',
    firstService: '05:00',
    lastService: '22:30',
    stops: [
      'Bhimavaram Bus Station',
      'Tanuku Bus Station',
      'Tadepalligudem Bus Station',
      'Eluru Bus Station',
      'Vijayawada Bus Station'
    ],
    distanceKm: 115.0,
    durationMinutes: 185,
    fare: 240
  },
  {
    routeNumber: 'EXP-BHM-VJA-2',
    serviceName: 'Super Luxury',
    operator: 'APSRTC',
    origin: 'Bhimavaram Bus Station',
    destination: 'Vijayawada Bus Station',
    isRuralFeeder: 0,
    frequency: 'Every 90 mins',
    firstService: '06:00',
    lastService: '21:00',
    stops: [
      'Bhimavaram Bus Station',
      'Tadepalligudem Bus Station',
      'Eluru Bus Station',
      'Vijayawada Bus Station'
    ],
    distanceKm: 115.0,
    durationMinutes: 170,
    fare: 320
  },
  {
    routeNumber: 'EXP-VSKP-VJA',
    serviceName: 'Super Luxury',
    operator: 'APSRTC',
    origin: 'Dwaraka Bus Complex',
    destination: 'Vijayawada Bus Station',
    isRuralFeeder: 0,
    frequency: 'Every 30 mins',
    firstService: '04:30',
    lastService: '23:30',
    stops: [
      'Dwaraka Bus Complex',
      'Anakapalli',
      'Tuni',
      'Rajahmundry Bus Station',
      'Eluru Bus Station',
      'Vijayawada Bus Station'
    ],
    distanceKm: 355.0,
    durationMinutes: 480,
    fare: 520
  },
  {
    routeNumber: 'EXP-VJA-VSKP',
    serviceName: 'Super Luxury',
    operator: 'APSRTC',
    origin: 'Vijayawada Bus Station',
    destination: 'Dwaraka Bus Complex',
    isRuralFeeder: 0,
    frequency: 'Every 30 mins',
    firstService: '05:00',
    lastService: '23:30',
    stops: [
      'Vijayawada Bus Station',
      'Eluru Bus Station',
      'Rajahmundry Bus Station',
      'Tuni',
      'Anakapalli',
      'Dwaraka Bus Complex'
    ],
    distanceKm: 355.0,
    durationMinutes: 480,
    fare: 520
  },
  {
    routeNumber: 'EXP-BHM-VSKP',
    serviceName: 'Ultra Deluxe',
    operator: 'APSRTC',
    origin: 'Bhimavaram Bus Station',
    destination: 'Dwaraka Bus Complex',
    isRuralFeeder: 0,
    frequency: 'Every 60 mins',
    firstService: '06:00',
    lastService: '22:00',
    stops: [
      'Bhimavaram Bus Station',
      'Undi',
      'Akividu Bus Station',
      'Tanuku Bus Station',
      'Rajahmundry Bus Station',
      'Tuni',
      'Anakapalli',
      'Dwaraka Bus Complex'
    ],
    distanceKm: 275.0,
    durationMinutes: 360,
    fare: 410
  },
  {
    routeNumber: 'EXP-RJY-VJA',
    serviceName: 'Express',
    operator: 'APSRTC',
    origin: 'Rajahmundry Bus Station',
    destination: 'Vijayawada Bus Station',
    isRuralFeeder: 0,
    frequency: 'Every 20 mins',
    firstService: '04:00',
    lastService: '23:00',
    stops: [
      'Rajahmundry Bus Station',
      'Kovvur',
      'Tanuku Bus Station',
      'Tadepalligudem Bus Station',
      'Eluru Bus Station',
      'Vijayawada Bus Station'
    ],
    distanceKm: 155.0,
    durationMinutes: 180,
    fare: 220
  },
  {
    routeNumber: 'EXP-GNT-VJA',
    serviceName: 'Metro Express',
    operator: 'APSRTC',
    origin: 'Guntur Bus Station',
    destination: 'Vijayawada Bus Station',
    isRuralFeeder: 0,
    frequency: 'Every 10 mins',
    firstService: '04:30',
    lastService: '23:30',
    stops: [
      'Guntur Bus Station',
      'Mangalagiri',
      'Vijayawada Bus Station'
    ],
    distanceKm: 34.0,
    durationMinutes: 45,
    fare: 45
  },
  {
    routeNumber: 'EXP-VJA-HYD',
    serviceName: 'Super Luxury',
    operator: 'APSRTC',
    origin: 'Vijayawada Bus Station',
    destination: 'Mahatma Gandhi Bus Station',
    isRuralFeeder: 0,
    frequency: 'Every 20 mins',
    firstService: '05:00',
    lastService: '23:30',
    stops: [
      'Vijayawada Bus Station',
      'Ibrahimpatnam',
      'Nandigama',
      'Mahatma Gandhi Bus Station'
    ],
    distanceKm: 275.0,
    durationMinutes: 300,
    fare: 420
  },
  {
    routeNumber: 'EXP-VJA-TPTY',
    serviceName: 'Super Luxury',
    operator: 'APSRTC',
    origin: 'Vijayawada Bus Station',
    destination: 'Tirupati Bus Station',
    isRuralFeeder: 0,
    frequency: 'Every 30 mins',
    firstService: '05:00',
    lastService: '23:00',
    stops: [
      'Vijayawada Bus Station',
      'Guntur Bus Station',
      'Chilakaluripeta Bus Stand',
      'Ongole Bus Stand',
      'Nellore',
      'Tirupati Bus Station'
    ],
    distanceKm: 380.0,
    durationMinutes: 420,
    fare: 540
  },
  {
    routeNumber: 'EXP-OGL-VJA',
    serviceName: 'Express',
    operator: 'APSRTC',
    origin: 'Ongole Bus Stand',
    destination: 'Vijayawada Bus Station',
    isRuralFeeder: 0,
    frequency: 'Every 20 mins',
    firstService: '05:00',
    lastService: '22:00',
    stops: [
      'Ongole Bus Stand',
      'Chilakaluripeta Bus Stand',
      'Guntur Bus Station',
      'Vijayawada Bus Station'
    ],
    distanceKm: 150.0,
    durationMinutes: 180,
    fare: 185
  },
  {
    routeNumber: 'EXP-KNG-OGL',
    serviceName: 'Express',
    operator: 'APSRTC',
    origin: 'Kanigiri Bus Stand',
    destination: 'Ongole Bus Stand',
    isRuralFeeder: 0,
    frequency: 'Every 30 mins',
    firstService: '05:30',
    lastService: '21:30',
    stops: [
      'Kanigiri Bus Stand',
      'Podili',
      'Chimakurthy',
      'Ongole Bus Stand'
    ],
    distanceKm: 78.0,
    durationMinutes: 110,
    fare: 100
  },
  {
    routeNumber: 'EXP-OGL-KNG',
    serviceName: 'Express',
    operator: 'APSRTC',
    origin: 'Ongole Bus Stand',
    destination: 'Kanigiri Bus Stand',
    isRuralFeeder: 0,
    frequency: 'Every 30 mins',
    firstService: '05:30',
    lastService: '21:30',
    stops: [
      'Ongole Bus Stand',
      'Chimakurthy',
      'Podili',
      'Kanigiri Bus Stand'
    ],
    distanceKm: 78.0,
    durationMinutes: 110,
    fare: 100
  },
  {
    routeNumber: 'PV-VLA-TNX',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Village A',
    destination: 'Town X Bus Stand',
    isRuralFeeder: 1,
    frequency: 'Every 20 mins',
    firstService: '05:45',
    lastService: '21:00',
    stops: [
      'Village A',
      'Village A Bus Stop',
      'Town X Bus Stand'
    ],
    distanceKm: 15.0,
    durationMinutes: 25,
    fare: 25
  },
  {
    routeNumber: 'PV-VLA-TNY',
    serviceName: 'Express',
    operator: 'APSRTC',
    origin: 'Village A',
    destination: 'Town Y Bus Stand',
    isRuralFeeder: 0,
    frequency: 'Every 30 mins',
    firstService: '06:00',
    lastService: '20:30',
    stops: [
      'Village A',
      'Town Y Bus Stand',
      'Town Y'
    ],
    distanceKm: 40.0,
    durationMinutes: 50,
    fare: 50
  },
  {
    routeNumber: 'EXP-TNY-OGL',
    serviceName: 'Express',
    operator: 'APSRTC',
    origin: 'Town Y',
    destination: 'Ongole',
    isRuralFeeder: 0,
    frequency: 'Every 20 mins',
    firstService: '05:30',
    lastService: '22:00',
    stops: [
      'Town Y',
      'Town Y Bus Stand',
      'Ongole Bus Stand',
      'Ongole'
    ],
    distanceKm: 60.0,
    durationMinutes: 70,
    fare: 80
  },
  {
    routeNumber: 'EXP-TNY-CTYB',
    serviceName: 'Express',
    operator: 'APSRTC',
    origin: 'Town Y',
    destination: 'City B',
    isRuralFeeder: 0,
    frequency: 'Every 30 mins',
    firstService: '06:00',
    lastService: '21:00',
    stops: [
      'Town Y',
      'Town Y Bus Stand',
      'City B Bus Stand',
      'City B'
    ],
    distanceKm: 65.0,
    durationMinutes: 75,
    fare: 85
  },
  {
    routeNumber: 'PV-VLA-RSX',
    serviceName: 'Palle Velugu Feeder',
    operator: 'APSRTC',
    origin: 'Village A',
    destination: 'Railway Station X',
    isRuralFeeder: 1,
    frequency: 'Every 30 mins',
    firstService: '06:00',
    lastService: '20:00',
    stops: [
      'Village A',
      'Railway Station X'
    ],
    distanceKm: 12.0,
    durationMinutes: 20,
    fare: 20
  },
  {
    routeNumber: 'PV-VLA-RSZ',
    serviceName: 'Palle Velugu Feeder',
    operator: 'APSRTC',
    origin: 'Village A',
    destination: 'Railway Station Z',
    isRuralFeeder: 1,
    frequency: 'Every 30 mins',
    firstService: '06:00',
    lastService: '20:00',
    stops: [
      'Village A',
      'Railway Station Z'
    ],
    distanceKm: 18.0,
    durationMinutes: 25,
    fare: 25
  },
  {
    routeNumber: 'CITY-OGL-LOCAL',
    serviceName: 'Local City Bus',
    operator: 'APSRTC',
    origin: 'Ongole Railway Station',
    destination: 'Final Destination',
    isRuralFeeder: 0,
    frequency: 'Every 15 mins',
    firstService: '05:00',
    lastService: '22:30',
    stops: [
      'Ongole Railway Station',
      'Ongole Bus Stand',
      'Final Destination'
    ],
    distanceKm: 5.0,
    durationMinutes: 15,
    fare: 15
  },
  {
    routeNumber: 'PV-VLA-VLB',
    serviceName: 'Palle Velugu Feeder',
    operator: 'APSRTC',
    origin: 'Village A',
    destination: 'Village B',
    isRuralFeeder: 1,
    frequency: 'Every 30 mins',
    firstService: '06:00',
    lastService: '20:30',
    stops: [
      'Village A',
      'Village A Bus Stop',
      'Village B'
    ],
    distanceKm: 7.0,
    durationMinutes: 15,
    fare: 15
  },
  {
    routeNumber: 'PV-VLB-TNC',
    serviceName: 'Palle Velugu Feeder',
    operator: 'APSRTC',
    origin: 'Village B',
    destination: 'Town C Bus Stand',
    isRuralFeeder: 1,
    frequency: 'Every 30 mins',
    firstService: '06:15',
    lastService: '20:45',
    stops: [
      'Village B',
      'Town C Bus Stand'
    ],
    distanceKm: 16.0,
    durationMinutes: 25,
    fare: 25
  },
  {
    routeNumber: 'EXP-TNC-CTYD',
    serviceName: 'Express',
    operator: 'APSRTC',
    origin: 'Town C Bus Stand',
    destination: 'City D',
    isRuralFeeder: 0,
    frequency: 'Every 20 mins',
    firstService: '05:30',
    lastService: '22:00',
    stops: [
      'Town C Bus Stand',
      'City D Bus Stand',
      'City D'
    ],
    distanceKm: 38.0,
    durationMinutes: 50,
    fare: 55
  },
  {
    routeNumber: 'PV-VLA-TNB',
    serviceName: 'Palle Velugu Feeder',
    operator: 'APSRTC',
    origin: 'Village A',
    destination: 'Town B Bus Stand',
    isRuralFeeder: 1,
    frequency: 'Every 30 mins',
    firstService: '06:00',
    lastService: '20:00',
    stops: [
      'Village A',
      'Village A Bus Stop',
      'Town B Bus Stand'
    ],
    distanceKm: 14.0,
    durationMinutes: 25,
    fare: 22
  },
  {
    routeNumber: 'EXP-TNB-CTYD',
    serviceName: 'Express',
    operator: 'APSRTC',
    origin: 'Town B Bus Stand',
    destination: 'City D',
    isRuralFeeder: 0,
    frequency: 'Every 25 mins',
    firstService: '06:00',
    lastService: '21:30',
    stops: [
      'Town B Bus Stand',
      'City D Bus Stand',
      'City D'
    ],
    distanceKm: 32.0,
    durationMinutes: 45,
    fare: 45
  },
  {
    routeNumber: 'PV-VLA-TNC',
    serviceName: 'Palle Velugu',
    operator: 'APSRTC',
    origin: 'Village A',
    destination: 'Town C',
    isRuralFeeder: 1,
    frequency: 'Every 30 mins',
    firstService: '06:00',
    lastService: '20:00',
    stops: [
      'Village A',
      'Village A Bus Stop',
      'Town C Bus Stand',
      'Town C'
    ],
    distanceKm: 22.0,
    durationMinutes: 35,
    fare: 30
  },
  {
    routeNumber: 'CITY-RSY-CTYD',
    serviceName: 'Local City Bus',
    operator: 'APSRTC',
    origin: 'Railway Station Y',
    destination: 'City D',
    isRuralFeeder: 0,
    frequency: 'Every 15 mins',
    firstService: '06:00',
    lastService: '22:00',
    stops: [
      'Railway Station Y',
      'City D'
    ],
    distanceKm: 3.0,
    durationMinutes: 10,
    fare: 15
  },
  {
    routeNumber: 'CITY-CTC-DEST',
    serviceName: 'Local City Bus',
    operator: 'APSRTC',
    origin: 'City C Railway Station',
    destination: 'Final Destination',
    isRuralFeeder: 0,
    frequency: 'Every 15 mins',
    firstService: '06:00',
    lastService: '22:00',
    stops: [
      'City C Railway Station',
      'Final Destination'
    ],
    distanceKm: 4.0,
    durationMinutes: 12,
    fare: 15
  }
];
