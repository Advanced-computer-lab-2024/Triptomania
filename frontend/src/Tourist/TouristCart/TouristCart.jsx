import React, { useState, useEffect } from 'react';
import { Header } from '../../components/HeaderTourist';
import axiosInstance from '@/axiosInstance';
import { DollarSign, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/components/Loading";
import './TouristCart.css';

const TouristCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get('/api/tourist/cart/getCart');
      // Fetch product details for each cart item
      const itemsWithDetails = await Promise.all(
        response.data.cart.map(async (item) => {
          const productResponse = await axiosInstance.get(`/api/tourist/product/${item.productId}`);
          return {
            ...item,
            product: productResponse.data.product
          };
        })
      );
      setCartItems(itemsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showNotification('Failed to load cart items', 'error');
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (isUpdating) return;
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      const response = await axiosInstance.post('/api/tourist/cart/changeQuantity', {
        productId,
        quantity: newQuantity
      });

      if (response.data.message === "cart quantity updated successfully") {
        await fetchCartItems(); // Refresh cart after update
        showNotification('Cart updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification(
        error.response?.data?.error || 'Failed to update quantity', 
        'error'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await axiosInstance.post('/api/tourist/cart/removeProduct', {
        productId
      });
      if (response.data.message === 'product removed from cart successfully') {
        await fetchCartItems(); // Refresh cart after removal
        showNotification('Item removed from cart', 'success');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification('Failed to remove item', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.Price * item.quantity || 0);
    }, 0);
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

      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <motion.div 
                  key={item.productId}
                  className="cart-item"
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
                  <div className="item-quantity">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isUpdating}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="quantity-display">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={isUpdating}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="item-total">
                    <DollarSign className="icon" />
                    {(item.product?.Price * item.quantity).toFixed(2)}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={isUpdating}
                    className="remove-button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="total">
                <span>Total:</span>
                <span className="total-amount">
                  <DollarSign className="icon" />
                  {calculateTotal().toFixed(2)}
                </span>
              </div>
              <Button 
                className="checkout-button"
                onClick={() => {/* Implement checkout logic */}}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TouristCart;