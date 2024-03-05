/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as Projectnew } from './app.json';
import './src/FirebaseConfig'
import firebase from '@react-native-firebase/app'

// firebase.initializeApp();
AppRegistry.registerComponent(Projectnew, () => App);