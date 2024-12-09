const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const {
  loadModel,
  predictImage,
  handwritemodel,
} = require("../model/loadModel");
const {
  savePrediction,
  getAllPredictions,
  deletePrediction,
} = require("../services/firestoreservice");
const { errorHandler, errHandler } = require("../utils/errorHandler");
const verifyToken = require("../middleware/verifyToken");
const { bucket } = require("../firebaseadmin");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
}).single("image");

router.post("/predict", verifyToken, (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1 MB",
      });
    }
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "fail",
          message: "No file uploaded. Please upload an image.",
        });
      }

      const model = await loadModel();
      if (!model) {
        return res.status(500).json({
          status: "fail",
          message: "Failed to load the model.",
        });
      }

      const predictionResults = await predictImage(model, req.file.buffer);
      if (!predictionResults || predictionResults.length === 0) {
        return res.status(500).json({
          status: "fail",
          message: "Prediction failed. No results available.",
        });
      }

      const id = uuidv4();
      const createdAt = new Date().toISOString();
      const file = bucket.file(`result/${id}.jpg`);
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
      });
      const [imageURL] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2025",
      });
      const prediction = {
        id,
        userId: req.user.id,
        topPredictions: predictionResults,
        imageURL,
        createdAt,
      };

      await savePrediction(prediction);

      res.status(200).json({
        status: "success",
        message: "Prediction successful",
        data: prediction,
      });
    } catch (err) {
      console.error("Error during prediction:", err);
      next(errorHandler(err));
    }
  });
});
router.post("/predict/handwrite", verifyToken, (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1 MB",
      });
    }
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "fail",
          message: "No file uploaded. Please upload an image.",
        });
      }

      const model = await handwritemodel();
      if (!model) {
        return res.status(500).json({
          status: "fail",
          message: "Failed to load the model.",
        });
      }

      const predictionResults = await predictImage(model, req.file.buffer);
      if (!predictionResults || predictionResults.length === 0) {
        return res.status(500).json({
          status: "fail",
          message: "Prediction failed. No results available.",
        });
      }

      const id = uuidv4();
      const createdAt = new Date().toISOString();
      const file = bucket.file(`result/${id}.jpg`);
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
      });
      const [imageURL] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2025",
      });
      const prediction = {
        id,
        userId: req.user.id,
        topPredictions: predictionResults,
        imageURL,
        createdAt,
      };

      await savePrediction(prediction);

      res.status(200).json({
        status: "success",
        message: "Prediction successful",
        data: prediction,
      });
    } catch (err) {
      console.error("Error during prediction:", err);
      next(errorHandler(err));
    }
  });
});
router.get("/predict/latest", verifyToken, async (req, res, next) => {
  try {
    const predictions = await getAllPredictions(req.user.id);
    if (predictions.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No predictions found for this user",
      });
    }

    const latestPrediction = predictions[0];
    res.status(200).json({
      status: "success",
      message: "Latest prediction retrieved successfully",
      data: latestPrediction,
    });
  } catch (err) {
    next(errHandler(err));
  }
});
router.get("/predict/histories", verifyToken, async (req, res, next) => {
  try {
    const predictions = await getAllPredictions(req.user.id);
    res.status(200).json({
      status: "success",
      message: "Histories retrieved successfully",
      data: predictions,
    });
  } catch (err) {
    next(errHandler(err));
  }
});
router.delete("/predict/histories/:id", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Prediction ID is required",
      });
    }

    await deletePrediction(userId, id);

    res.status(200).json({
      status: "success",
      message: `Prediction with ID ${id} deleted successfully`,
    });
  } catch (err) {
    next(errHandler(err));
  }
});

module.exports = router;
