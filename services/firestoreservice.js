const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();

const savePrediction = async (prediction) => {
  try {
    const userPredictionsRef = firestore
      .collection("users")
      .doc(prediction.userId)
      .collection("predictions");

    await userPredictionsRef.doc(prediction.id).set({
      topPredictions: prediction.topPredictions,
      createdAt: prediction.createdAt,
    });

    console.log("Prediction saved successfully!");
  } catch (err) {
    console.error("Error saving prediction to Firestore:", err);
    throw new Error("Failed to save prediction");
  }
};

const getAllPredictions = async (userId) => {
  try {
    const predictionsRef = firestore
      .collection("users")
      .doc(userId)
      .collection("predictions");

    const snapshot = await predictionsRef.orderBy("createdAt", "desc").get();
    const predictions = [];
    snapshot.forEach((doc) => {
      predictions.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return predictions;
  } catch (err) {
    console.error("Error retrieving predictions from Firestore:", err);
    throw new Error("Failed to retrieve predictions");
  }
};

module.exports = { savePrediction, getAllPredictions };
