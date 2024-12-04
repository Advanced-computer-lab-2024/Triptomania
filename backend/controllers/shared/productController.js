// admin.js (Using ES Modules)
import productModel from '../../models/product.js';
import mongoose from 'mongoose'; // Ensure mongoose is imported for ObjectId validation

 const addProduct = async (req, res) => {
   try {
      const {Name,Description, Price, Ratings, Reviews, Quantity } = req.body;
      const Seller = req.user._id;

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
       const { id } = req.body;

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
      const { id, Name,Description, Price, Seller, Quantity, Reviews, Ratings } = req.body;

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

const getProductById = async (req, res) => {
   try {
     const { id } = req.params;
 
     // Validate the ID format
     if (!mongoose.Types.ObjectId.isValid(id)) {
       return res.status(400).json({ message: "Invalid product ID format." });
     }
 
     // Find the product by ID
     const product = await productModel.findById(id).populate('Seller', 'username');
     if (!product) {
       return res.status(404).json({ message: "Product not found" });
     }
 
     res.status(200).json({ message: "Product fetched successfully", product });
   } catch (error) {
     console.error('Error fetching product:', error);
     res.status(500).json({ message: "Error fetching product", error: error.message });
   }
 };
 


const viewProducts = async (req, res) => {
   try {
      // Exclude archived products by setting Archive: false in the filter
      const products = await productModel.find({ Archive: false }).populate('Seller', 'username');
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
       const { minPrice, maxPrice, averageRating } = req.query;

       const min = minPrice ? Number(minPrice) : null;
       const max = maxPrice ? Number(maxPrice) : null;

       let filter = {};

       // Price range filter
       if (min !== null && max !== null) {
           filter.Price = { $gte: min, $lte: max };
       } else if (min !== null) {
           filter.Price = { $gte: min };
       } else if (max !== null) {
           filter.Price = { $lte: max };
       }

       // Handle averageRating filter
       if (averageRating) {
           const rating = Number(averageRating); // Ensure it's a number
           if (isNaN(rating)) {
               return res.status(400).json({ message: "Invalid rating value" });
           }
           filter.averageRating = { $gte: rating }; // Assuming averageRating is a numeric field in DB
       }

       const products = await productModel.find(filter);

       if (products.length === 0) {
           return res.status(404).json({ message: 'No products found with the given filters.' });
       }

       res.status(200).json(products);
   } catch (error) {
       console.log(error);
       res.status(500).json({ message: 'Error filtering products', error: error.message });
   }
};



 const sortProducts = async (req, res) => {
   try {
       

       const { order } = req.query;

       if (!order || (order !== 'high' && order !== 'low')) {
           return res.status(400).json({ message: 'Please provide a valid order value ("high" or "low").' });
       }

       const sortOrder = order === 'high' ? -1 : 1; // -1 for descending, 1 for ascending

       
       const products = await productModel.find().sort({ averageRating: sortOrder });

       if (products.length === 0) {
           return res.status(404).json({ message: 'No products found.' });
       }

       res.status(200).json(products);
   } catch (error) {
       
       console.error(error);
       res.status(500).json({ message: 'Error sorting products by ratings', error: error.message });
   }
};

const toggleArchiveStatus = async (req, res) => {
   const { id } = req.body;

   try {
       // Validate the product ID
       if (!mongoose.Types.ObjectId.isValid(id)) {
           return res.status(400).json({ message: "Invalid product ID format." });
       }

       // Find the product and toggle the Archive status
       const product = await productModel.findById(id);
       if (!product) {
           return res.status(404).json({ message: "Product not found." });
       }

       // Toggle the Archive status
       product.Archive = !product.Archive;

       await productModel.findByIdAndUpdate(id, { Archive: product.Archive });

       return res.status(200).json({ message: "Product archive status updated", product });
   } catch (error) {
       return res.status(500).json({ message: "Error updating archive status", error: error.message });
   }
};

const getProductSales = async (req, res) => {
   try {
      const { productId } = req.body;

      const product = await productModel.findById(productId);
      if (!product) {
         return res.status(404).json({ message: 'Product not found' });
      }

      const sales = product.Sales;
      res.status(200).json({ message: 'Product sales retrieved successfully', sales: sales });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error retrieving product sales', error });
   }
}

export default{
   addProduct,
   getProductById,
   editProduct,
   viewProducts,
   searchProduct,
   filterProducts,
   sortProducts,
   uploadPicture,
   toggleArchiveStatus,
   getProductSales
}