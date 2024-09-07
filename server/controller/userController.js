const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const { GenerateToken, decodingToken } = require("../utils/Tokens");

const initializeAdmin = async () => {
  try {
    const adminExists = await Users.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      await Users.create({
        name: "admin",
        email: "admin@authkit.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin user created with username: admin and password: admin");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};

const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (name.length < 5 || !name || !email || !password) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ message: "Invalid email format" });
    // }

    const emailCheck = await Users.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    if (newUser) {
      const token = await GenerateToken(newUser, req, res);
      return res.status(201).json({ message: "Registration successful" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { your_email, your_pass } = req.body;
    const user = await Users.findOne({ email: your_email });
    if (user && (await bcrypt.compare(your_pass, user.password))) {
      await GenerateToken(user, req, res);
      res.status(200).json({
        message: "Login successful",
        user: { id: user._id, role: user.role },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleGoogleCallback = async (req, res) => {
  try {
    await GenerateToken(req.user, req, res);
    res.redirect(process.env.CLIENT_URL || "http://localhost:4000/" );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

const logout = async (req, res) => {
  try {
    await res.clearCookie("jwt");
    await res.clearCookie("resetPasswordOTP");
    await req.session.destroy();
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userAccount = async (req, res) => {
  try {
    const UserCookie = req.cookies.jwt;
    const decodedToken = await decodingToken(UserCookie, process.env.JWT_API_SECRET_KEY);
    const user = await Users.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  initializeAdmin,
  Register,
  login,
  handleGoogleCallback,
  logout,
  userAccount,
};
