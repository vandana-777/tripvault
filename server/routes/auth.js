const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    try {
        const { name, username, bio, email, password } = req.body;
        if (!username) {
    return res.status(400).json({
        message: "Username is required"
    });
}

const existingUser = await User.findOne({
    $or: [
        { email },
        { username }
    ]
});

if (existingUser) {
    return res.status(400).json({
        message: "Email or username already exists"
    });
}

        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
    name,
    username,
    bio: bio || "",
    email,
    password: hashedPassword,
});
      
        await user.save();

        res.status(201).json({
            message: "User registered successfully"
});

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});
// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});
// Get Logged-in User
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

// GET /api/auth/profile/:id
// Get a user's public profile and their public trips
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name bio"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const Trip = require("../models/Trip");

    const trips = await Trip.find({
      user: req.params.id,
    }).select(
      "title destination startDate endDate description rating coverImage photos createdAt"
    );

    res.status(200).json({
      user,
      trips,
    });
  } catch (error) {
    console.error("Get Public Profile Error:", error);

    res.status(500).json({
      message: "Failed to load public profile",
    });
  }
});
// GET /api/auth/profiles
// Get users for the Discover Travelers page
router.get("/profiles", async (req, res) => {
  try {
    const users = await User.find({})
      .select("name bio")
      .sort({ name: 1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get Profiles Error:", error);

    res.status(500).json({
      message: "Failed to load travelers",
    });
  }
});
module.exports = router;