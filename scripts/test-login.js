const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (data.success) {
      console.log('Login successful!');
      
      // Test the /me endpoint
      const meResponse = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          'Cookie': `userId=${data.data.id}`
        }
      });
      
      console.log('Me endpoint status:', meResponse.status);
      const meData = await meResponse.json();
      console.log('Me endpoint data:', meData);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLogin();


