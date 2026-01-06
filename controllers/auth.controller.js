const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/user.model");
const cookies = require("cookie-parser"); 

const generateToken = async(userId) => {
 try {
   const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found for token generation");
  }
  const token = user.generateAuthToken();
  user.authToken = token;
  await user.save({ validateBeforeSave: false});
  return token;
 } catch (error) {
  throw new Error("Failed to generate token");
 }
}


const registerController = asyncHandler(async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const loginController = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token=await generateToken(user._id);
    res.cookie("authToken", token, { httpOnly: true, secure: true, sameSite: "Strict" });

    res.status(200).json({ message: "Login successful" });
    console.log("User logged in:", username);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const logoutController = asyncHandler(async (req, res) => {
  try {
    req.user.authToken = null;
    await req.user.save({ validateBeforeSave: false });
    res.clearCookie("authToken", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  } 
});


exports.logoutController = logoutController;
exports.loginController = loginController;
exports.registerController = registerController;
