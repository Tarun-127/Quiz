require("dotenv").config();
const jwt = require("jsonwebtoken");

const logError = (message, error) => {
  console.error(message, error);
};

const respondWithError = (res, statusCode, message, isTokenInvalid) => {
  return res.status(statusCode).json({ message, isTokenInvalid });
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      logError("Authorization token is missing");
      return respondWithError(res, 401, "Unauthorized access", true);
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.currentUserId = decode.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logError("Token has expired", error);
      return respondWithError(
        res,
        401,
        "Unauthorized access: Token has expired",
        true
      );
    } else if (error.name === "JsonWebTokenError") {
      logError("Token is invalid", error);
      return respondWithError(
        res,
        401,
        "Unauthorized access: Invalid token",
        true
      );
    } else {
      logError("Error verifying token", error);
      return respondWithError(res, 500, "Internal server error", true);
    }
  }
};

module.exports = verifyToken;
