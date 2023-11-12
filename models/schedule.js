const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    required: true,
  },
  timeSlots: [
    {
      type: String,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, // HH:MM format validation
    },
  ],
});

module.exports = { scheduleSchema };
