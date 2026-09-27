import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary globally
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      return null;
    }

    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Remove local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Return full result object so user.controllers.js can access .secure_url or .url
    return uploadResult;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Remove local file if upload fails
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null;
  }
};

// Export as a named export to match: import { uploadOnCloudinary } from "../utils/cloudinary.js"
export { uploadOnCloudinary };