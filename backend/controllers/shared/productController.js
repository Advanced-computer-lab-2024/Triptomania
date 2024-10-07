// admin.js (Using ES Modules)
import productModel from '../../models/product.js';
import multer from 'multer';
import mongoose from 'mongoose'; // Ensure mongoose is imported for ObjectId validation

 const addProduct = async (req, res) => {
   try {
      const {Name,Description, Price, Seller, Ratings, Reviews, Quantity } = req.body;

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

      const prod = await newProduct.save();

      res.status(201).json({ message: "Product added successfully", product: prod });
   } catch (error) {
      res.status(500).json({ message: "Error adding product", error: error.message });
   }
};

const uploadPicture = async (req, res) => {
   try {
       const { id } = req.params;

       // Check if a file is uploaded
       if (!req.file) {
           return res.status(400).json({ message: "Product image is required." });
       }

       // Convert the file buffer to a Base64 string
       const base64Image = req.file.buffer.toString('base64');

       // Update the product with the new image
       const updatedProduct = await productModel.findByIdAndUpdate(
           id,
           { Picture: base64Image },
           { new: true, runValidators: true }
       );

       // Check if the product was found
       if (!updatedProduct) {
           return res.status(404).json({ message: "Product not found." });
       }

       // Return the updated product
       res.status(200).json({ message: "Uploaded successfully", data: updatedProduct });
   } catch (error) {
       res.status(500).json({ message: "Error uploading photo", error: error.message });
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


const searchProduct = async (req, res) => {
   try {
      const { Name } = req.query;

      // Ensure name is a string and exists
      if (!Name || typeof Name !== 'string') {
         return res.status(400).json({ message: 'Invalid product name' });
      }

      const products = await productModel.find({ Name: { $regex: Name, $options: 'i' } });

      if (products.length === 0) {
         return res.status(404).json({ message: 'No products found with the given name' });
      }

      res.status(200).json(products);
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error searching for products', error });
   }
};



const filterProducts = async (req, res) => {
   try {
       const { minPrice, maxPrice } = req.query;

       // Ensure both minPrice and maxPrice are defined and are valid numbers
       const min = minPrice ? Number(minPrice) : null;
       const max = maxPrice ? Number(maxPrice) : null;

       // Validate price values
       if (
           (min === null && max === null) || 
           (min < 0) || 
           (max < 0) || 
           (isNaN(min) && minPrice !== undefined) || 
           (isNaN(max) && maxPrice !== undefined)
       ) {
           return res.status(400).json({ message: "Please provide valid price values." });
       }

       let filter = {};
       // Build the filter based on the provided min and max prices
       if (min !== null && max !== null) {
           filter.Price = { $gte: min, $lte: max };
       } else if (min !== null) {
           filter.Price = { $gte: min };
       } else if (max !== null) {
           filter.Price = { $lte: max };
       }

       // Query the products with the constructed filter
       const products = await productModel.find(filter);

       // If no products are found, return a 404 response
       if (products.length === 0) {
           return res.status(404).json({ message: 'No products found within the specified price range.' });
       }

       // Return the filtered products
       res.status(200).json(products);
   } catch (error) {
       console.log(error);
       res.status(500).json({ message: 'Error filtering products by price', error: error.message });
   }
};


 const sortProducts = async (req, res) => {
   try {
       
       const { order } = req.query;

       if (!order || (order !== 'high' && order !== 'low')) {
           return res.status(400).json({ message: 'Please provide a valid order value ("high" or "low").' });
       }

       const sortOrder = order === 'high' ? -1 : 1; // -1 for descending, 1 for ascending

       
       const products = await productModel.find().sort({ Ratings: sortOrder });

       if (products.length === 0) {
           return res.status(404).json({ message: 'No products found.' });
       }

       res.status(200).json(products);
   } catch (error) {
       
       console.error(error);
       res.status(500).json({ message: 'Error sorting products by ratings', error: error.message });
   }
};



export default{
   addProduct,
   editProduct,
   viewProducts,
   searchProduct,
   filterProducts,
   sortProducts,
   uploadPicture
}