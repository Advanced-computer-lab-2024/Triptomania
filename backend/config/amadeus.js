import Amadeus from 'amadeus';
import dotenv from 'dotenv';
import axios from 'axios'; // Add axios for making POST requests with form data

dotenv.config();

// Initialize the Amadeus client with your credentials
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET
});

async function getAccessToken() {
    try {
      const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.AMADEUS_API_KEY,
          client_secret: process.env.AMADEUS_API_SECRET
        }), 
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
  
      const accessToken = response.data.access_token;

      return { accessToken, expiresIn: response.data.expires_in };
    } catch (error) {
      throw new Error('Unable to fetch access token');
    }
  }  

// Export the Amadeus client and access token fetching function
export { amadeus, getAccessToken };
