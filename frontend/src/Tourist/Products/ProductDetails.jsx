import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import { Header } from '../../components/HeaderTourist';
import { DollarSign, Heart, Plus, Minus } from 'lucide-react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/components/Loading";
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isPurchaser, setIsPurchaser] = useState(true);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
  
    useEffect(() => {
      const initializeData = async () => {
        await fetchProductDetails();
        await checkWishlistStatus();
        await checkPurchaserStatus();
      };
      
      initializeData();
    }, [id]);
  
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/tourist/product/${id}`);
        const fetchedProduct = response.data.product;
        setProduct(fetchedProduct);
        setLoading(false);
  
        // Check if the logged-in tourist has rated this product
        const touristId = localStorage.getItem('touristId');
        if (touristId) {
          const touristRating = fetchedProduct.Rating.find((rating) => rating.touristId === touristId);
          if (touristRating) {
            setRating(touristRating.rating); 
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
        showNotification('Failed to load product details', 'error');
      }
    };

    const checkWishlistStatus = async () => {
      try {
        const response = await axiosInstance.get('/api/tourist/wishlist/getWishlist');
        const wishlist = response.data.wishlist;
        setIsInWishlist(wishlist.some(item => item.toString() === id));
      } catch (error) {
        console.error('Error checking wishlist status:', error);
        showNotification('Failed to check wishlist status', 'error');
      }
    };

    const checkPurchaserStatus = async () => {
      try {
        const touristId = localStorage.getItem('touristId'); // Retrieve the tourist ID
        if (!touristId) {
          console.error('touristId is not found in local storage.');
          return;
        }
    
        const response = await axiosInstance.get(`/api/tourist/product/${id}`);
        const product = response.data.product;

        console.log('Tourist ID ', touristId);
        console.log('Purchasers:', product.Purchasers);
    
        setIsPurchaser(product.Purchasers.map(String).includes(String(touristId)));
      } catch (error) {
        console.error('Error checking purchaser status:', error);
      }
    };
    

    const showNotification = (message, type = 'success') => {
      setNotification({ show: true, message, type });
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    };

    const handleWishlist = async () => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      try {
        if (isInWishlist) {
          const removeResponse = await axiosInstance.post('/api/tourist/wishlist/removeProduct', {
            productId: id
          });
          if (removeResponse.data.message === 'Product removed from wishlist successfully') {
            setIsInWishlist(false);
            showNotification('Item removed from wishlist', 'success');
          }
        } else {
          const addResponse = await axiosInstance.post('/api/tourist/wishlist/addProduct', {
            productId: id
          });
          if (addResponse.data.message === 'Product added to wishlist successfully') {
            setIsInWishlist(true);
            showNotification('Item added to wishlist', 'success');
          }
        }
      } catch (error) {
        if (error.response?.data?.error === 'Product is already in the wishlist') {
          setIsInWishlist(true);
          showNotification('Item is already in your wishlist', 'info');
        } else {
          showNotification('Something went wrong', 'error');
        }
        console.error('Error details:', error);
      } finally {
        setTimeout(() => setIsAnimating(false), 1000);
      }
    };

    const handleQuantityChange = (value) => {
      const newQuantity = Math.max(1, value);
      setQuantity(newQuantity);
    };

    const handleAddToCart = async () => {
      if (isAddingToCart) return;
      
      setIsAddingToCart(true);
      try {
        const response = await axiosInstance.post('/api/tourist/cart/addProduct', {
          productId: id,
          quantity: quantity
        });

        if (response.data.message === 'Product added to cart successfully') {
          showNotification(`Added ${quantity} item(s) to cart`, 'success');
          setQuantity(1);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification(
          error.response?.data?.error || 'Failed to add to cart', 
          'error'
        );
      } finally {
        setIsAddingToCart(false);
      }
    };


    const handleRatingSubmit = async (ratingValue) => {
      try {
        const touristId = localStorage.getItem('touristId');
        if (!touristId) {
          showNotification('You must be logged in to rate this product', 'error');
          return;
        }
  
        const response = await axiosInstance.put('/api/tourist/rateProduct', {
          productId: id,
          rating: ratingValue,
          touristId: touristId, 
        });
  
        setRating(ratingValue); 
        showNotification(response.data.message, 'success');
      } catch (error) {
        console.error('Error rating product:', error);
        showNotification('Failed to rate product', 'error');
      }
    };

    const handleReviewSubmit = async () => {
      try {
        await axiosInstance.post('/api/tourist/product/reviews', {
          id,
          review,
        });
        
        // Update the reviews in state immediately
        setProduct((prevProduct) => ({
          ...prevProduct,
          Reviews: [...prevProduct.Reviews, review],
        }));
    
        showNotification('Review added successfully', 'success');
        setReview(''); // Clear the textarea after submission
      } catch (error) {
        console.error('Error adding review:', error);
        showNotification('Failed to add review', 'error');
      }
    };
    

    if (loading) return <Loading />;
    if (!product) return <div>Product not found</div>;
  
    return (
      <div className="product-details-page">
        <Header />
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`notification ${notification.type}`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="content">
          <div className="product-details-card">
            <div className="image-container relative">
              <img
                src={product.Picture ? `data:image/jpeg;base64,${product.Picture}` : 'https://via.placeholder.com/500x300'}
                alt={product.Name}
                className="product-image"
              />
              <motion.div
                className="wishlist-icon"
                onClick={handleWishlist}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence>
                  <motion.div
                    key={isInWishlist ? 'filled' : 'empty'}
                    initial={{ scale: 1 }}
                    animate={isAnimating ? {
                      scale: [1, 1.2, 1],
                      transition: { duration: 0.3 }
                    } : {}}
                  >
                    <Heart
                      className={`heart-icon ${isInWishlist ? 'filled' : ''}`}
                      fill={isInWishlist ? '#ff0000' : 'none'}
                      color={isInWishlist ? '#ff0000' : '#000000'}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
            <div className="product-info-section">
              <h1 className="product-title">{product.Name}</h1>
              <p className="product-description">{product.Description}</p>
              <div className="product-price">
                <DollarSign className="icon" />
                {product.Price?.toFixed(2)}
              </div>
              <div className="seller-info">
                <p>Seller: {product.Seller?.username || 'Unknown'}</p>
              </div>
  
              <div className="cart-controls">
                <div className="quantity-selector">
                  <Button 
                    variant="outline"
                    size="icon"
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="quantity-input"
                  />
                  <Button 
                    variant="outline"
                    size="icon"
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>

              {isPurchaser && (
                <div className="rating-review-section">
                  <div className="rating-section">
                    <label>Rate this product:</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          onClick={() => handleRatingSubmit(star)}
                          className={`star-button ${rating >= star ? 'selected' : ''}`}
                        >
                          <Star className="star-icon" fill="none" stroke="#000000" />
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="review-section">
                    <label>Write a review:</label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                    <Button onClick={handleReviewSubmit}>Submit Review</Button>
                  </div>
                </div>
              )}
              <div className="reviews-section">
  <h2>Reviews</h2>
  {product.Reviews && product.Reviews.length > 0 ? (
    <ul className="reviews-list">
      {product.Reviews.map((review, index) => (
        <li key={index} className="review-item">
          {review}
        </li>
      ))}
    </ul>
  ) : (
    <p>No reviews yet. Be the first to review this product!</p>
  )}
</div>

            </div>
          </div>
        </div>
      </div>
    );
};

export default ProductDetails;