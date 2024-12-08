import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Loading from '@/components/Loading';
import { useUser } from '@/UserContext';
import axiosInstance from '@/axiosInstance';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, setUser } = useUser();

    useEffect(() => {
        setIsLoading(true);
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('/api/tourist/orders/viewOrders');
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            setIsLoading(true);
            const response = await axiosInstance.post('/api/tourist/orders/cancelOrder', { orderId });
            if (response.status === 200) {
                const response = await axiosInstance.get('/api/tourist/orders/viewOrders');
                setOrders(response.data.orders);
                const userResponse = await axiosInstance.get('/api/auth/updateUser');
                setUser(userResponse.data.user);
            } else {
                throw new Error('Failed to cancel order');
            }
        } catch (error) {
            alert('Failed to cancel order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Upcoming Orders</h3>
                {orders.upcoming.length === 0 ?
                    <p>No upcoming orders</p> :
                    (
                        orders.upcoming.map((order, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-md mb-2">
                                <p className="font-semibold">Order ID: {order._id}</p>
                                <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                <p>Products:</p>
                                <ul className="pl-4 list-disc">
                                    {order.products.map((product, productIndex) => (
                                        <li key={productIndex}>
                                            Product ID: {product.productId}, Quantity: {product.quantity}
                                        </li>
                                    ))}
                                </ul>
                                <p>Status: {order.status}</p>
                                <p>Promo Code: {order.promoCode ? order.promoCode : 'No promo code provided'}</p>
                                <p>Discount: {order.discountAmount > 0 ? `${order.discountAmount} USD` : 'No discount applied'}</p>
                                <p>Total Price: {order.finalPrice} USD</p>
                                {order.status === 'Pending' ? (
                                    <Button 
                                        variant="destructive" 
                                        onClick={() => handleCancelOrder(order._id)}
                                    >
                                        Cancel Order
                                    </Button>
                                ) : (
                                    <p className="text-red-500 mt-2">Order can't be canceled</p>
                                )}
                            </div>
                        ))
                    )
                }
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Past Orders</h3>
                {orders.past.length === 0 ?
                    <p>No past orders</p> :
                    (
                        orders.past.map((order, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-md mb-2">
                                <p className="font-semibold">Order ID: {order._id}</p>
                                <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                <p>Products:</p>
                                <ul className="pl-4 list-disc">
                                    {order.products.map((product, productIndex) => (
                                        <li key={productIndex}>
                                            Product ID: {product.productId}, Quantity: {product.quantity}
                                        </li>
                                    ))}
                                </ul>
                                <p>Status: {order.status}</p>
                                <p>Promo Code: {order.promoCode ? order.promoCode : 'No promo code provided'}</p>
                                <p>Discount: {order.discountAmount > 0 ? `${order.discountAmount} USD` : 'No discount applied'}</p>
                                <p>Total Price: {order.finalPrice} USD</p>
                                <p className="text-red-500 mt-2">Order can't be canceled</p>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
};

export default Orders;
