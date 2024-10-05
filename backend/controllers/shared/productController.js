// admin.js (Using ES Modules)
import productModel from '../../models/product.js';
import mongoose from 'mongoose'; // Ensure mongoose is imported for ObjectId validation

 const addProduct = async (req, res) => {
   try {
      const { Name,Description, Price, Seller, Ratings, Reviews, Quantity } = req.body;

      if (!Name || !Description || !Price || !Seller || !Quantity) {
         return res.status(400).json({ message: "All required fields must be provided." });
      }

      if (typeof Name !== 'string'||typeof Description !== 'string' || typeof Seller !== 'string' ) {
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
         Name,
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


 const editProduct = async (req, res) => {
   try {
      // Extract the product ID from the request parameters
      const { id } = req.params;
      const { Name,Description, Price, Seller, Quantity, Reviews, Ratings } = req.body;

      // Validate if the id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid product ID format." });
      }

      // Check if at least one field is provided for update
      if (!Name && !Description && !Price && !Seller && !Quantity && !Reviews && !Ratings) {
         return res.status(400).json({ message: "At least one field must be provided for update." });
      }

      // Find the product by ID and update the product details
      const updatedProduct = await productModel.findOneAndUpdate(
         { _id: id }, // search by _id
         {
            $set: {
               Name: Name !== undefined ? Name : undefined,
               Description: Description !== undefined ? Description : undefined,
               Price: Price !== undefined ? Price : undefined,
               Seller: Seller !== undefined ? Seller : undefined,
               Ratings: Ratings !== undefined ? Ratings : undefined,
               Reviews: Reviews !== undefined ? Reviews : undefined,
               Quantity: Quantity !== undefined ? Quantity : undefined,
            }
         }, // update these fields
         { new: true, runValidators: true } // return the updated document and ensure validators are applied
      );

      // If the product is not found, return 404
      if (!updatedProduct) {
         return res.status(404).json({ message: "Product not found" });
      }

      // Return the updated product
      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
   } catch (error) {
      // Handle errors during product update
      res.status(500).json({ message: "Error updating product", error: error.message });
   }
};


const viewProducts = async (req, res) => {
   try {
      // Exclude 'Quantity' field by setting it to 0
      const products = await productModel.find();
      res.status(200).json(products);  
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error retrieving products', error });
   }
};





export default{
   addProduct,
   editProduct,
   viewProducts,
   //searchProduct,
   //filterProducts,
   //sortProducts
}