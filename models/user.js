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
  schedule: {
    type: [scheduleSchema],
    required: true,
    default: {
      day: "Monday",
      frequency: "Once",
      timeSlots: ["12:00"],
    },
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
