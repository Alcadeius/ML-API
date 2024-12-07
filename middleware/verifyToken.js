const { admin } = require("../firebaseadmin");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { id: decodedToken.uid };
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({
      status: "fail",
      message: "Unauthorized: Invalid token",
    });
  }
};

module.exports = verifyToken;
