const express = require("express");
const router = express.Router();
const { AuthorizeUser, FindUser } = require("../middleware/auth");
const home = require("../controller/home");

router.get("/auth/user/home", AuthorizeUser("user" , "admin"), home.userHome);


module.exports = router;
