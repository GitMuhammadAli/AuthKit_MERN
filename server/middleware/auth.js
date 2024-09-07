const Users = require("../model/userModel");
const jsonwebtoken = require("jsonwebtoken");

exports.AuthorizeUser = (RequiredRole) => {
  return async (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    try {
      const decodedToken = jsonwebtoken.verify(
        token,
        process.env.JWT_API_SECRET_KEY
      );
      console.log("Decoded Token:", decodedToken);
      const user = await Users.findById(decodedToken._id);
      console.log("User from DB:", user);
      if (!user) {
        console.log("User not found");
        clearCookies();

        return res.status(401).json({ message: "User not found" });
      }

      if (
        user.role === RequiredRole ||
        (RequiredRole === "user" && user.role === "admin")
      ) {
        req.user = user;
        return next();
      } else {
        console.log("Role is not correct");
        clearCookies();
        return res.status(403).json({ message: "Forbidden" });
      }
    } catch (error) {
      console.error("JWT verification failed:", error);
      clearCookies();
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

function clearCookies(req, res) {
  res.clearCookie("jwt");
}
exports.FindUser = async (req, res, next) => {
  try {
    const cookieOtp = req.cookies.resetPasswordOTP;

    if (!cookieOtp) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = jsonwebtoken.verify(
      cookieOtp,
      process.env.JWT_API_SECRET_KEY
    );

    const { otpVerified, emailVerified } = decodedToken;

    if (emailVerified === false) {
      if (otpVerified === false) {
        console.log("Email verified but OTP not verified yet");
        return res.status(401).json({ message: "OTP not verified" });
      }
      console.log("Email Not verified in Cookie ");
      return res.status(401).json({ message: "Email not verified" });
    }

    next();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(401).json({ message: "Internal server error" });
  }
};
