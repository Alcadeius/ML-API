// require("dotenv").config();
// const express = require("express");
// const { OAuth2Client } = require("google-auth-library");
// const { Storage } = require("@google-cloud/storage");
// const { Firestore } = require("@google-cloud/firestore");
// const jwt = require("jsonwebtoken");

// const router = express.Router();

// const firestore = new Firestore();
// const storage = new Storage();
// const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const createToken = (userId, email) => {
//   const payload = { id: userId, email };
//   const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
//   return token;
// };

// router.post("/auth/google", async (req, res) => {
//   const { idToken } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();

//     const sub = payload?.sub;
//     const name = payload?.name || "Unknown User";
//     const email = payload?.email || "No Email";
//     const picture = payload?.picture;

//     if (!sub || !email) {
//       throw new Error("Invalid token payload: missing required fields");
//     }

//     const userData = { username: name, email: email };
//     const userRef = firestore.collection("users").doc(sub);
//     await userRef.set(userData, { merge: true });

//     let photoURL = null;
//     if (picture) {
//       const response = await fetch(picture);
//       const arrayBuffer = await response.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
//       const file = bucket.file(`profile-photos/${sub}.jpg`);
//       await file.save(buffer, { contentType: "image/jpeg" });
//       photoURL = `https://storage.googleapis.com/${bucket.name}/profile-photos/${sub}.jpg`;
//     }

//     // const token = createToken(sub, email);

//     res.json({
//       // token,
//       username: name,
//       email: email,
//       photoURL: photoURL,
//     });
//   } catch (error) {
//     console.error("Error during Google authentication:", error);
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;
