import React, { useState, useEffect } from 'react';
import { Header } from '../../components/HeaderTourist';
import axiosInstance from '@/axiosInstance';
import { DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/components/Loading";
import './WishList.css';

const WishList = () => {
  const [wishListItems, setWishListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State to track quantity for each item
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchWishListItems();
  }, []);

  const fetchWishListItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/tourist/wishlist/getWishlist');
      const itemsWithDetails = response.data.wishlist?.length
        ? await Promise.all(
            response.data.wishlist.map(async (item) => {
              const productResponse = await axiosInstance.get(`/api/tourist/product/${item}`);
              return {
                product: productResponse.data.product,
              };
            })
          )
        : [];
      setWishListItems(itemsWithDetails);
    } catch (error) {
      console.error('Error fetching wish list:', error);
      showNotification('Failed to load wish list items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleMoveToCart = async (productId, quantity) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await axiosInstance.post('/api/tourist/cart/addProduct', { productId, quantity });
      if (response.status === 200) {
        await axiosInstance.post('/api/tourist/wishlist/removeProduct', { productId });
        await fetchWishListItems();
        showNotification('Item moved to cart', 'success');
      }
    } catch (error) {
      console.error('Error moving item to cart:', error);
      showNotification('Failed to move item to cart', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await axiosInstance.post('/api/tourist/wishlist/removeProduct', { productId });
      if (response.data.message === 'product removed from wishlist successfully') {
        await fetchWishListItems();
        showNotification('Item removed from wishlist', 'success');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification('Failed to remove item', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuantityChange = (productId, operation) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId] || 1;
      const newQuantity = operation === 'increment' ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);
      return { ...prevQuantities, [productId]: newQuantity };
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="cart-page">
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

      <div className="wishlist-container">
        <h1 className="wishlist-title">Wishlist</h1>

        {wishListItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your wish list is empty</p>
          </div>
        ) : (
          <>
            <div className="wishlist-items">
              {wishListItems.map((item) => {
                const quantity = quantities[item.product._id] || 1;
                return (
                  <motion.div
                    key={item.product._id}
                    className="wishlist-item"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="item-image">
                      <img
                        src={item.product?.Picture ? `data:image/jpeg;base64,${item.product.Picture}` : 'https://via.placeholder.com/100'}
                        alt={item.product?.Name}
                      />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.product?.Name}</h3>
                      <p className="item-price">
                        <DollarSign className="icon" />
                        {item.product?.Price?.toFixed(2)}
                      </p>
                    </div>
                    <div className="item-actions">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={isUpdating}
                        className="remove-button"
                      >
                        Remove
                      </Button>
                      <div className="quantity-controls">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.product._id, 'decrement')}
                          disabled={isUpdating}
                        >
                          -
                        </Button>
                        <span className="quantity-display">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.product._id, 'increment')}
                          disabled={isUpdating}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleMoveToCart(item.product._id, quantity)}
                        disabled={isUpdating}
                        className="move-to-cart-button"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishList;
