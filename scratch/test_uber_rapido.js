// Automated Test for Current Location-Based Uber & Rapido Options
// Validates:
// Case 1 - Current Location (From: 📍 Current Location with GPS, To: Ongole Railway Station):
//   - Route details present
//   - 🟢 Uber - Available present
//   - 🟢 Rapido - Available present
// Case 2 - Manually Entered Location (From: Kanigiri, To: Ongole Railway Station):
//   - Route details present
//   - ZERO Uber options
//   - ZERO Rapido options

async function testUberRapidoFeature() {
  console.log('===============================================================');
  console.log('TEST SUITE: CURRENT LOCATION-BASED UBER & RAPIDO VERIFICATION');
  console.log('===============================================================\n');

  let allPassed = true;

  // CASE 1: Current Location with GPS -> Ongole Railway Station
  console.log('CASE 1: From: 📍 Current Location (GPS) -> To: Ongole Railway Station');
  const gpsUrl = 'http://localhost:5000/api/planner?from=📍%20Current%20Location&to=Ongole%20Railway%20Station&origin=gps&fromLat=15.50&fromLng=80.04';
  const res1 = await fetch(gpsUrl).then(r => r.json());
  
  const routes1 = res1.routes || [];
  const originType1 = res1.originType;
  
  const uberRoute = routes1.find(r => r.segments.some(s => s.mode === 'uber'));
  const rapidoRoute = routes1.find(r => r.segments.some(s => s.mode === 'rapido'));
  const transitRoutes1 = routes1.filter(r => !r.segments.some(s => s.mode === 'uber' || s.mode === 'rapido'));

  console.log(`  Origin Type: ${originType1}`);
  console.log(`  Total Routes Returned: ${routes1.length}`);
  console.log(`  Transit Route Details: ${transitRoutes1.length}`);

  if (originType1 === 'CURRENT_GPS_LOCATION') {
    console.log('  ✓ PASS: originType correctly identified as CURRENT_GPS_LOCATION');
  } else {
    console.error('  ✗ FAIL: Expected originType CURRENT_GPS_LOCATION, got:', originType1);
    allPassed = false;
  }

  if (uberRoute) {
    console.log(`  ✓ PASS: 🟢 Uber – Available found! Route: "${uberRoute.from}" ➔ "${uberRoute.to}" (₹${uberRoute.totalPrice}, ${uberRoute.totalDurationMinutes} mins, ${uberRoute.distanceKm} km, Status: ${uberRoute.availabilityStatus || 'Available'})`);
  } else {
    console.error('  ✗ FAIL: Uber option not found for GPS origin!');
    allPassed = false;
  }

  if (rapidoRoute) {
    console.log(`  ✓ PASS: 🟢 Rapido – Available found! Route: "${rapidoRoute.from}" ➔ "${rapidoRoute.to}" (₹${rapidoRoute.totalPrice}, ${rapidoRoute.totalDurationMinutes} mins, ${rapidoRoute.distanceKm} km, Status: ${rapidoRoute.availabilityStatus || 'Available'})`);
  } else {
    console.error('  ✗ FAIL: Rapido option not found for GPS origin!');
    allPassed = false;
  }

  if (transitRoutes1.length > 0) {
    console.log(`  ✓ PASS: Normal route details also provided (${transitRoutes1.length} alternative routes).`);
  } else {
    console.error('  ✗ FAIL: Normal route details missing!');
    allPassed = false;
  }

  // CASE 2: Manually Entered Location (Kanigiri -> Ongole Railway Station)
  console.log('\nCASE 2: From: Kanigiri (Manually Entered) -> To: Ongole Railway Station');
  const manualUrl = 'http://localhost:5000/api/planner?from=Kanigiri&to=Ongole%20Railway%20Station';
  const res2 = await fetch(manualUrl).then(r => r.json());

  const routes2 = res2.routes || [];
  const originType2 = res2.originType;

  const uberInManual = routes2.filter(r => r.segments.some(s => s.mode === 'uber'));
  const rapidoInManual = routes2.filter(r => r.segments.some(s => s.mode === 'rapido'));

  console.log(`  Origin Type: ${originType2}`);
  console.log(`  Total Routes Returned: ${routes2.length}`);
  console.log(`  Uber Options Count: ${uberInManual.length}`);
  console.log(`  Rapido Options Count: ${rapidoInManual.length}`);

  if (originType2 === 'NAMED_LOCATION') {
    console.log('  ✓ PASS: originType correctly identified as NAMED_LOCATION');
  } else {
    console.error('  ✗ FAIL: Expected originType NAMED_LOCATION, got:', originType2);
    allPassed = false;
  }

  if (uberInManual.length === 0 && rapidoInManual.length === 0) {
    console.log('  ✓ PASS: Uber and Rapido options are STRICTLY NOT DISPLAYED for manually entered location!');
  } else {
    console.error('  ✗ FAIL: Uber/Rapido leaked into manually entered location search!', { uberInManual, rapidoInManual });
    allPassed = false;
  }

  if (routes2.length > 0) {
    console.log(`  ✓ PASS: Normal route details displayed (${routes2.length} routes found, e.g. Kanigiri ➔ Ongole Bus Stand ➔ Railway Station).`);
    routes2.slice(0, 2).forEach((r, i) => {
      console.log(`     Route ${i+1}: ${r.segments.map(s => `${s.mode.toUpperCase()}(${s.from} -> ${s.to})`).join(' + ')} (₹${r.totalPrice}, ${r.totalDurationMinutes}m)`);
    });
  } else {
    console.error('  ✗ FAIL: No route details found for Kanigiri -> Ongole Railway Station!');
    allPassed = false;
  }

  console.log('\n===============================================================');
  console.log(allPassed ? 'ALL UBER & RAPIDO FEATURE TESTS PASSED!' : 'SOME TESTS FAILED!');
  console.log('===============================================================');
}

testUberRapidoFeature();
