// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <
// script src = "https://www.gstatic.com/firebasejs/6.1.0/firebase-app.js" > < /script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
// https: //firebase.google.com/docs/web/setup#config-web-app -->

//     <
//     script >
//     // Your web app's Firebase configuration
//     var firebaseConfig = {
//         apiKey: "AIzaSyCH4nllbOqzo0x2NK5Quwi9Lm1gob2Ay6U",
//         authDomain: "darthron-6a632.firebaseapp.com",
//         databaseURL: "https://darthron-6a632.firebaseio.com",
//         projectId: "darthron-6a632",
//         storageBucket: "darthron-6a632.appspot.com",
//         messagingSenderId: "896085385438",
//         appId: "1:896085385438:web:37107586c9dea125"
//     };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig); <
// /script>

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "", // your apikey
    authDomain: "", // your authDomain
    projectId: "" // your projectId
});

var db = firebase.firestore();

const data = require("./import-data/tmp-ranking");
const values = Object.values(data);

values.forEach(function(obj) {
    db.collection("rankings").doc(obj.id).set(obj)
        .then(function(docRef) {
            console.log("Document written");
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
});