import { findMultiModalRoutes } from '../backend/services/routingEngine.js';

async function testTimeSync() {
  console.log('Testing Date and Time Synchronization across multiple pairs...\n');

  const pairs = [
    { from: 'Village A', to: 'City B', date: '2026-10-05', time: '07:30' },
    { from: 'Kanigiri', to: 'Vijayawada', date: '2026-10-05', time: '09:00' },
    { from: 'Ongole', to: 'Hyderabad', date: '2026-10-05', time: '14:00' }
  ];

  for (const pair of pairs) {
    console.log(`\n===============================================================`);
    console.log(`PAIR: ${pair.from} -> ${pair.to} | Date: ${pair.date} | Time: ${pair.time}`);
    console.log(`===============================================================`);
    const routes = await findMultiModalRoutes(pair.from, pair.to, pair.date, pair.time, 1, null);
    console.log(`Found ${routes.length} synchronized routes.`);

    routes.slice(0, 2).forEach((r, idx) => {
      console.log(`\n  Option ${idx + 1}: ${r.routeName}`);
      console.log(`  Window: ${r.departureTime} -> ${r.arrivalTime} (${r.totalDurationMinutes} mins, ${r.distanceKm} km, ₹${r.totalPrice})`);
      console.log(`  Transfers (${r.totalTransfers}):`);
      (r.transfers || []).forEach(t => {
        console.log(`    Transfer ${t.transferNumber} at ${t.location}: ${t.window} (${t.transferDurationMinutes}m buffer)`);
      });
      console.log(`  Segments (${r.segments.length}):`);
      r.segments.forEach((s, sIdx) => {
        console.log(`    Step ${sIdx + 1}: [${s.mode.toUpperCase()}] ${s.from} -> ${s.to} (Dep: ${s.departureFormatted}, Arr: ${s.arrivalFormatted}, Type: ${s.timingType})`);
      });
    });
  }
}

testTimeSync().catch(console.error);
