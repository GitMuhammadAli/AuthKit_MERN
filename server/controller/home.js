const Users = require("../model/userModel");

exports.userHome = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("sending to frontend" + user )
    res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.adminHome = async (req, res) => {};
