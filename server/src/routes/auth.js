const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Helper: generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route  POST /api/auth/register
// @desc   Register a new user
// @access Public
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty().withMessage("Name is required")
      .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("dateOfBirth")
      .notEmpty().withMessage("Date of birth is required")
      .isISO8601().withMessage("Please provide a valid date"),
    body("email")
      .normalizeEmail()
      .isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { name, dateOfBirth, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      // Create user
      const user = await User.create({ name, dateOfBirth, email, password });

      // Generate token
      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: "Account created successfully!",
        token,
        user: user.toSafeObject(),
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during registration. Please try again.",
      });
    }
  }
);

// @route  POST /api/auth/login
// @desc   Login a user
// @access Public
router.post(
  "/login",
  [
    body("email")
      .normalizeEmail()
      .isEmail().withMessage("Please provide a valid email"),
    body("password")
      .notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      // Find user and include password field
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Generate token
      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        token,
        user: user.toSafeObject(),
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during login. Please try again.",
      });
    }
  }
);

// @route  GET /api/auth/me
// @desc   Get current logged-in user
// @access Protected
router.get("/me", protect, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user.toSafeObject(),
  });
});

module.exports = router;
