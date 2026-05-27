const express = require("express");
const Request = require("../models/Request");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/requests - Fetch all requests
router.get("/", protect, async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching requests",
      error: error.message
    });
  }
});

// POST /api/requests - Create new request/token
router.post("/", protect, async (req, res) => {
  try {
    const { userName, role, service, purpose, timeSlot } = req.body;

    if (!userName || !role || !service || !purpose || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "userName, role, service, purpose, and timeSlot are required"
      });
    }

    const lastRequest = await Request.findOne().sort({ tokenNumber: -1 });
    const nextTokenNumber = lastRequest ? lastRequest.tokenNumber + 1 : 101;

    const request = await Request.create({
      userName,
      role,
      service,
      purpose,
      tokenNumber: nextTokenNumber,
      timeSlot,
      status: "Waiting"
    });

    res.status(201).json({
      success: true,
      message: "Request booked successfully",
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error booking request",
      error: error.message
    });
  }
});

// PUT /api/requests/:id - Update request status
router.put("/:id", protect, async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating request",
      error: error.message
    });
  }
});

// DELETE /api/requests/:id - Delete/cancel request
router.delete("/:id", protect, async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting request",
      error: error.message
    });
  }
});

module.exports = router;