import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    // If token doesn't exist
    if (!token) {
      return res.status(401).json({
        message: "User doesn't have token",
      });
    }

    // Verify JWT token
    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Check whether token is valid
    if (!verifyToken) {
      return res.status(401).json({
        message: "User doesn't have valid token",
      });
    }

    // Get userId from decoded token
    req.userId = verifyToken.userId;

    // Move to next middleware/controller
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export default isAuth;