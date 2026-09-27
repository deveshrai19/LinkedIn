import fs from "fs";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import User from "../models/user.model.js";

// Helper function to safely delete local temporary files
const removeLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Error removing temp file:", err);
    }
  }
};

// Export getCurrentUser
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Export updateProfile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, userName, headline, location, gender, skills, education, experience } = req.body;
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (userName) updateData.userName = userName;
    if (headline !== undefined) updateData.headline = headline;
    if (location !== undefined) updateData.location = location;

    if (gender && ["male", "female", "other"].includes(gender.toLowerCase())) {
      updateData.gender = gender.toLowerCase();
    }

    // Safely parse JSON string arrays/objects sent via FormData
    if (skills) {
      updateData.skills = typeof skills === "string" ? JSON.parse(skills) : skills;
    }
    if (education) {
      updateData.education = typeof education === "string" ? JSON.parse(education) : education;
    }
    if (experience) {
      updateData.experience = typeof experience === "string" ? JSON.parse(experience) : experience;
    }

    // Process profile image upload safely
    if (req.files?.profileImage?.[0]) {
      const localPath = req.files.profileImage[0].path;
      const uploaded = await uploadOnCloudinary(localPath);
      if (uploaded?.secure_url) {
        updateData.profileImage = uploaded.secure_url;
      }
      removeLocalFile(localPath);
    }

    // Process cover image upload safely
    if (req.files?.coverImage?.[0]) {
      const localPath = req.files.coverImage[0].path;
      const uploaded = await uploadOnCloudinary(localPath);
      if (uploaded?.secure_url) {
        updateData.coverImage = uploaded.secure_url;
      }
      removeLocalFile(localPath);
    }

    const userId = req.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};