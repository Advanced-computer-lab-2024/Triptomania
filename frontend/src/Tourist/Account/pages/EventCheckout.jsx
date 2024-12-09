import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    CreditCard,
    Wallet,
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from '@/axiosInstance';
import { useUser } from '@/UserContext';
import { Header } from '@/components/HeaderTourist';
import './EventCheckout.css';

const EventCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useUser();
    const eventData = location.state;

    console.log("Event data in checkout:", eventData);
    
    const [checkoutData, setCheckoutData] = useState({
        paymentMethod: '',
        promoCode: eventData?.promoCode || '',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
        numberOfTickets: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalAmount, setTotalAmount] = useState(eventData?.price || 0);

    useEffect(() => {
        if (!eventData) {
            navigate('/account-management');
            return;
        }
        
        calculateTotal(eventData.price, 1);
    }, [eventData]);

    const calculateTotal = (price, tickets) => {
        const total = price * (parseInt(tickets) || 1);
        setTotalAmount(total);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCheckoutData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'numberOfTickets') {
            calculateTotal(eventData.price, parseInt(value) || 1);
        }

        if (name === 'paymentMethod') {
            setError('');
            if (value === 'wallet' && user.wallet < totalAmount) {
                setError(`Insufficient wallet balance. Available: $${user.wallet}`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!checkoutData.paymentMethod) {
            setError('Please select a payment method');
            return;
        }
    
        setLoading(true);
        try {
            console.log('Submitting payment with data:', {
                itemId: eventData.eventId,
                paymentMethod: checkoutData.paymentMethod,
                numberOfTickets: checkoutData.numberOfTickets,
                totalAmount: totalAmount
            });
    
            const paymentPayload = {
                itemId: eventData.eventId,
                paymentMethod: checkoutData.paymentMethod,
                numberOfTickets: checkoutData.numberOfTickets,
                totalAmount: totalAmount,
                ...(checkoutData.paymentMethod === 'card' && {
                    cardDetails: {
                        cardNumber: checkoutData.cardNumber,
                        cardExpiry: checkoutData.cardExpiry,
                        cardCVV: checkoutData.cardCVV
                    }
                })
            };
    
            const response = await axiosInstance.put('/api/tourist/processPayment', paymentPayload);
            
            if (response.data) {
                setUser(prev => ({
                    ...prev,
                    wallet: response.data.walletBalance,
                    points: response.data.totalPoints,
                    badge: response.data.badge
                }));
                
                navigate('/account-management');
            }
        } catch (error) {
            console.error('Full error object:', error); // Add this for debugging
            setError(error.response?.data?.message || 'Error processing payment');
        } finally {
            setLoading(false);
        }
    };
    if (!eventData) {
        return null;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">Event Checkout</h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Event Details</h3>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="font-semibold">{eventData.eventName}</p>
                            <p>Event Type: {eventData.eventType}</p>
                            <p>Date: {eventData.eventDate}</p>
                            <p>Price per ticket: ${eventData.price?.toFixed(2)}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div 
                                    className={`payment-option p-4 border rounded cursor-pointer ${
                                        checkoutData.paymentMethod === 'card' ? 'border-primary bg-primary/10' : 'border-gray-200'
                                    }`}
                                    onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'card' } })}
                                >
                                    <CreditCard className="inline-block mr-2" />
                                    <span>Credit Card</span>
                                </div>
                                <div 
                                    className={`payment-option p-4 border rounded cursor-pointer ${
                                        checkoutData.paymentMethod === 'wallet' ? 'border-primary bg-primary/10' : 'border-gray-200'
                                    }`}
                                    onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'wallet' } })}
                                >
                                    <Wallet className="inline-block mr-2" />
                                    <span>Wallet (${user.wallet?.toFixed(2)})</span>
                                </div>
                            </div>

                            {checkoutData.paymentMethod === 'card' && (
                                <div className="mt-4 space-y-4">
                                    <Input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="Card Number"
                                        value={checkoutData.cardNumber}
                                        onChange={handleChange}
                                        maxLength="16"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
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
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">Number of Tickets</h3>
                            <Input
                                type="number"
                                name="numberOfTickets"
                                min="1"
                                value={checkoutData.numberOfTickets}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="order-summary bg-gray-50 p-4 rounded">
                            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Price per ticket:</span>
                                    <span>${eventData.price?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Number of tickets:</span>
                                    <span>{checkoutData.numberOfTickets}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                    <span>Total Amount:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading || !checkoutData.paymentMethod}
                            className="w-full"
                        >
                            {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventCheckout;