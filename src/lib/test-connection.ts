// Test backend connectivity from Android
export const testBackendConnection = async () => {
  const urls = [
    'http://10.0.2.2:8000',
    'http://localhost:8000',
    'http://127.0.0.1:8000'
  ];

  for (const url of urls) {
    try {
      console.log(`Testing connection to: ${url}`);
      const response = await fetch(`${url}/`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log(`✓ Success with ${url}:`, data);
      return url;
    } catch (error) {
      console.log(`✗ Failed with ${url}:`, error);
    }
  }
  
  throw new Error('Cannot connect to backend on any URL');
};