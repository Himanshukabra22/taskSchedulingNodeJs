const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

const { sendNotificationsForUser } = require("./sendNotificationsUser");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please enter all the fields." });
    throw new Error("Please enter all the fields.");
  }

  const emailExists = await User.findOne({ email });
  const userExists = await User.findOne({ name });

  if (userExists || emailExists) {
    res.status(400).json({ message: "user already exists." });
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);

  const encryptedPass = await bcrypt.hash(password, salt);

  // Create a new user (adjust the logic based on your requirements)
  const newUser = new User(req.body);

  // Save the new user
  let user = await newUser.save();

  // Schedule notifications for the new user

  if (user) {
    await sendNotificationsForUser(newUser);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(404).json({ message: "No such user!" });
    }
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { _id : userId } = req.user;

    // Find the user by userId
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }



    // Update the user (adjust the logic based on your requirements)
    // ...

    

    // Save the updated user and reschedule notifications
    await sendNotificationsForUser(user);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { registerUser, loginUser, updateUser };
