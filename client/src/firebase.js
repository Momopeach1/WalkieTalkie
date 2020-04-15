import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyBito_osncyDymuTorU2Zk9fnH-nRv97vU",
    authDomain: "walkie-talkie-8d138.firebaseapp.com",
    databaseURL: "https://walkie-talkie-8d138.firebaseio.com",
    projectId: "walkie-talkie-8d138",
    storageBucket: "walkie-talkie-8d138.appspot.com",
    messagingSenderId: "12432979105",
    appId: "1:12432979105:web:91a81e4aad5e6b5289ece0",
    measurementId: "G-Q6813J2YXZ"
  };
  
const provider = new firebase.auth.GoogleAuthProvider();
firebase.initializeApp(firebaseConfig);

export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};
export const auth = firebase.auth();
export const firestore = firebase.firestore();