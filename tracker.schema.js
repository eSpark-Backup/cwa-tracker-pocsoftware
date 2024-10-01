const mongoose = require("mongoose");

// Define the Tracker schema
const trackerSchema = new mongoose.Schema(
  {
    deviceId: { type: String, unique: true, required: true }, // Unique device ID
    deviceName: { type: String, required: true }, // Device name
    location: {
      // Location with latitude and longitude
      type: {
        type: String, // 'Point'
        enum: ["Point"], // 'Point' is the only type
        required: true,
      },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User
  },
  { timestamps: true }
); // Include timestamps

// Create the Tracker model
const Tracker = mongoose.model("Tracker", trackerSchema);

module.exports = Tracker; // {{ edit_2 }}
