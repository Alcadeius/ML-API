const { firestore } = require("../firebaseadmin");

const savePrediction = async (prediction) => {
  try {
    if (!prediction.userId || !prediction.topPredictions || !prediction.id) {
      throw new Error("Invalid prediction data");
    }

    const userPredictionsRef = firestore
      .collection("users")
      .doc(prediction.userId)
      .collection("predictions");

    await userPredictionsRef.doc(prediction.id).set({
      topPredictions: prediction.topPredictions,
      createdAt: prediction.createdAt || new Date().toISOString(),
    });

    console.log("Prediction saved successfully!");
  } catch (err) {
    console.error("Error saving prediction to Firestore:", err);
    throw new Error("Failed to save prediction");
  }
};

const getAllPredictions = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch predictions");
    }

    const predictionsRef = firestore
      .collection("users")
      .doc(userId)
      .collection("predictions");

    const snapshot = await predictionsRef.orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      console.log("No predictions found for user:", userId);
      return [];
    }

    const predictions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return predictions;
  } catch (err) {
    console.error("Error retrieving predictions from Firestore:", err);
    throw new Error("Failed to retrieve predictions");
  }
};

module.exports = { savePrediction, getAllPredictions };
