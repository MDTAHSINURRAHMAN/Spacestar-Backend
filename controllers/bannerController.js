import { Banner, BannerText } from "../models/Banner.js";

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
    const { text } = req.body;
    if (!req.file && typeof text !== "string") {
      return res
        .status(400)
        .json({ message: "Image file or text is required" });
    }
    await Banner.update(req.file, text);
    res.status(200).json({ message: "Banner updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating banner", error: error.message });
  }
};

export const updateBannerText = async (req, res) => {
  try {
    const { text } = req.body;
    await BannerText.update(text);
    res.status(200).json({ message: "Banner text updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating banner text", error: error.message });
  }
};
