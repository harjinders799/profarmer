/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import firestore from '@react-native-firebase/firestore';

firestore().settings({
    persistence: true, // Enable offline persistence
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
});
AppRegistry.registerComponent(appName, () => App);
