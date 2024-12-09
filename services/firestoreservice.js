const { firestore } = require("../firebaseadmin");

const savePrediction = async (prediction) => {
  try {
    if (
      !prediction.userId ||
      !prediction.topPredictions ||
      !prediction.id ||
      !prediction.imageURL
    ) {
      throw new Error("Invalid prediction data");
    }

    const userPredictionsRef = firestore
      .collection("users")
      .doc(prediction.userId)
      .collection("predictions");

    await userPredictionsRef.doc(prediction.id).set({
      topPredictions: prediction.topPredictions,
      imageURL: prediction.imageURL,
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
const deletePrediction = async (userId, predictionId) => {
  try {
    if (!userId || !predictionId) {
      throw new Error("User ID and Prediction ID are required");
    }

    const predictionRef = firestore
      .collection("users")
      .doc(userId)
      .collection("predictions")
      .doc(predictionId);

    await predictionRef.delete();
    console.log(`Prediction with ID ${predictionId} deleted successfully!`);
  } catch (err) {
    console.error("Error deleting prediction from Firestore:", err);
    throw new Error("Failed to delete prediction");
  }
};

module.exports = { savePrediction, getAllPredictions, deletePrediction };
