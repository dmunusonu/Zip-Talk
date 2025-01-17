const UserModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

const UserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "Session expired",
      logout: true,
    };
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // Fetch user details from DB
    const user = await UserModel.findById(decodedToken.id).select("-password");

    if (!user) {
      return {
        message: "User not found",
        logout: true,
      };
    }

    return user;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        message: "Token expired",
        logout: true,
      };
    } else if (error.name === "JsonWebTokenError") {
      return {
        message: "Invalid token",
        logout: true,
      };
    } else {
      console.error("Unexpected error in token verification:", error);
      throw error; // Re-throw unexpected errors
    }
  }
};

module.exports = UserDetailsFromToken;
