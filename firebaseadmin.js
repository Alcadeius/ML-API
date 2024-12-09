const admin = require("firebase-admin");
const serviceAccount = require("./google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "kaliatra",
});

const firestore = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, firestore, bucket };
