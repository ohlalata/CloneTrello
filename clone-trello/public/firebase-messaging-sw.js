importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

 //the Firebase config object 
const firebaseConfig = {
    apiKey: "AIzaSyBj_A5oDviP6GTv8ySzOEzs2Wu0zE8PWt8",
    authDomain: "clonetrello-103ad.firebaseapp.com",
    projectId: "clonetrello-103ad",
    storageBucket: "clonetrello-103ad.appspot.com",
    messagingSenderId: "947502707674",
    appId: "1:947502707674:web:fcf51e27913c03acbd46e3",
    measurementId: "G-SLMHHX8X2L"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});