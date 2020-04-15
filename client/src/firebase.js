import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import keys from "./config/keys";
import history from './history';

console.log(keys);
var firebaseConfig = {
    apiKey: keys.apiKey,
    authDomain: keys.authDomain,
    databaseURL: keys.databaseURL,
    projectId: keys.projectId,
    storageBucket: keys.storageBucket,
    messagingSenderId: keys.messagingSenderId,
    appId: keys.appId,
    measurementId: keys.measurementId
  };
  
const provider = new firebase.auth.GoogleAuthProvider();
firebase.initializeApp(firebaseConfig);

export const signInWithGoogle = () => {
  auth.signInWithPopup(provider).then(()=>{
    history.push('/ProfilePage');
  });
};
export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
};
const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();

    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};
export const auth = firebase.auth();
export const firestore = firebase.firestore();