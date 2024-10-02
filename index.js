/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

firestore().settings({
    persistence: true, // Enable offline persistence
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
}).then(res => console.log(res, 'firestore setting')).catch(err => console.log({ err }, 'firestore setting'));

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
