const { findMultiModalRoutes } = require('../backend/services/routingEngine');

async function testFastestAndBudgetRoutes() {
  console.log('Testing fastest & budget route designation...');

  // Test 1: Intercity route (e.g. Vijayawada to Hyderabad)
  const results = await findMultiModalRoutes('Vijayawada', 'Hyderabad', '2026-10-05', 1, null);
  console.log(`\nTest 1 (Vijayawada -> Hyderabad): Found ${results.length} routes.`);

  const fastestRoutes = results.filter(r => r.isFastest);
  const budgetRoutes = results.filter(r => r.isBudget);

  console.log(`Fastest routes count: ${fastestRoutes.length}`);
  console.log(`Budget routes count: ${budgetRoutes.length}`);

  const minDuration = Math.min(...results.map(r => r.totalDurationMinutes));
  const minPrice = Math.min(...results.map(r => r.totalPrice));

  console.log(`Min duration: ${minDuration} mins, Min price: ₹${minPrice}`);

  for (const r of fastestRoutes) {
    console.log(`⚡ Fastest Route: "${r.routeName}" | Duration: ${r.totalDurationMinutes} mins | Price: ₹${r.totalPrice} | tag: ${r.tag}`);
    if (r.totalDurationMinutes !== minDuration) {
      throw new Error(`Expected fastest route duration ${minDuration}, got ${r.totalDurationMinutes}`);
    }
  }

  for (const r of budgetRoutes) {
    console.log(`💰 Budget Route: "${r.routeName}" | Duration: ${r.totalDurationMinutes} mins | Price: ₹${r.totalPrice} | tag: ${r.tag}`);
    if (r.totalPrice !== minPrice) {
      throw new Error(`Expected budget route price ${minPrice}, got ${r.totalPrice}`);
    }
  }

  // Test 2: Rural route (e.g. Kanigiri to Ongole)
  const resultsRural = await findMultiModalRoutes('Kanigiri', 'Ongole', '2026-10-05', 1, null);
  console.log(`\nTest 2 (Kanigiri -> Ongole): Found ${resultsRural.length} routes.`);
  const fastestRural = resultsRural.filter(r => r.isFastest);
  const budgetRural = resultsRural.filter(r => r.isBudget);
  const minRuralDur = Math.min(...resultsRural.map(r => r.totalDurationMinutes));
  const minRuralPrice = Math.min(...resultsRural.map(r => r.totalPrice));

  console.log(`Min rural duration: ${minRuralDur} mins, Min rural price: ₹${minRuralPrice}`);
  for (const r of fastestRural) {
    console.log(`⚡ Fastest Rural Route: "${r.routeName}" | Duration: ${r.totalDurationMinutes} mins | Price: ₹${r.totalPrice}`);
  }
  for (const r of budgetRural) {
    console.log(`💰 Budget Rural Route: "${r.routeName}" | Duration: ${r.totalDurationMinutes} mins | Price: ₹${r.totalPrice}`);
  }

  console.log('\nAll fastest & budget route verification tests PASSED successfully!');
}

testFastestAndBudgetRoutes().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
