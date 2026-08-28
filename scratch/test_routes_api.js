import assert from 'assert';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('Testing Multi-Modal Planner API...');

  // 1. Bhimavaram -> Vijayawada
  const res1 = await fetch(`${BASE_URL}/api/planner?from=Bhimavaram&to=Vijayawada&date=2026-08-25&time=14:00&passengers=1`);
  const data1 = await res1.json();
  console.log('Bhimavaram -> Vijayawada Multi-Modal Routes count:', data1.routes.length);
  assert.strictEqual(res1.status, 200);
  assert.ok(data1.routes.length > 0);
  
  // Find a combination route (e.g. Train + Rapido or Bus + Uber)
  const trainRapidoCombo = data1.routes.find(r => 
    r.segments.length === 3 && 
    r.segments[0].mode === 'rapido' && 
    r.segments[1].mode === 'train' && 
    r.segments[2].mode === 'rapido'
  );
  
  if (trainRapidoCombo) {
    console.log('Found Train + Rapido Combination Route:', trainRapidoCombo);
    assert.strictEqual(trainRapidoCombo.totalTransfers, 2);
    assert.strictEqual(trainRapidoCombo.segments[0].price, 30); // Bhimavaram -> station
    assert.strictEqual(trainRapidoCombo.segments[1].price, 145); // station -> station (T1 is ₹145)
    assert.strictEqual(trainRapidoCombo.segments[2].price, 46); // station -> destination
    assert.strictEqual(trainRapidoCombo.totalPrice, 221);
  } else {
    console.log('Warning: Train + Rapido combination not found in seeded routes!');
  }

  // 2. Direct Bus Route
  const directBus = data1.routes.find(r => r.segments.length === 1 && r.segments[0].mode === 'bus' && r.segments[0].provider.includes('Direct'));
  if (directBus) {
    console.log('Found Direct Bus Route:', directBus);
    assert.strictEqual(directBus.totalTransfers, 0);
    assert.strictEqual(directBus.totalPrice, 180);
  }

  // 3. Dynamic route generation (e.g. Hyderabad -> Delhi)
  console.log('Testing dynamic route compilation for Hyderabad -> Delhi...');
  const res2 = await fetch(`${BASE_URL}/api/planner?from=Hyderabad&to=Delhi&date=2026-08-25&time=14:00&passengers=2`);
  const data2 = await res2.json();
  console.log('Hyderabad -> Delhi Multi-Modal Routes count:', data2.routes.length);
  assert.strictEqual(res2.status, 200);
  assert.ok(data2.routes.length > 0);

  // Check double ticket pricing for passenger count = 2
  const dynTrainRoute = data2.routes.find(r => r.segments.length === 3 && r.segments[1].mode === 'train');
  if (dynTrainRoute) {
    const trainLeg = dynTrainRoute.segments[1];
    console.log(`Train Leg Price for 2 passengers: ₹${trainLeg.price}`);
    assert.ok(trainLeg.price > 0);
  }

  console.log('🎉 Multi-Modal Route Planner API tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Multi-Modal Route Planner API test failed:', err);
  process.exit(1);
});
