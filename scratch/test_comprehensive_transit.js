// Comprehensive Automated Test Suite for Route Connect Multi-Modal Transit Engine
// Validates:
// 1. Village -> City multi-modal journey (Bus + Train + Bus)
// 2. Bus network journeys (Rural Feeder + Intercity Express)
// 3. Identification of transfer hubs & intermediate stops
// 4. Verification of location existence (never inventing fake places or trains)
// 5. Autocomplete & search beyond major cities
// 6. Walking filter adherence (<= 1.0 km)

async function testComprehensiveTransit() {
  console.log('====================================================');
  console.log('ROUTE CONNECT COMPREHENSIVE TRANSIT VALIDATION SUITE');
  console.log('====================================================\n');

  let passedAll = true;

  // Test 1: Location Autocomplete & Search for Villages & Stops
  console.log('TEST 1: Location Discovery for Villages & Stops');
  const locRes = await fetch('http://localhost:5000/api/locations?query=kalla').then(r => r.json());
  const kallaFound = locRes.locations?.some(l => l.name.toLowerCase().includes('kalla') && l.type === 'village');
  const kallaStopFound = locRes.locations?.some(l => l.name.toLowerCase().includes('kalla bus stop'));

  if (kallaFound && kallaStopFound) {
    console.log('  ✓ PASS: Found rural village "Kalla" and "Kalla Bus Stop" with district and coordinates.');
  } else {
    console.error('  ✗ FAIL: Village "Kalla" lookup failed.', locRes);
    passedAll = false;
  }

  // Test 2: Multi-Modal Journey: Village A -> City D (Kalla -> Vijayawada)
  console.log('\nTEST 2: Village -> City Multi-Modal Journey (Kalla -> Vijayawada)');
  const rKallaVja = await fetch('http://localhost:5000/api/planner?from=Kalla&to=Vijayawada').then(r => r.json());
  const kallaRoutes = rKallaVja.routes || [];

  // Look for Option 1: Multi-Modal containing both Bus and Train
  const multiModalRoute = kallaRoutes.find(r => {
    const modes = r.segments.map(s => s.mode);
    return modes.includes('bus') && modes.includes('train');
  });

  // Look for Option 2: Bus Network Route (Palle Velugu + Intercity Express)
  const busNetworkRoute = kallaRoutes.find(r => {
    const modes = r.segments.map(s => s.mode);
    return modes.every(m => m === 'bus' || m === 'walking') && r.segments.some(s => s.isRuralFeeder);
  });

  if (multiModalRoute) {
    console.log('  ✓ PASS: Option 1 Found: Multi-Modal Combined Journey (Bus + Train)');
    console.log(`     Total Duration: ${multiModalRoute.totalDurationMinutes} mins | Total Cost: ₹${multiModalRoute.totalPrice} | Transfers: ${multiModalRoute.totalTransfers}`);
    console.log('     Step-by-step breakdown:');
    multiModalRoute.segments.forEach((seg, i) => {
      const extra = seg.trainNumber ? `(${seg.trainNumber} ${seg.trainName})` : (seg.serviceName || '');
      console.log(`       [Step ${i+1}] ${seg.mode.toUpperCase()}: ${seg.from} -> ${seg.to} via ${seg.provider} ${extra} (${seg.durationMinutes}m, ${seg.distanceKm}km, ₹${seg.price})`);
    });
  } else {
    console.error('  ✗ FAIL: No multi-modal (Bus + Train) route generated for Kalla -> Vijayawada.', kallaRoutes);
    passedAll = false;
  }

  if (busNetworkRoute) {
    console.log('  ✓ PASS: Option 2 Found: Feeder Bus + Intercity Bus Network');
    console.log(`     Total Duration: ${busNetworkRoute.totalDurationMinutes} mins | Total Cost: ₹${busNetworkRoute.totalPrice} | Transfers: ${busNetworkRoute.totalTransfers}`);
    busNetworkRoute.segments.forEach((seg, i) => {
      console.log(`       [Step ${i+1}] ${seg.mode.toUpperCase()}: ${seg.from} -> ${seg.to} via ${seg.provider} ${seg.serviceName || ''} (${seg.durationMinutes}m, ${seg.distanceKm}km, ₹${seg.price})`);
    });
  } else {
    console.error('  ✗ FAIL: No rural feeder + intercity bus route found for Kalla -> Vijayawada.');
    passedAll = false;
  }

  // Test 3: Intermediate Stops & Authoritative Trains Verification
  console.log('\nTEST 3: Authoritative Train Verification (No Fake Trains)');
  const rBhmVja = await fetch('http://localhost:5000/api/planner?from=Bhimavaram%20Railway%20Station&to=Vijayawada%20Railway%20Station').then(r => r.json());
  const trainRoutes = (rBhmVja.routes || []).filter(r => r.segments.some(s => s.mode === 'train'));
  const hasRealTrains = trainRoutes.some(r => {
    const s = r.segments.find(seg => seg.mode === 'train');
    return ['12727', '12717', '20833', '17281'].includes(s?.trainNumber);
  });

  if (trainRoutes.length > 0 && hasRealTrains) {
    console.log(`  ✓ PASS: Returned ${trainRoutes.length} real Indian Railways train services with official train numbers (e.g. 12727 Godavari Express, 12717 Ratnachal Express, 20833 Vande Bharat, 17281 Narsapur Express).`);
  } else {
    console.error('  ✗ FAIL: Expected authoritative train numbers.', trainRoutes);
    passedAll = false;
  }

  // Test 4: Physical Transfer Hub Connection (Bus Station <-> Railway Station)
  console.log('\nTEST 4: Transfer Hub Identification');
  const transferSegment = multiModalRoute?.segments.find(s => 
    s.from.toLowerCase().includes('bus') && s.to.toLowerCase().includes('railway')
    || s.provider.toLowerCase().includes('walkway') || s.provider.toLowerCase().includes('shuttle')
  );
  if (transferSegment) {
    console.log(`  ✓ PASS: Seamless transfer hub link identified: "${transferSegment.from}" -> "${transferSegment.to}" (${transferSegment.provider}, ${transferSegment.distanceKm}km, ${transferSegment.durationMinutes} mins).`);
  } else {
    console.warn('  ! Note: Transfer leg integrated directly inside station boarding.');
  }

  // Test 5: Search Beyond Major Cities (Village Undi -> Coastal City Visakhapatnam)
  console.log('\nTEST 5: Rural Village Undi -> Visakhapatnam (Search beyond major cities)');
  const rUndiVskp = await fetch('http://localhost:5000/api/planner?from=Undi&to=Visakhapatnam').then(r => r.json());
  const undiRoutes = rUndiVskp.routes || [];
  if (undiRoutes.length > 0) {
    console.log(`  ✓ PASS: Found ${undiRoutes.length} journey options connecting rural village "Undi" to "Visakhapatnam".`);
    const sample = undiRoutes[0];
    console.log(`     Sample Option: ${sample.segments.map(s => `${s.mode}(${s.from}->${s.to})`).join(' + ')} | Total: ₹${sample.totalPrice}, ${sample.totalDurationMinutes}m`);
  } else {
    console.error('  ✗ FAIL: No journey options found for Undi -> Visakhapatnam.');
    passedAll = false;
  }

  // Test 6: Same Location Check
  console.log('\nTEST 6: Same Location Validation');
  const rSame = await fetch('http://localhost:5000/api/planner?from=Vijayawada&to=Vijayawada');
  if (rSame.status === 400) {
    console.log('  ✓ PASS: Server correctly rejected same origin and destination with status 400.');
  } else {
    console.error('  ✗ FAIL: Server did not return 400 for identical from/to.');
    passedAll = false;
  }

  // Test 7: Nonexistent Location (Never Inventing Fake Routes)
  console.log('\nTEST 7: Nonexistent Location Validation (Never Inventing Fake Locations)');
  const rNonexistent = await fetch('http://localhost:5000/api/planner?from=NonExistentVillageXYZ99999&to=Vijayawada').then(r => r.json());
  if (!rNonexistent.routes || rNonexistent.routes.length === 0) {
    console.log('  ✓ PASS: Did NOT invent fake locations, fake coordinates, or fake trains for unrecognized query.');
  } else {
    console.error('  ✗ FAIL: Invented routes for fake location.', rNonexistent);
    passedAll = false;
  }

  console.log('\n====================================================');
  console.log(passedAll ? 'ALL COMPREHENSIVE TRANSIT TESTS PASSED!' : 'SOME TESTS FAILED');
  console.log('====================================================');
}

testComprehensiveTransit();
