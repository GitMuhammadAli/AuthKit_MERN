const Users = require("../model/userModel");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const { generatetokenForOtp, decodingToken } = require("../utils/Tokens");
const sendMail = require("../config/sendmail");

const generateOTP = () => {
  let SendedOtp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10);
  return { SendedOtp, expirationTime };
};

const CheckMailforForget = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  try {
    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ success: false, message: "Invalid email format." });
    // }

    const Findmail = await Users.findOne({ email });
    console.log("findmail", Findmail);

    if (Findmail.role === "admin") {
      return res.json({
        success: false,
        message: "Email not found.",
        status: 404,
      });
    } else if (Findmail == null) {
      return res.json({
        success: false,
        message: "Email not found.",
        status: 404,
      });
    } else {
      const { SendedOtp, expirationTime } = generateOTP();

      await generatetokenForOtp(
        SendedOtp,
        expirationTime,
        Findmail._id,
        Findmail.email,
        (Findmail.otpVerified = false),
        (Findmail.emailVerified = true),
        res
      );

      const to = email;
      const subject = "Your OTP for Resetting the Password";
      const text = `Your OTP is ${SendedOtp}. It expires in 2 minutes.`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #333;">Reset Password</h2>
          <p style="font-size: 16px; color: #333;">
            Dear User,
          </p>
          <p style="font-size: 16px; color: #333;">
            You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password. This OTP is valid for 2 minutes.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #333; background: #f0f0f0; padding: 10px 20px; border-radius: 5px; display: inline-block;">
              ${SendedOtp}
            </span>
          </div>
          <p style="font-size: 16px; color: #333;">
            If you did not request a password reset, please ignore this email.
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you,
            <br>
            The Support Team
          </p>
        </div>
      `;

      const emailResult = await sendMail(to, subject, text, html);

      if (emailResult.success) {
        return res.status(200).json({
          success: true,
          message: "OTP sent successfully. Please check your email.",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to send email. Please try again.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Token decoding for otp

// OTP confirmation
const verifyOTP = async (userOTP, storedOTP, expirationTime) => {
  userOTP = userOTP.trim();
  storedOTP = storedOTP.trim();
  console.log(
    `Comparing OTPs - User OTP: ${userOTP}, Stored OTP: ${storedOTP}`
  );
  if (userOTP !== storedOTP) {
    console.log("OTP mismatch");
    return false;
  }
  const currentTime = new Date();
  console.log(
    `Current Time: ${currentTime}, Expiration Time: ${expirationTime}`
  );
  if (currentTime > expirationTime) {
    console.log("OTP expired");
    return false;
  }
  console.log("OTP verified successfully");

  return true;
};

const ConfirmOtp = async (req, res) => {
  const { otp } = req.body;
  let cookieOtp = req.cookies.resetPasswordOTP;
  console.log(req.body);
  console.log(cookieOtp);
  if (!cookieOtp) {
    return res
      .status(404)
      .json({ success: false, message: "Otp Timeout Try again" });
  }

  try {
    const decodedToken = await decodingToken(
      cookieOtp,
      process.env.JWT_API_SECRET_KEY
    );

    console.log("Decoded Token:", decodedToken);
    const { SendedOtp, expirationTime } = decodedToken;
    console.log(`SendedOtp: ${SendedOtp}, Expiration Time: ${expirationTime}`);
    if (!SendedOtp) {
      return res
        .status(404)
        .json({ success: false, message: "Otp Timeout Try again" });
    }
    if (decodedToken.emailVerified === true) {
      console.log("Email is already verified");
      if (await verifyOTP(otp, SendedOtp, new Date(expirationTime))) {
        console.log("OTP verified successfully");

        await generatetokenForOtp(
          SendedOtp,
          expirationTime,
          decodedToken._id,
          decodedToken.email,
          (decodedToken.otpVerified = true),
          (decodedToken.emailVerified = true),
          res
        );

        return res
          .status(200)
          .json({ success: true, message: "OTP verified successfully" });
      } else {
        console.log("OTP verification failed or expired");

        res.clearCookie("resetPasswordOTP");
        return res.status(400).json({
          success: false,
          message: "OTP verification failed or expired",
        });
      }
    } else {
      console.log("Email not verified");
      return res
        .status(400)
        .json({ success: false, message: "Email not verified" });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// New password
const CreateNewPassword = async (req, res) => {
  try {
    const Cookie = req.cookies.resetPasswordOTP;
    const { Password, RepeatPassword } = req.body;
    if (!Cookie) {
      return res.json({
        message: "Password Reset TimeOut ",
        success: false,
        status: 404,
      });
    }

    const decodedToken = await decodingToken(
      Cookie,
      process.env.JWT_API_SECRET_KEY
    );

    console.log("decoded token is ", decodedToken);

    if (decodedToken.otpVerified === false) {
      return res.json({
        success: false,
        message: "Verification TimeOut ",
        status: 500,
      });
    }
    console.log(Password);
    console.log(RepeatPassword);
    if (Password !== RepeatPassword) {
      return res.json({ success: false, message: "Passwords Don't Match" });
    }

    const { _id } = decodedToken;
    console.log(_id);
    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log(hashedPassword);
    const user = await Users.findByIdAndUpdate(
      _id,
      { password: hashedPassword },
      { new: true },
      {
        updatedAt: Date.now(),
      }
    );

    console.log(user.password);
    if (!user) {
      return res.json({ success: false, message: "User Don't Found" });
    } else {
      res.clearCookie("resetPasswordOTP");
      res.clearCookie("jwt");

      return res.json({
        success: true,
        message: "Password Changed Successfully",
      });
    }

    console.log(user);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  CheckMailforForget,
  ConfirmOtp,
  CreateNewPassword,
};
