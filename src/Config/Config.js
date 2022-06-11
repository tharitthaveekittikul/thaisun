import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2VtCcQ41O6VyEUzAIXK7-u6LpekzrjZ8",
  authDomain: "thaisun-52d7c.firebaseapp.com",
  projectId: "thaisun-52d7c",
  storageBucket: "thaisun-52d7c.appspot.com",
  messagingSenderId: "664799246787",
  appId: "1:664799246787:web:69cb580a8e764880776576",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export { auth, fs, storage };
