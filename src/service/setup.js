import firebase from '@react-native-firebase/app';
import Auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';

// const firebaseConfig = {
//     apiKey: "AIzaSyB30b3clI-tbrbsXPgNKSWafc5YO0YP-ZM",
//     authDomain: "hisab-44406.firebaseapp.com",
//     databaseURL: "https://hisab-44406-default-rtdb.firebaseio.com/",
//     projectId: "hisab-44406",
//     storageBucket: "hisab-44406.appspot.com",
//     messagingSenderId: "795993730686",
//     appId: "1:795993730686:web:6a6c2b7a5da8b6fa6f322f",
// };

// if (!firebase.apps.length) {
//     // Auth().
//     firebase.initializeApp(firebaseConfig);
// }
export {
    firebase,
    Auth,
    firestore
}