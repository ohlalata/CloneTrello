import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import userFcmTokenService from "../api/Services/userFcmToken";

const firebaseConfig = {
  apiKey: "AIzaSyBj_A5oDviP6GTv8ySzOEzs2Wu0zE8PWt8",
  authDomain: "clonetrello-103ad.firebaseapp.com",
  projectId: "clonetrello-103ad",
  storageBucket: "clonetrello-103ad.appspot.com",
  messagingSenderId: "947502707674",
  appId: "1:947502707674:web:fcf51e27913c03acbd46e3",
  measurementId: "G-SLMHHX8X2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const messaging = getMessaging(app);

// Define the function to get the FCM token
export const getFcmToken = () => {
  return getToken(messaging, { vapidKey: 'BCNfBWfXajn7741UwVd76e8Y6T1kuM-LcPL5jH4ONY6dt6A9fFEc4Qklqz7iDEy4TBr-y8OW9e_sGthGPiLsMPA' });
};

const saveFcmToken = () => {
  getFcmToken()
    .then((currentToken) => {
      if (currentToken) {
        console.log('FCM Token: ', currentToken);

        // Get the userId from local storage
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        const userId = userProfile?.data?.id;

        // Call createUserFcmToken with userId and fcmToken
        if (userId) {
          userFcmTokenService.createUserFcmToken({ userId, fcmToken: currentToken })
            .then(response => {
              console.log('FCM Token saved successfully:', response);
            })
            .catch(err => {
              console.log('Failed to save FCM Token:', err);
            });
        } else {
          console.log('User ID not found in local storage.');
        }

      } else {
        console.log('Failed to generate the app registration token.');
      }
    })
    .catch((err) => {
      console.log('An error occurred when getting the FCM token.', err);
    });
};

// Define the function to request permission and call saveFcmToken
export const requestPermission = () => {
  console.log("Requesting User Permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification User Permission Granted.");
      saveFcmToken(); // Call saveFcmToken which will handle getting and saving the FCM token
    } else {
      console.log("User Permission Denied.");
    }
  });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });