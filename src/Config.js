import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCh1ezAGozOiL4SQlo6BODXGvdqkFxLxIY",
  authDomain: "instagram-a306d.firebaseapp.com",
  projectId: "instagram-a306d",
  storageBucket: "instagram-a306d.appspot.com",
  messagingSenderId: "1051683228023",
  appId: "1:1051683228023:web:96968c5191c7b9869e7972",
  measurementId: "G-0FHPYTESC2",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
