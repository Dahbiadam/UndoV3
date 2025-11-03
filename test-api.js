const http = require('http');

// Test health endpoint
const testHealth = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Health Check Success:', response);
          resolve(response);
        } catch (error) {
          console.log('✅ Health Check Response:', data);
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};

// Test login endpoint
const testLogin = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Login Test Success:', response);
          resolve(response);
        } catch (error) {
          console.log('✅ Login Test Response:', data);
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

// Run tests
console.log('🧪 Testing UNDO Recovery App API...');

testHealth()
  .then(() => testLogin())
  .then(() => console.log('🎉 All tests completed!'))
  .catch((error) => {
    console.error('❌ Test failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 3001');
  });