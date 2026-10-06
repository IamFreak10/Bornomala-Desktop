async function testAuth() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';
  
  console.log('1. Signing up...');
  const res1 = await fetch('http://localhost:3000/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  
  const token = res1.headers.get('set-auth-token');
  console.log('Signup status:', res1.status);
  console.log('set-auth-token received:', token ? 'YES (length ' + token.length + ')' : 'NO');
  
  if (!token) {
    console.error('Failed to get token!');
    return;
  }
  
  console.log('\n2. Testing get-session with Bearer token...');
  const res2 = await fetch('http://localhost:3000/api/auth/get-session', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const session = await res2.json();
  console.log('Session user:', session?.user?.email);
  
  console.log('\n3. Signing out...');
  const res3 = await fetch('http://localhost:3000/api/auth/sign-out', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Signout status:', res3.status);
  
  console.log('\n4. Testing get-session again...');
  const res4 = await fetch('http://localhost:3000/api/auth/get-session', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const sessionAfter = await res4.text();
  console.log('Session after logout:', sessionAfter);
}
testAuth();
