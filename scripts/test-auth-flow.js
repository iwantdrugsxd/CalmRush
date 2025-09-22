const fetch = require('node-fetch');

async function testAuthFlow() {
  try {
    console.log('=== Testing Authentication Flow ===');
    
    // Step 1: Login
    console.log('\n1. Testing login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      }),
    });

    console.log('Login response status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response data:', loginData);

    if (!loginData.success) {
      console.error('Login failed!');
      return;
    }

    // Step 2: Check if cookie was set
    console.log('\n2. Checking cookies...');
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookieHeader);

    // Step 3: Test /me endpoint with cookie
    console.log('\n3. Testing /me endpoint...');
    const meResponse = await fetch('http://localhost:3000/api/auth/me', {
      headers: {
        'Cookie': setCookieHeader || ''
      }
    });

    console.log('Me response status:', meResponse.status);
    const meData = await meResponse.json();
    console.log('Me response data:', meData);

    // Step 4: Test /me endpoint without cookie
    console.log('\n4. Testing /me endpoint without cookie...');
    const meResponseNoCookie = await fetch('http://localhost:3000/api/auth/me');
    console.log('Me response (no cookie) status:', meResponseNoCookie.status);
    const meDataNoCookie = await meResponseNoCookie.json();
    console.log('Me response (no cookie) data:', meDataNoCookie);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAuthFlow();



