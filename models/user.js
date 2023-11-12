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
  schedule: [scheduleSchema],
});

userSchema.methods.sendNotification = function (message) {
  // Replace this with your logic to send notifications
  console.log(`Sending notification to ${this.name} at ${this.email}: ${message}`);
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
