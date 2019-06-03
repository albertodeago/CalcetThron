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