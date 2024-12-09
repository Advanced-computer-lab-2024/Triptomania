import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CreditCard,
    Wallet,
    Truck,
    Tag,
    MapPin
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from '@/axiosInstance';
import { useUser } from '@/UserContext';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [checkoutData, setCheckoutData] = useState({
        paymentMethod: '',
        selectedAddress: null,
        promoCode: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        calculateTotal();
        if (user?.deliveryAddresses) {
            setAddresses(user.deliveryAddresses);
        }
    }, [user]);

    const calculateTotal = async () => {
        try {
            const response = await axiosInstance.get('/api/tourist/cart/getCart');
            const itemsWithDetails = await Promise.all(
                response.data.cart.map(async (item) => {
                    const productResponse = await axiosInstance.get(`/api/tourist/product/${item.productId}`);
                    return {
                        ...item,
                        product: productResponse.data.product
                    };
                })
            );
            
            const total = itemsWithDetails.reduce((sum, item) => {
                return sum + (item.product?.Price * item.quantity || 0);
            }, 0);
            
            setTotalAmount(total);
        } catch (error) {
            console.error('Error calculating total:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCheckoutData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'paymentMethod') {
            setError('');
            if (value === 'wallet' && user.wallet < totalAmount) {
                setError(`Insufficient wallet balance. Available: $${user.wallet}`);
            }
        }
    };

    const handleAddressSelect = (address) => {
        setCheckoutData(prev => ({
            ...prev,
            selectedAddress: address
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!checkoutData.selectedAddress) {
            setError('Please select a delivery address');
            return;
        }
    
        if (!checkoutData.paymentMethod) {
            setError('Please select a payment method');
            return;
        }
    
        const addressIndex = addresses.findIndex(addr => 
            addr.address === checkoutData.selectedAddress.address &&
            addr.city === checkoutData.selectedAddress.city &&
            addr.state === checkoutData.selectedAddress.state &&
            addr.zip === checkoutData.selectedAddress.zip
        );
    
        if (addressIndex === -1) {
            setError('Invalid address selection');
            return;
        }
    
        if (checkoutData.paymentMethod === 'wallet') {
            if (user.wallet < totalAmount) {
                setError(`Insufficient wallet balance. Available: $${user.wallet}`);
                return;
            }
        }
    
        if (checkoutData.paymentMethod === 'card') {
            if (!checkoutData.cardNumber || !checkoutData.cardExpiry || !checkoutData.cardCVV) {
                setError('Please fill in all card details');
                return;
            }
            if (checkoutData.cardNumber.length !== 16) {
                setError('Invalid card number');
                return;
            }
            if (checkoutData.cardCVV.length !== 3) {
                setError('Invalid CVV');
                return;
            }
            // Add expiry date validation
            const [month, year] = checkoutData.cardExpiry.split('/');
            if (!month || !year || month > 12 || month < 1) {
                setError('Invalid expiry date');
                return;
            }
        }
    
        setLoading(true);
        try {
            const requestPayload = {
                paymentMethod: checkoutData.paymentMethod,
                address: addressIndex,
                ...(checkoutData.promoCode && { promoCode: checkoutData.promoCode })
            };
    
            console.log('Sending request to:', '/api/tourist/cart/checkoutCart');
            console.log('Request payload:', requestPayload);
    
            const response = await axiosInstance.post('/api/tourist/cart/checkoutCart', requestPayload);
            
            if (response.data.success) {
                if (checkoutData.paymentMethod === 'wallet') {
                    // Update user's wallet balance in context
                    const newBalance = user.wallet - totalAmount;
                    setUser(prev => ({
                        ...prev,
                        wallet: newBalance
                    }));
                }
                
                // Clear any existing errors
                setError('');
                
                // Navigate to thank you page
                navigate('/thankyou');
            }
        } catch (error) {
            console.error('Full error:', error);
            console.error('Error response:', error.response);
            
            const errorMessage = error.response?.data?.error || 'Error processing checkout';
            console.error('Checkout error:', errorMessage);
            setError(errorMessage);
            
            if (errorMessage.includes('Promo code')) {
                setCheckoutData(prev => ({
                    ...prev,
                    promoCode: ''
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h2>Checkout</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="section">
                        <h3>Payment Method</h3>
                        <div className="payment-options">
                            <div 
                                className={`payment-option ${checkoutData.paymentMethod === 'card' ? 'selected' : ''}`}
                                onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'card' } })}
                            >
                                <CreditCard />
                                <span>Credit Card</span>
                            </div>
                            <div 
                                className={`payment-option ${checkoutData.paymentMethod === 'wallet' ? 'selected' : ''}`}
                                onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'wallet' } })}
                            >
                                <Wallet />
                                <div className="wallet-info">
                                    <span>Wallet</span>
                                    <span className="wallet-balance">Available: ${user.wallet?.toFixed(2)}</span>
                                </div>
                            </div>
                            <div 
                                className={`payment-option ${checkoutData.paymentMethod === 'COD' ? 'selected' : ''}`}
                                onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'COD' } })}
                            >
                                <Truck />
                                <span>Cash on Delivery</span>
                            </div>
                        </div>

                        {checkoutData.paymentMethod === 'card' && (
                            <div className="card-details">
                                <div className="input-group">
                                    <Input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="Card Number"
                                        value={checkoutData.cardNumber}
                                        onChange={handleChange}
                                        maxLength="16"
                                    />
                                </div>
                                <div className="card-extra-details">
                                    <Input
                                        type="text"
                                        name="cardExpiry"
                                        placeholder="MM/YY"
                                        value={checkoutData.cardExpiry}
                                        onChange={handleChange}
                                        maxLength="5"
                                    />
                                    <Input
                                        type="text"
                                        name="cardCVV"
                                        placeholder="CVV"
                                        value={checkoutData.cardCVV}
                                        onChange={handleChange}
                                        maxLength="3"
                                    />
                                </div>
                            </div>
                        )}

                        {checkoutData.paymentMethod === 'wallet' && (
                            <div className={`wallet-status ${user.wallet < totalAmount ? 'insufficient' : 'sufficient'}`}>
                                {user.wallet < totalAmount ? (
                                    <div className="wallet-warning">
                                        Insufficient wallet balance. Available: ${user.wallet?.toFixed(2)}
                                    </div>
                                ) : (
                                    <div className="wallet-info">
                                        <p>Current Balance: ${user.wallet?.toFixed(2)}</p>
                                        <p>After Purchase: ${(user.wallet - totalAmount).toFixed(2)}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="section">
                        <h3>Delivery Address</h3>
                        <div className="addresses-list">
                            {addresses.map((address, index) => (
                                <div 
                                    key={index}
                                    className={`address-option ${checkoutData.selectedAddress === address ? 'selected' : ''}`}
                                    onClick={() => handleAddressSelect(address)}
                                >
                                    <MapPin className="icon" />
                                    <div className="address-details">
                                        <p>{address.address}</p>
                                        <p>{address.city}, {address.state} {address.zip}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h3>Promo Code</h3>
                        <div className="input-group">
                            <Tag className="input-icon" />
                            <Input
                                type="text"
                                name="promoCode"
                                placeholder="Enter promo code (optional)"
                                value={checkoutData.promoCode}
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                    if (e.key === ' ') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                        {error && error.includes('Promo code') && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Total Amount:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={
                            loading || 
                            !checkoutData.paymentMethod || 
                            !checkoutData.selectedAddress ||
                            (checkoutData.paymentMethod === 'wallet' && user.wallet < totalAmount) ||
                            (checkoutData.paymentMethod === 'card' && (!checkoutData.cardNumber || !checkoutData.cardExpiry || !checkoutData.cardCVV))
                        }
                        className="checkout-button"
                    >
                        {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;