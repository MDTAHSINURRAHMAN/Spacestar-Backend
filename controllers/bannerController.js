import { Banner } from "../models/Banner.js";

// Get banner
export const getBanner = async (req, res) => {
  try {
    const banners = await Banner.findAll();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new banner
export const createBanner = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : null;
    
    const banner = await Banner.create({
      title: req.body.title,
      description: req.body.description,
      imageUrl: imageUrl,
      isActive: req.body.isActive === "true"
    });
    
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const banner = await Banner.findById(bannerId);
    
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    
    // Update image if a new one is uploaded
    if (req.file) {
      banner.imageUrl = req.file.path;
    }
    
    // Update other fields
    banner.title = req.body.title || banner.title;
    banner.description = req.body.description || banner.description;
    banner.isActive = req.body.isActive === "true";
    
    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update banner text only
export const updateBannerText = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const banner = await Banner.findById(bannerId);
    
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    
    banner.title = req.body.title || banner.title;
    banner.description = req.body.description || banner.description;
    
    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const result = await Banner.delete(bannerId);
    
    if (result.deletedCount > 0) {
      res.json({ message: "Banner deleted successfully" });
    } else {
      res.status(404).json({ message: "Banner not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
