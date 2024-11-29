import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config(); // Load environment variables

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // use updated environment variable here
});

const bucket = admin.storage().bucket();

const messaging = admin.messaging();

const sendMessage = async (tokens, title, body) => {

  const message = {
    notification: {
      title,
      body,
    },
    tokens
  };

  try {
    // Send the notification to the list of tokens
    const response = await messaging.sendEachForMulticast(message);
    console.log('Notification sent successfully:', response);
    return response;
  } catch (error) {
    // Log and rethrow the error
    console.error('Error sending notification:', error);
    throw new Error(`Failed to send notification: ${error.message}`);
  }
};

export default { admin, bucket, messaging, sendMessage };