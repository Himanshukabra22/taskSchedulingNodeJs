const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const crypto = require("crypto");

const User = require("../models/user");
const generateToken = require("../services/generateToken");
const { sendNotificationsForUser } = require("../services/sendNotificationsUser");

const generateCryptoString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // convert to hexadecimal format
    .slice(0, length); // trim to desired length
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all the fields." });
    }

    const emailExists = await User.findOne({ email });
    // const userExists = await User.findOne({ name });

    if (emailExists) {
      return res.status(400).json({ message: "user already exists." });
    }

    const salt = await bcrypt.genSalt(10);

    const encryptedPass = await bcrypt.hash(password, salt);

    const registrationToken = generateCryptoString(32);

    // console.log(registrationToken);

    // Create a new user
    const newUser = new User({
      name,
      email,
      fcmToken: registrationToken,
      password: encryptedPass,
    });

    await admin.messaging().subscribeToTopic(registrationToken, "/topics/event-notif");

    // Save the new user
    let user = await newUser.save();

    // Schedule notifications for the new user

    if (user) {
      await sendNotificationsForUser(newUser);
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        fcmToken: user.fcmToken,
        token: generateToken(user._id),
      });
    } else {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        fcmToken: user.fcmToken,
        token: generateToken(user._id),
      });
    } else {
      return res.status(404).json({ message: "No such user!" });
    }
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!req.user)
      return res.status(404).json({ error: "User not logged in." });

    const { _id: userId } = req.user;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let updateFields = {};
    if (req.body.schedule) {
      console.log(req.body.schedule);
      const uniqueDays = new Set();
      for(const Schedule of req.body.schedule)
      {
        if((frequency === "Twice" && timeSlots.length !== 2) || (frequency === "Once" && timeSlots.length !== 1))
        {
          return res.status(400).json({ error: "Error updating user: Wrong inputs." });
        }
        const {day, frequency,timeSlots} = Schedule;
        if(uniqueDays.has(day))
        {
          return res.status(400).json({ error: "Error updating user: Wrong inputs. Please enter unique days." });
        }
        else
        {
          uniqueDays.add(day);
        }
      }
      updateFields.schedule = req.body.schedule;
    }

    if (req.body.name) {
      updateFields.name = req.body.name;
    }

    // Find the user by ID and update the specified fields
    const upUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    // Save the updated user and reschedule notifications
    await sendNotificationsForUser(upUser);

    if (upUser) {
      res
        .status(200)
        .json({
          message: "User updated successfully and re-scheduling is done.",
        });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, updateUser };
