import { Product } from "../models/Product.js";
import { ObjectId } from "mongodb";
import { uploadToS3, getSignedImageUrl } from "../services/s3Service.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    // Get signed URLs for all images
    const productsWithSignedUrls = await Promise.all(
      products.map(async (product) => {
        if (product.images && product.images.length > 0) {
          const signedUrls = await Promise.all(
            product.images.map((key) => getSignedImageUrl(key))
          );
          return { ...product, images: signedUrls };
        }
        return product;
      })
    );

    res.status(200).json(productsWithSignedUrls);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get signed URLs for images
    if (product.images && product.images.length > 0) {
      const signedUrls = await Promise.all(
        product.images.map((key) => getSignedImageUrl(key))
      );
      product.images = signedUrls;
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const files = req.files;

    // Handle image uploads
    if (files && files.length > 0) {
      const imageKeys = await Promise.all(
        files.map(async (file) => {
          const key = `products/${Date.now()}-${file.originalname}`;
          return await uploadToS3(file, key);
        })
      );
      productData.images = imageKeys;
    }

    // ✅ No unnecessary JSON.parse
    if (!Array.isArray(productData.sizes)) {
      productData.sizes = [productData.sizes];
    }
    if (!Array.isArray(productData.colors)) {
      productData.colors = [productData.colors];
    }

    const result = await Product.create(productData);
    res.status(201).json(result);
  } catch (error) {
    console.error(error); // Add this for future debugging
    res
      .status(400)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const productData = req.body;
    const files = req.files; // Uploaded files

    // Existing images from frontend
    const existingImages = JSON.parse(productData.existingImages || "[]");

    let finalImages = existingImages;

    // Handle new image uploads
    if (files && files.length > 0) {
      const uploadedKeys = await Promise.all(
        files.map(async (file) => {
          const key = `products/${Date.now()}-${file.originalname}`;
          return await uploadToS3(file, key);  // Assume this returns the S3 key
        })
      );
      finalImages = [...existingImages, ...uploadedKeys];
    }

    // Prepare final update data
    const updateData = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      category: productData.category,
      stock: parseInt(productData.stock),
      isPreOrder: productData.isPreOrder === "true",
      sizes: JSON.parse(productData.sizes),
      colors: JSON.parse(productData.colors),
      images: finalImages,  // ✅ New + old images combined
      updatedAt: new Date(),
    };

    const result = await Product.update(productId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Error updating product", error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const result = await Product.delete(productId);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};
