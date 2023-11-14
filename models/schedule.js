const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  frequency: {
    type: String,
    required: true,
    enum: ["Once", "Twice"],
    default: "Once",
  },
  timeSlots: {
    type: [String],
    required: true,
    default: ["12:00"],
    validate: {
      validator: (slots) =>
        slots.every((slot) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(slot)),
      message: "Invalid time slot format. Use HH:MM format.",
    },
  },
});

module.exports = { scheduleSchema };
