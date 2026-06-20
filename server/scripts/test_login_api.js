async function test() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'student@demo.com',
        password: 'password123'
      })
    });
    
    console.log('Response Status:', response.status);
    const data = await response.json();
    if (response.ok) {
      console.log('✅ LOGIN API WORKS PERFECTLY!');
      console.log('Token received:', data.token ? 'YES' : 'NO');
      console.log('User role:', data.user.role);
    } else {
      console.error('❌ LOGIN API FAILED:', data.message || data);
    }
  } catch (err) {
    console.error('❌ REQUEST ERROR:', err.message);
  }
}

test();
