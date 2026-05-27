const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true
    },
    role: {
      type: String,
      enum: ["student", "professor", "admin"],
      required: [true, "Role is required"]
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true
    },
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true
    },
    tokenNumber: {
      type: Number,
      required: true,
      unique: true
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"]
    },
    status: {
      type: String,
      enum: ["Waiting", "Processing", "Called", "Approved", "Rejected", "Completed", "Cancelled"],
      default: "Waiting"
    }
  },
  {
    timestamps: true
  }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;