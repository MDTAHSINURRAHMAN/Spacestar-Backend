import { Banner } from "../models/Banner.js";

export const getBanner = async (req, res) => {
  try {
    const banner = await Banner.get();
    res.status(200).json(banner);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching banner", error: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const result = await Banner.update(req.file);
    res.status(200).json({ message: "Banner updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating banner", error: error.message });
  }
};
