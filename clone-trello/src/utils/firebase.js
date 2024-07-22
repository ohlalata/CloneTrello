import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

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

const messaging = getMessaging(app);

export const requestPermission = () => {

  console.log("Requesting User Permission......");
  Notification.requestPermission().then((permission) => {

    if (permission === "granted") {

      console.log("Notification User Permission Granted."); 
      return getToken(messaging, { vapidKey: `BCNfBWfXajn7741UwVd76e8Y6T1kuM-LcPL5jH4ONY6dt6A9fFEc4Qklqz7iDEy4TBr-y8OW9e_sGthGPiLsMPA` })
        .then((currentToken) => {

          if (currentToken) {

            console.log('Client Token: ', currentToken);
          } else {
            
            console.log('Failed to generate the app registration token.');
          }
        })
        .catch((err) => {

          console.log('An error occurred when requesting to receive the token.', err);
        });
    } else {

      console.log("User Permission Denied.");
    }
  });

}

requestPermission();

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});