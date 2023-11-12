const mongoose = require("mongoose");
const { scheduleSchema } = require("./schedule");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fcmToken: {
    type: String,
    required: true,
    unique: true,
  },
  schedule: [scheduleSchema],
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
