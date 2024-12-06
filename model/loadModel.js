const tf = require("@tensorflow/tfjs-node");
const { errorHandler } = require("../utils/errorHandler");
require("dotenv").config();

let model;

const loadModel = async () => {
  if (!model) {
    try {
      const modelUrl =
        "https://storage.googleapis.com/kaliatra/model-ml/model.json";
      console.log("Memuat model dari URL:", modelUrl);

      model = await tf.loadGraphModel(modelUrl);
      console.log("Model berhasil dimuat.");
    } catch (err) {
      console.error("Error saat memuat model:", err);
      throw new Error(
        "Gagal memuat model. Pastikan URL model benar dan dapat diakses."
      );
    }
  }
  return model;
};
const handwritemodel = async () => {
  if (!model) {
    try {
      const modelUrl =
        "https://storage.googleapis.com/kaliatra/handwriting-model/model.json";
      console.log("Memuat model dari URL:", modelUrl);

      model = await tf.loadGraphModel(modelUrl);
      console.log("Model berhasil dimuat.");
    } catch (err) {
      console.error("Error saat memuat model:", err);
      throw new Error(
        "Gagal memuat model. Pastikan URL model benar dan dapat diakses."
      );
    }
  }
  return model;
};

const predictImage = async (model, imageBuffer) => {
  try {
    const imageTensor = tf.node
      .decodeImage(imageBuffer)
      .resizeBilinear([28, 28])
      .mean(2)
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims()
      .expandDims(-1);

    const prediction = model.execute(imageTensor);
    const probabilities = Array.from(await prediction.data());

    const classLabels = [
      "a",
      "na",
      "ca",
      "ra",
      "ka",
      "da",
      "ta",
      "sa",
      "wa",
      "la",
      "ma",
      "ga",
      "ba",
      "nga",
      "pa",
      "ja",
      "ya",
      "nya",
    ];

    const labelProbabilityPairs = classLabels.map((label, index) => ({
      label,
      probability: probabilities[index],
    }));

    const sortedPredictions = labelProbabilityPairs.sort(
      (a, b) => b.probability - a.probability
    );

    const topPredictions = sortedPredictions.slice(0, 3);

    const formattedPredictions = topPredictions.map((prediction) => {
      const percentage = (prediction.probability * 100).toFixed(2);
      return `${prediction.label}:${percentage}%`;
    });

    return formattedPredictions;
  } catch (err) {
    console.error("Kesalahan saat prediksi:", err);
    throw errorHandler(err, 400, "Kesalahan prediksi");
  }
};

module.exports = { loadModel, predictImage, handwritemodel };
