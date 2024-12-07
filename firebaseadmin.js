const admin = require("firebase-admin");
const serviceAccount = require("./google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "kaliatra.firebasestorage.app",
});

const firestore = admin.firestore();

module.exports = { admin, firestore };
