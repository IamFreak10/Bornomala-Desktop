async function testAuth() {
  const email = `test-${Date.now()}@example.com`;
  
  const res1 = await fetch('http://localhost:3000/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173'
    },
    body: JSON.stringify({ email, password: 'password123', name: 'Test User' })
  });
  
  const tokenHeader = res1.headers.get('set-auth-token');
  console.log('set-auth-token:', tokenHeader);
  
  if (tokenHeader) {
      console.log('Testing get-session with Bearer token...');
      const res2 = await fetch('http://localhost:3000/api/auth/get-session', {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${tokenHeader}`,
            'Origin': 'http://localhost:5173'
        }
      });
      console.log('Session response:', res2.status, await res2.text());
  }
}
testAuth();
