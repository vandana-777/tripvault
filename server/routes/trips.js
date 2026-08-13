const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/trips
// Create a new trip
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, destination, startDate, endDate, description, rating } =
      req.body;

    const trip = new Trip({
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
      user: req.user.id,
    });

    const savedTrip = await trip.save();

    res.status(201).json({
      message: "Trip created successfully",
      trip: savedTrip,
    });
  } catch (error) {
    console.error("Create Trip Error:", error);
    res.status(500).json({
      message: "Failed to create trip",
    });
  }
});

// GET /api/trips
// Get all trips for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id });

    res.status(200).json(trips);
  } catch (error) {
    console.error("Get Trips Error:", error);
    res.status(500).json({
      message: "Failed to fetch trips",
    });
  }
});
// GET /api/trips/:id
// Get a single trip belonging to the logged-in user
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error("Get Trip Error:", error);
    res.status(500).json({
      message: "Failed to fetch trip",
    });
  }
});
// PUT /api/trips/:id
// Update a trip - owner only
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // Check ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this trip",
      });
    }

    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    trip.title = title ?? trip.title;
    trip.destination = destination ?? trip.destination;
    trip.startDate = startDate ?? trip.startDate;
    trip.endDate = endDate ?? trip.endDate;
    trip.description = description ?? trip.description;
    trip.rating = rating ?? trip.rating;

    const updatedTrip = await trip.save();

    res.status(200).json({
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.error("Update Trip Error:", error);
    res.status(500).json({
      message: "Failed to update trip",
    });
  }
});
// DELETE /api/trips/:id
// Delete a trip - owner only
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // Check ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this trip",
      });
    }

    await trip.deleteOne();

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Delete Trip Error:", error);
    res.status(500).json({
      message: "Failed to delete trip",
    });
  }
});

module.exports = router;