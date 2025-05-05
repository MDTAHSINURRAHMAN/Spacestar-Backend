import { getSignedImageUrl } from "../services/s3Service.js";
import { Banner } from "../models/Banner.js";

export const getBanner = async (req, res) => {
  try {
    const banners = await Banner.find();

    if (!banners || banners.length === 0) {
      return res.status(200).json({ imageUrl: null });
    }

    const banner = banners[0]; // Get the first banner
    const imageUrl = await getSignedImageUrl(banner.image); // ✅ fixed name + async

    return res.status(200).json({
      _id: banner._id,
      image: banner.image,
      imageUrl,
    });
  } catch (error) {
    console.error("❌ Error in getBanner:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBanner = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image uploaded" });

    const key = `banner/${Date.now()}-${req.file.originalname}`;
    await uploadToS3(req.file, key);

    const result = await Banner.update({ image: key });
    const imageUrl = await getSignedImageUrl(key);

    res.status(200).json({ message: "Banner updated", imageUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating banner", error: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const result = await Banner.delete();
    res.status(200).json({ message: "Banner deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting banner", error: error.message });
  }
};
