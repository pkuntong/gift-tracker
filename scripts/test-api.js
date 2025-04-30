import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const API_URL = process.env.VITE_API_URL || 'http://localhost:8000';

async function testApiConnection() {
  console.log('Testing API connection...');
  console.log(`API URL: ${API_URL}`);

  try {
    // Test the API by making a simple request to the signup endpoint
    const response = await axios.post(`${API_URL}/auth/signup`, {
      email: 'test@example.com'
    });
    console.log('✅ API connection successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ API connection failed!');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. This could mean:');
      console.error('1. The API server is not running');
      console.error('2. The API URL is incorrect');
      console.error('3. There might be a CORS issue');
      console.error('\nTroubleshooting steps:');
      console.error('1. Check if your API server is running');
      console.error('2. Verify the API URL in your .env file');
      console.error('3. Try accessing the API URL directly in your browser');
      console.error('4. Check your API server logs for any errors');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  }
}

testApiConnection(); 