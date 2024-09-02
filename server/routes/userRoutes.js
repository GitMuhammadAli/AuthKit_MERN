const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const passwardController = require("../controller/passwordController");
const passport = require("passport");

// Functional routes
router.post("/register", userController.Register);
router.post("/login", userController.login);
router.post("/forget-password", passwardController.CheckMailforForget);
router.post("/verify-otp", passwardController.ConfirmOtp);
router.post("/reset-password", passwardController.CreateNewPassword);
// router.get("/account", userController.UserAccount);
router.get("/logout", userController.logout);

// Google authentication routes
router.get(
  "/google",
  (req, res, next) => {
    console.log("Google authentication initiated");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/fail",
    failureMessage: "Failed to authenticate. Go back and try again.",
  }),
  userController.handleGoogleCallback
);

// Facebook authentication routes
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// router.get('/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/auth/signin' }),
//     (req, res) => {
//         req.logIn(req.user, (err) => {
//             if (err) {
//                 return res.redirect('/auth/signin');
//             }

//             res.redirect('/');
//         });
//     }
// );

module.exports = router;
