import fs from 'fs';

async function runAllValidations() {
  console.log('========================================');
  console.log('ROUTE CONNECT COMPREHENSIVE VERIFICATION');
  console.log('========================================\n');

  let allPassed = true;

  // 1. First Page Text Verification
  const loginCode = fs.readFileSync('src/pages/Login.tsx', 'utf-8');
  const hasOldText = /unified\s+multi-mod(al|e)\s+planner/i.test(loginCode);
  const hasNewText = loginCode.includes('Practical Route Combinations');
  if (!hasOldText && hasNewText) {
    console.log('PASS REQ 1: "Unified Multi-Mode Planner" removed; "Practical Route Combinations" present on first page.');
  } else {
    console.error('FAIL REQ 1: Check Login.tsx text.');
    allPassed = false;
  }

  // 2. Walking Option Verification
  // Test A: <= 1.0 km
  const rWalkClose = await fetch('http://localhost:5000/api/planner?from=Bhimavaram&to=Bhimavaram%20Bus%20Station').then(r=>r.json());
  const walkCloseSeg = rWalkClose.routes?.flatMap(r=>r.segments).find(s=>s.mode === 'walking');
  const otherModesClose = rWalkClose.routes?.flatMap(r=>r.segments).some(s=>s.mode !== 'walking');
  
  // Test B: > 1.0 km
  const rWalkFar = await fetch('http://localhost:5000/api/planner?from=Bhimavaram%20Junction&to=Bhimavaram%20Bus%20Station').then(r=>r.json());
  const walkFarSeg = rWalkFar.routes?.flatMap(r=>r.segments).find(s=>s.mode === 'walking');
  const otherModesFar = rWalkFar.routes?.flatMap(r=>r.segments).some(s=>s.mode !== 'walking');

  if (walkCloseSeg && walkCloseSeg.distanceKm <= 1.0 && otherModesClose && !walkFarSeg && otherModesFar) {
    console.log('PASS REQ 2: Walking filter works accurately (shown when <= 1.0km (' + walkCloseSeg.distanceKm + 'km), hidden when > 1.0km, other modes preserved).');
  } else {
    console.error('FAIL REQ 2: Walking filter logic mismatch.', { walkCloseSeg, walkFarSeg });
    allPassed = false;
  }

  // 3. Narasaraopet -> Ongole Route Alternatives
  const rNrtOng = await fetch('http://localhost:5000/api/planner?from=Narasaraopet&to=Ongole').then(r=>r.json());
  const viaAddanki = rNrtOng.routes?.find(r => r.routeName === 'Via Addanki');
  const viaChilak = rNrtOng.routes?.find(r => r.routeName === 'Via Chilakaluripeta');
  const neitherTaggedBest = rNrtOng.routes?.every(r => r.tag !== 'best');

  if (rNrtOng.routes?.length === 2 && viaAddanki && viaChilak && neitherTaggedBest) {
    console.log('PASS REQ 3: Narasaraopet -> Ongole returns 2 distinct alternatives ("Via Addanki" & "Via Chilakaluripeta") with no route forced as "best".');
  } else {
    console.error('FAIL REQ 3: Route alternatives mismatch.', rNrtOng);
    allPassed = false;
  }

  // 4. Villages Along Each Route
  const expectedAddankiVillages = [
    'Narasaraopet', 'Mulakalur', 'Rompicherla', 'Santhamaguluru',
    'Kotikalapudi', 'Addanki', 'Medarmetla', 'Korisapadu', 'Maddipadu', 'Ongole'
  ];
  const expectedChilakVillages = [
    'Narasaraopet', 'Mulakalur', 'Kakani', 'Nadendla',
    'Chilakaluripeta', 'Purushothapatnam', 'Martur', 'Medarmetla', 'Maddipadu', 'Ongole'
  ];

  const addankiMatches = JSON.stringify(viaAddanki?.villages) === JSON.stringify(expectedAddankiVillages);
  const chilakMatches = JSON.stringify(viaChilak?.villages) === JSON.stringify(expectedChilakVillages);

  if (addankiMatches && chilakMatches) {
    console.log('PASS REQ 4: Accurate factual road villages stored & returned for both route alternatives:');
    console.log('   Via Addanki (' + viaAddanki.distanceKm + ' km, ' + viaAddanki.totalDurationMinutes + ' min):', viaAddanki.villages.join(' -> '));
    console.log('   Via Chilakaluripeta (' + viaChilak.distanceKm + ' km, ' + viaChilak.totalDurationMinutes + ' min):', viaChilak.villages.join(' -> '));
  } else {
    console.error('FAIL REQ 4: Village progression mismatch.', { viaAddanki: viaAddanki?.villages, viaChilak: viaChilak?.villages });
    allPassed = false;
  }

  // 5. Reverse Direction (Ongole -> Narasaraopet) & Case Insensitivity
  const rOngNrt = await fetch('http://localhost:5000/api/planner?from=ongole&to=narasaraopet').then(r=>r.json());
  const revAddanki = rOngNrt.routes?.find(r => r.routeName === 'Via Addanki');
  const revChilak = rOngNrt.routes?.find(r => r.routeName === 'Via Chilakaluripeta');
  const revAddankiMatches = JSON.stringify(revAddanki?.villages) === JSON.stringify([...expectedAddankiVillages].reverse());
  const revChilakMatches = JSON.stringify(revChilak?.villages) === JSON.stringify([...expectedChilakVillages].reverse());

  if (rOngNrt.routes?.length === 2 && revAddankiMatches && revChilakMatches) {
    console.log('PASS REQ 5: Reverse direction (Ongole -> Narasaraopet) & case-insensitivity works cleanly with reversed villages:');
    console.log('   Via Addanki Reverse:', revAddanki.villages.join(' -> '));
    console.log('   Via Chilakaluripeta Reverse:', revChilak.villages.join(' -> '));
  } else {
    console.error('FAIL REQ 5: Reverse direction matching failed.', rOngNrt);
    allPassed = false;
  }

  console.log('\n========================================');
  console.log(allPassed ? 'ALL VERIFICATIONS PASSED SUCCESSFULLY!' : 'SOME CHECKS FAILED');
  console.log('========================================');
}

runAllValidations();
