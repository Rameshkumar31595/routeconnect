import assert from 'assert';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('Starting programmatic API testing...');

  const uniqueEmail = `test_${Date.now()}@example.com`;
  const testPhone = '1234567890';

  // 1. Sign Up
  console.log('Testing Sign Up...');
  const signUpRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Integration Test User',
      email: uniqueEmail,
      phone: testPhone,
      password: 'testpassword123',
      confirmPassword: 'testpassword123',
    }),
  });

  const signUpData = await signUpRes.json();
  console.log('Sign Up Response:', signUpData);
  assert.strictEqual(signUpRes.status, 201, 'Signup status should be 201');
  assert.ok(signUpData.sessionId, 'Signup should return a sessionId');

  // 2. Sign In with Email
  console.log('Testing Sign In with Email...');
  const signInEmailRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: uniqueEmail,
      password: 'testpassword123',
    }),
  });

  const signInEmailData = await signInEmailRes.json();
  console.log('Sign In with Email Response:', signInEmailData);
  assert.strictEqual(signInEmailRes.status, 200, 'Login by email status should be 200');
  assert.ok(signInEmailData.sessionId, 'Login by email should return a sessionId');

  // 3. Sign In with Phone Number
  console.log('Testing Sign In with Phone Number...');
  const signInPhoneRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: testPhone,
      password: 'testpassword123',
    }),
  });

  const signInPhoneData = await signInPhoneRes.json();
  console.log('Sign In with Phone Response:', signInPhoneData);
  assert.strictEqual(signInPhoneRes.status, 200, 'Login by phone status should be 200');
  assert.ok(signInPhoneData.sessionId, 'Login by phone should return a sessionId');

  const activeSessionId = signInPhoneData.sessionId;

  // 4. Get Profile
  console.log('Testing Get Profile...');
  const profileRes = await fetch(`${BASE_URL}/api/auth/profile/${activeSessionId}`);
  const profileData = await profileRes.json();
  console.log('Get Profile Response:', profileData);
  assert.strictEqual(profileRes.status, 200, 'Profile fetch status should be 200');

  // 5. Logout
  console.log('Testing Logout...');
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout/${activeSessionId}`, {
    method: 'POST',
  });
  const logoutData = await logoutRes.json();
  console.log('Logout Response:', logoutData);
  assert.strictEqual(logoutRes.status, 200, 'Logout status should be 200');

  console.log('🎉 All email and phone sign-in integration tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Integration test failed:', err);
  process.exit(1);
});
