import firebase from '@react-native-firebase/app'

const firebaseConfig = {
    apiKey: 'AIzaSyAJFAqlREAyaqV9-8Q0JA-UIbMyU7gnC2s',
    authDomain: 'test-auth-c5dea.firebaseapp.com',
    databaseURL: 'https://test-auth-c5dea-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'test-auth-c5dea',
    storageBucket: 'test-auth-c5dea.appspot.com',
    messagingSenderId: '934823771313',
    appId: '1:934823771313:android:86d9aa0f4f89232c7cb690',
}

// if (firebase.apps.length === 0) {
//     firebase.initializeApp(firebaseConfig);
// }

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// const analytics = getAnalytics(app);

const Firebase = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app;

export default Firebase;