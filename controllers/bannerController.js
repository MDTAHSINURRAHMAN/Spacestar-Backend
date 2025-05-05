import { Banner } from "../models/Banner.js";
import { uploadToS3, getSignedImageUrl } from "../services/s3Service.js";
import { ObjectId } from "mongodb";

export const getBanner = async (req, res) => {
  try {
    const banner = await Banner.find();

    if (!banner || !banner.image) {
      return res.status(200).json({ imageUrl: null });
    }

    const imageUrl = await getSignedImageUrl(banner.image);

    return res.status(200).json({
      _id: banner._id,
      image: banner.image,
      imageUrl,
      updatedAt: banner.updatedAt,
    });
  } catch (error) {
    console.error("❌ getBanner error:", error.message);
    return res.status(500).json({ message: "Failed to fetch banner" });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const key = `banners/${Date.now()}-${file.originalname}`;
    await uploadToS3(file, key);

    const result = await Banner.update(new ObjectId(id), {
      image: key,
      updatedAt: new Date(),
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const signedUrl = await getSignedImageUrl(key);

    return res.status(200).json({
      message: "Banner updated",
      image: key,
      imageUrl: signedUrl,
    });
  } catch (error) {
    console.error("❌ updateBanner error:", error.message);
    return res.status(500).json({ message: "Failed to update banner" });
  }
};
