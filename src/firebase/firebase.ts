import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore';

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = { 
  apiKey: "AIzaSyD***********************************",
  authDomain: "fir-studio-clone.firebaseapp.com",
  projectId: "fir-studio-clone",
  storageBucket: "fir-studio-clone.appspot.com",
  messagingSenderId: "4768********************",
  appId: "1:4768***************:web:7c73f*********************" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to handle retries with exponential backoff
const subscribeWithRetry = (
  collectionRef: any,
  onSuccess: any,
  onError: any,
  maxRetries = 10,
  delay = 2000
) => {
  let retries = 0;

  const subscribe = () => {
    try {
      const unsubscribe = onSnapshot(
        collectionRef,
        (snapshot) => {
          onSuccess(snapshot);
          retries = 0; // Reset retries on success
        },
        (error) => {
          console.error('Error in onSnapshot:', error);
          if (retries < maxRetries) {
            retries++;
            const timeout = delay * Math.pow(2, retries);
            console.log(`Retrying in ${timeout}ms... (attempt ${retries}/${maxRetries})`);
            setTimeout(() => subscribe(), timeout);
          } else {
            console.error('Max retries reached. Giving up.');
            onError(error);
          }
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to snapshot:', error);
      if (retries < maxRetries) {
        retries++;
        const timeout = delay * Math.pow(2, retries);
        console.log(`Retrying in ${timeout}ms... (attempt ${retries}/${maxRetries})`);
        setTimeout(() => subscribe(), timeout);
      } else {
        console.error('Max retries reached. Giving up.');
        onError(error);
      }
      return () => {}; // Return a no-op unsubscribe function
    }
  };

  return subscribe();
};

export { db, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, subscribeWithRetry };

    