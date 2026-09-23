/* ==========================================================================
   Nevra Plastik - Firebase Configuration & Initialization
   ========================================================================== */

// Paste your Firebase web app configuration parameters here
const firebaseConfig = {
  apiKey: "AIzaSyCE-Ebs5kBWRqXa5A71GZ1eEQlt3Cw6UVU",
  authDomain: "nevra-plastik.firebaseapp.com",
  projectId: "nevra-plastik",
  storageBucket: "nevra-plastik.firebasestorage.app",
  messagingSenderId: "437081136241",
  appId: "1:437081136241:web:f8ce8332ed061451d44fd0",
  measurementId: "G-LZ3P20TR04"
};

let db = null;
let auth = null;
let storage = null;
let isFirebaseActive = false;

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();
    
    isFirebaseActive = true;
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase configuration not set. Website is running in local static fallback mode.");
}
