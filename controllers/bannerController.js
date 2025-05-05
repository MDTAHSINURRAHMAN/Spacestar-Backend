import { uploadToS3, getSignedImageUrl } from "../services/s3Service.js";
import { Banner } from "../models/Banner.js";

export const getBanner = async (req, res) => {
  try {
    const banner = await Banner.find();
    if (!banner) return res.status(404).json({ message: "No banner found" });

    const imageUrl = await getSignedImageUrl(banner.image);
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error fetching banner", error: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const key = `banner/${Date.now()}-${req.file.originalname}`;
    await uploadToS3(req.file, key);

    const result = await Banner.update({ image: key });
    const imageUrl = await getSignedImageUrl(key);

    res.status(200).json({ message: "Banner updated", imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error updating banner", error: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const result = await Banner.delete();
    res.status(200).json({ message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting banner", error: error.message });
  }
};
