const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const makeToken = (_id, role) => {
  return jsonwebtoken.sign(
    { _id, role },
    process.env.JWT_API_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
};

  

const GenerateToken = async (user, req, res) => {
  try {
    await res.clearCookie("jwt");
    const token = await makeToken(user._id, user.role);
    res.cookie("jwt", token, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    //   secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const CreateToken = async (payload) => {
  const otptoken = jsonwebtoken.sign(payload, process.env.JWT_API_SECRET_KEY, {
    expiresIn: "5m",
  });
  return otptoken;
};

const generatetokenForOtp = async (
  SendedOtp,
  expirationTime,
  _id,
  email,
  otpVerified = false,
  emailVerified = false,
  res
) => {
  const payload = {
    SendedOtp,
    expirationTime,
    _id,
    email,
    otpVerified,
    emailVerified,
  };
  const tok = await CreateToken(payload);

  if (res) {
    console.log("send to cookie");
    res.cookie("resetPasswordOTP", tok, {
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }

  return tok;
};

const decodingToken = async (token, key) => {
  return jsonwebtoken.verify(token, key);
};
module.exports = {
  GenerateToken,
  makeToken,
  CreateToken,
  generatetokenForOtp,
  decodingToken,
};
