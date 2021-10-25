Needs firebase SDK:

	npm install firebase
	npm install -g firebase-tools


and file /srv/plugins/firebase.js to connect to firebase services<br/>
something like:<br/>

	import firebase from 'firebase/app'
	import 'firebase/firestore'
	import 'firebase/auth'
	import 'firebase/functions'
    
    let config = {
        apiKey: 'YOUR_API_KEY_HERE',
        authDomain: 'YOUR_AUTH_DOMAIN_HERE',
        databaseURL: 'YOUR_DB_URL_HERE',
        projectId: 'YOUR_PROJECT_ID_HERE',
        storageBucket: 'YOUR_STORAGE_BUCKET_HERE',
        messagingSenderId: 'YOUR_MESSAGING_SENDER_ID_HERE', // doesn't really required in currrent build I guess
        appId: 'YOUR_APP_ID_HERE',
    }

    // Setting up emulator for development
    if (location.hostname === 'localhost') {
        config = {
            databaseURL: 'http://localhost:8081?ns=YOUR_NS_HERE',
            ssl: false,
            apiKey: 'YOUR_API_KEY_HERE',
            authDomain: 'YOUR_AUTH_DOMAIN_HERE',
            projectId: 'YOUR_PROJECT_ID_HERE',
            storageBucket: 'YOUR_STORAGE_BUCKET_HERE',
            messagingSenderId: 'YOUR_MESSAGING_SENDER_ID_HERE',
            appId: 'YOUR_APP_ID_HERE',
        }
    }

    export const app = firebase.apps.length
        ? firebase.app()
        : firebase.initializeApp(config)

    export const db = app.firestore()

    export const auth = firebase.auth()

    // connecting emulators
    if (location.hostname === 'localhost') {
        db.useEmulator('localhost', 8081)
        firebase.functions().useEmulator('localhost', 5001)
    }
    export const { Timestamp, GeoPoint } = firebase.firestore
    export default firebase



More info:
https://firebase.google.com/docs/web/setup

To run in dev environment:

	firebase emulators:start --import WAY_TO_YOUR_EMULATOR_DATA
	npm run dev

To deploy build files and firebase functions (have to be connected to firebase already):

	npm run build
	firebase deploy 

To update build files only:

	firebase deploy --only hosting
