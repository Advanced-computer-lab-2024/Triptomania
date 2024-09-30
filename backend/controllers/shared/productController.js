// admin.js (Using ES Modules)
import productModel from '../../models/product.js';

export const addProduct = async (req, res) => {
   try {
      const { Description, Price, Seller, Ratings, Reviews, Quantity } = req.body;

      if (!Description || !Price || !Seller || !Quantity) {
         return res.status(400).json({ message: "All required fields must be provided." });
      }

      if (typeof Description !== 'string' || typeof Seller !== 'string' ) {
         return res.status(400).json({ message: "Must be a string" });
      }
      if (typeof Price !== 'number' || Price <= 0) {
         return res.status(400).json({ message: "Price must be a positive number." });
      }
      if (Ratings && (Ratings < 0 || Ratings > 5)) {
         return res.status(400).json({ message: "Ratings must be between 0 and 5." });
      }
      if (typeof Quantity !== 'number' || Quantity < 0) {
         return res.status(400).json({ message: "Quantity must be a non-negative number." });
      }

      const newProduct = new productModel({
         Description,
         Price,
         Seller,
         Ratings: Ratings || 0,
         Reviews: Reviews || [],
         Quantity
      });

      await newProduct.save();

      res.status(201).json({ message: "Product added successfully", product: newProduct });
   } catch (error) {
      res.status(500).json({ message: "Error adding product", error: error.message });
   }
};

// No need for module.exports, just export using ES Modules syntax
