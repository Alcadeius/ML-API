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
} = require("../services/firestoreservice");
const { errorHandler, errHandler } = require("../utils/errorHandler");
// const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
}).single("image");

router.post("/predict", (req, res, next) => {
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
      const prediction = {
        id,
        // userId: req.user.id,
        topPredictions: predictionResults,
        createdAt,
      };

      // await savePrediction(prediction);

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
router.post("/predict/handwrite", (req, res, next) => {
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
      // const createdAt = new Date().toISOString();
      const prediction = {
        id,
        // userId: req.user.id,
        topPredictions: predictionResults,
        // createdAt,
      };

      // await savePrediction(prediction);

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
router.get("/predict/histories", async (req, res, next) => {
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

module.exports = router;
