import firebase from "firebase";

// These are the config values used by the Firebase SDK to access the Firebase Cloud.
// They are not defined here for security reasons, but can be changed by using an .env
// file in the root of the project, i.e. in the same folder with the Dockerfile and package.json
// The values in the .env file need to spelt identically to the keys here (REACT_APP_API_KEY_USER etc)
const userConfig = {
    apiKey: process.env.REACT_APP_API_KEY_USER,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN_USER,
    databaseURL: process.env.REACT_APP_DATABASE_URL_USER,
    projectId: process.env.REACT_APP_PROJECT_ID_USER,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET_USER,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID_USER,
    appId: process.env.REACT_APP_APP_ID_USER,
};

// The Manager class holds some of the most important logic for the functioning of the application.
// I've tried to centralise as much of the authentication here in case it needs to be changed.
// The majority of the functions just wrap the Firebase API, but not all have been implemented,
// most notably, the functions for resetting passwords and accounts, which I considered to be too much
// of a security risk while the application is still in development.
// I strongly advise that you read up on the Firebase Web API before making any major changes here.
// The documentation can be found at https://firebase.google.com/docs/reference/js/firebase.auth
class Manager {
    constructor(props) {
        this.props = props;

        //// Init Firebase ////
        firebase.initializeApp(userConfig);
        this.auth = firebase.auth();            // Set up the authentication
        this.db = firebase.database();          // Set up the realtime-database

        // Set Authentication Persistence to just the browser session, this means that when the browser
        // is closed, the authentication for that device will be reset. While in development this makes
        // it easier to test different accounts, but in production it could easily be set to LOCAL.
        // Read the docs at https://firebase.google.com/docs/reference/js/firebase.auth.Auth#persistence_1
        this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
    }

    // Create User
    createUser = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

    // Sign In
    signIn = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    // Sign Out
    signOut = () => this.auth.signOut();

    // Password Email Reset
    // NOTE, this is currently not implemented anywhere in the application
    passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

    // NOTE, this is a complex and crucial part of the system, I strongly advise against editing it.
    // This listener is used by the withAuth and withManager wrappers to provide particularly behaviour when
    // the currently signed in user changes. This is almost always when the user signs in for the first time.
    // When the user-state changes, the `onAuthUserListener` will call the `next` function that was passed to it
    // when it was first attached. It works by waiting for Firebase to trigger the `onAuthStateChanged`, and then
    // checks to see if there is now a logged in user. It then takes the Unique Identifier of that user and uses
    // it to search through the realtime-database for the User's data, such as roles or name. It then puts the
    // authenticated User's data from the auth system and the database into `authUser` and then sends that
    // variable to the `next` function (the callback).
    // All this allows me to push users to new pages when the user-state changes (that's the job of withAuth).
    // And also other components to access an update to date version of the user's data (done by withManager).
    onAuthUserListener = (next, fallback) =>
        // This is called when the authentication state changes, i.e. a user logs in
        this.auth.onAuthStateChanged(authUser => {
            // If there is logged in user, we want to start the process of calling the `next` function.
            // This will prevent updates when a user logs out, as there wont be any data.
            if (authUser) {
                // We now need to find and extract the user's data from the realtime-database.
                this.db.ref(`users/${authUser.uid}`)    // This points to the user in the database
                    .once('value')                  // We only want to fetch this data once
                    .then(snapshot => {
                        // Pull the data out of the database
                        const dbUser = snapshot.val();

                        // If the user doesn't have any roles, we default to an empty list
                        if (!dbUser.roles) {
                            dbUser.roles = [];
                        }

                        // Merge the data from the database with the data from the authentication system
                        authUser = {
                            uid: authUser.uid,      // Data from the Authentication system
                            email: authUser.email,  // Data from the Authentication system
                            ...dbUser,              // Anything else from the database
                        };

                        // Finally, we want to call the callback with the data
                        next(authUser);
                    });
            } else {
                // If the user was logging out, we still want to notify the listeners, but they may want
                // to take a different course of action, so we call them with the `fallback` func instead.
                fallback();
            }
        });

    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    currentUser = () => { return {
        email: this.auth.currentUser.email,
        uid: this.auth.currentUser.uid,
        roles: {
            admin: this.auth.currentUser.uid
        }
    }};

    refs = {
        reports: () => {
            let ref = this.db.ref("reports");
            ref.orderByChild("user/uid").equalTo(this.auth.currentUser.uid);
            return ref;
        }
    }


    // TODO Update
    //// Requests ////
    request = {
        postForm: async function(_title, _description, _urg, _cat) {

            let d = new Date();
            let currentDatetime = {
                year: d.getFullYear(),
                month: d.getMonth(),
                day: d.getDay(),
                hour: d.getHours(),
                minute: d.getMinutes(),
            };

            let key = this.db.ref().child('reports').push().key;

            let data = {
                title: _title,
                urg: _urg,
                cat: _cat,
                id: key,
                status: 0,
                user: this.currentUser(),
                comments: {
                    0: {
                        user: this.currentUser(),
                        comment: _description,
                        datetime: currentDatetime,
                    }
                },
                datetime: currentDatetime,
            };
            
            await this.db.ref('reports/' + key).set(data);

            return key;
        }.bind(this),

        getForms: async function() {
            let uid = this.auth.currentUser.uid;

            let data;
            let ref = this.db.ref("reports");
            await ref
                .orderByChild("user/uid")
                .equalTo(uid)
                .once("value")
                .then(function (snapshot) {
                    data = snapshot.val()
                });
            return data;
        }.bind(this),

        getForm: async function(id) {

            let data;
            let ref = this.db.ref("reports/" + id);
            await ref.once("value").then(function (snapshot) {
                data = snapshot.val()
            });
            return data;
        }.bind(this),

        updateForm: async function(id, data) {
            await this.db.ref("reports/" + id).set(data);
        }.bind(this),

        addComment: async function(id, comment) {
            let data = await this.request.getForm(id);

            let d = new Date();
            let currentDatetime = {
                year: d.getFullYear(),
                month: d.getMonth(),
                day: d.getDay(),
                hour: d.getHours(),
                minute: d.getMinutes(),
            };

            let newComments = data.comments;
            newComments.push({
                comment: comment,
                datetime: currentDatetime,
                user: this.currentUser(),
            });

            await this.db.ref("reports/" + id + "/comments").set(newComments);
        }.bind(this),
        
        deleteForm: function(id) {
            let ref = this.db.ref("reports/" + id)
            ref.remove()
        }.bind(this),
    }
}

export default Manager;
