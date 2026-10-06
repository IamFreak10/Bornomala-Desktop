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
  
  console.log('Signup status:', res1.status);
  console.log('Response body:', await res1.text());
}
testAuth();
