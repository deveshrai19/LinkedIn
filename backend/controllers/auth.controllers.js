import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import genToken from "../config/token.js";

// =========================
// SIGN UP
// =========================
export const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
    } = req.body;

    // Check required fields
    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Clean input
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanUserName = userName.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check existing email
    const existEmail = await User.findOne({
      email: cleanEmail,
    });

    if (existEmail) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // Check existing username
    const existUsername = await User.findOne({
      userName: cleanUserName,
    });

    if (existUsername) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName: cleanFirstName,
      lastName: cleanLastName,
      userName: cleanUserName,
      email: cleanEmail,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = genToken(user._id);

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Fixed: changed from strict to lax for cross-origin support
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or username already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = genToken(user._id);

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Fixed: changed from strict to lax for cross-origin support
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =========================
// LOGOUT
// =========================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};