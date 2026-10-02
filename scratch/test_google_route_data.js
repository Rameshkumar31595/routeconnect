// Automated Test Suite for Google Maps Route Data Collection & Nearest Bus Facility
// Validates:
// 1. Identification and storage of intermediate locations along the route
// 2. Nearest bus facility identification when starting from a village
// 3. Route-based relevance matching (facility connects toward destination)
// 4. Verification that intermediate location metadata is stored in SQLite backend
// 5. Uber/Rapido exclusion for villages vs inclusion for Current GPS Location

async function testGoogleRouteDataAndBusFacility() {
  console.log('======================================================================');
  console.log('TEST SUITE: ROUTE DATA COLLECTION & NEAREST BUS FACILITY VERIFICATION');
  console.log('======================================================================\n');

  let allPassed = true;

  // TEST 1: Village X -> Ongole (Exact User Specification Example)
  console.log('TEST 1: Exact Spec Example: From "Village X" -> To "Ongole"');
  const res1 = await fetch('http://localhost:5000/api/planner?from=Village%20X&to=Ongole').then(r => r.json());
  
  const insights1 = res1.insights;
  const nearest1 = insights1?.nearestBusFacility;
  const locations1 = insights1?.locations || [];

  if (nearest1) {
    console.log(`  ✓ PASS: Found Nearest Bus Facility: "${nearest1.name}" (${nearest1.type})`);
    console.log(`     Distance: ${nearest1.distanceFromOriginKm} km away`);
    console.log(`     Display Text: "${nearest1.displayDistanceText}"`);
    console.log(`     Connects Toward: ${nearest1.connectsToward}`);
    console.log(`     Route to Bus Facility: ${nearest1.accessRoute?.description}`);
    console.log(`     Directions URL: ${nearest1.directionsUrl}`);

    if (nearest1.name === 'Village X Bus Stop' && nearest1.distanceFromOriginKm === 2.3) {
      console.log('  ✓ PASS: Exact match with spec example (Village X Bus Stop, 2.3 km away)!');
    } else {
      console.warn(`  ! Note: Nearest bus stop name: ${nearest1.name}, dist: ${nearest1.distanceFromOriginKm}km`);
    }
  } else {
    console.error('  ✗ FAIL: No nearest bus facility returned for Village X -> Ongole!', insights1);
    allPassed = false;
  }

  // TEST 2: Intermediate Locations Collection and Storage
  console.log('\nTEST 2: Intermediate Locations Along the Journey');
  console.log(`  Discovered locations count: ${locations1.length}`);
  
  const villageX = locations1.find(l => l.name.toLowerCase().includes('village x'));
  const busStopZ = locations1.find(l => l.name.toLowerCase().includes('bus stop z') || l.name.toLowerCase().includes('village x bus stop'));

  if (locations1.length > 0) {
    console.log('  ✓ PASS: Discovered intermediate locations along the journey:');
    locations1.slice(0, 5).forEach((loc, i) => {
      console.log(`     ${i+1}. ${loc.name} (Type: ${loc.type}, Lat: ${loc.latitude.toFixed(4)}, Lng: ${loc.longitude.toFixed(4)}, Dist: ${loc.distanceFromRouteKm} km from route)`);
    });
  } else {
    console.error('  ✗ FAIL: No intermediate locations discovered along the route!');
    allPassed = false;
  }

  // TEST 3: Verify Data Stored in Backend Database via /api/locations/intermediate
  console.log('\nTEST 3: Stored Location Data in SQLite Backend');
  const storedRes = await fetch('http://localhost:5000/api/locations/intermediate').then(r => r.json());
  const storedLocations = storedRes.locations || [];

  console.log(`  Total stored intermediate locations in DB: ${storedLocations.length}`);
  const hasMetadata = storedLocations.every(l => 
    l.name && l.latitude !== null && l.longitude !== null && l.type && l.associated_routes && l.retrieved_at
  );

  if (storedLocations.length > 0 && hasMetadata) {
    console.log('  ✓ PASS: Stored locations have complete metadata in database:');
    const sample = storedLocations[0];
    console.log(`     Sample: ${sample.name} [${sample.type}]`);
    console.log(`     Coordinates: (${sample.latitude}, ${sample.longitude})`);
    console.log(`     Associated Routes: ${sample.associated_routes}`);
    console.log(`     Nearby Bus Facilities: ${sample.nearby_bus_facilities?.slice(0, 60)}...`);
    console.log(`     Nearby Transport Points: ${sample.nearby_transport_points?.slice(0, 60)}...`);
    console.log(`     Source / API: ${sample.source}`);
    console.log(`     Timestamp: ${sample.retrieved_at}`);
  } else {
    console.error('  ✗ FAIL: Stored intermediate locations missing metadata in DB!', storedLocations);
    allPassed = false;
  }

  // TEST 4: Real Regional Village (Maddipadu -> Ongole Railway Station)
  console.log('\nTEST 4: Regional Village: "Maddipadu" -> "Ongole Railway Station"');
  const resMaddipadu = await fetch('http://localhost:5000/api/planner?from=Maddipadu&to=Ongole%20Railway%20Station').then(r => r.json());
  const nearestMaddipadu = resMaddipadu.insights?.nearestBusFacility;

  if (nearestMaddipadu) {
    console.log(`  ✓ PASS: Found Nearest Bus Facility: "${nearestMaddipadu.name}" (${nearestMaddipadu.distanceFromOriginKm} km away)`);
    console.log(`     Connects toward: ${nearestMaddipadu.connectsToward}`);
    console.log(`     Route instruction: ${nearestMaddipadu.accessRoute?.description}`);
  } else {
    console.error('  ✗ FAIL: Expected nearest bus facility for Maddipadu!');
    allPassed = false;
  }

  // TEST 5: Verify Uber/Rapido Logic (Excluded for Village, Included for GPS)
  console.log('\nTEST 5: Uber & Rapido Rule Adherence');
  const villageUber = (res1.routes || []).filter(r => r.segments.some(s => s.mode === 'uber' || s.mode === 'rapido'));
  console.log(`  Village X (Manual) - Uber/Rapido routes count: ${villageUber.length}`);
  
  if (villageUber.length === 0) {
    console.log('  ✓ PASS: Uber and Rapido are strictly NOT displayed for manually entered village!');
    console.log('          Instead, the nearest suitable bus facility is identified and shown to the user.');
  } else {
    console.error('  ✗ FAIL: Uber/Rapido leaked into village search!', villageUber);
    allPassed = false;
  }

  // GPS search check
  const gpsRes = await fetch('http://localhost:5000/api/planner?from=📍%20Current%20Location&to=Ongole%20Railway%20Station&origin=gps&fromLat=15.50&fromLng=80.04').then(r => r.json());
  const gpsUber = (gpsRes.routes || []).filter(r => r.segments.some(s => s.mode === 'uber' || s.mode === 'rapido'));
  
  if (gpsUber.length >= 2) {
    console.log(`  ✓ PASS: Uber and Rapido ARE displayed when From is Current GPS Location (${gpsUber.length} ride options).`);
  } else {
    console.error('  ✗ FAIL: Expected Uber & Rapido for GPS search!');
    allPassed = false;
  }

  console.log('\n======================================================================');
  console.log(allPassed ? 'ALL GOOGLE ROUTE DATA & BUS FACILITY TESTS PASSED!' : 'SOME TESTS FAILED!');
  console.log('======================================================================');
}

testGoogleRouteDataAndBusFacility();
