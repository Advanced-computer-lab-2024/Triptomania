import touristModel from '../../models/tourist.js';
import dotenv from 'dotenv';
import productModel from '../../models/product.js';
import Stripe from 'stripe';
import orderModel from '../../models/order.js';
import promoCodeModel from '../../models/promoCode.js';
import sellerModel from '../../models/seller.js';
import adminModel from '../../models/admin.js';
import activityModel from '../../models/activity.js';
import itineraryModel from '../../models/itinerary.js';
import SibApiV3Sdk from 'sib-api-v3-sdk';

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkoutCart = async (req, res) => {
    const userId = req.user._id;

    const { paymentMethod, address, promoCode } = req.body;

    if (!paymentMethod || address < 0) {
        return res.status(400).json({ error: 'Missing required fields: userId, paymentMethod, address' });
    }

    try {
        // Fetch the user and their cart
        const user = await touristModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        let discount = 0;

        let promo = null;

        const date = new Date();
        const futureDate = new Date(date);
        futureDate.setDate(date.getDate() + 5);

        if (promoCode) {
            promo = await promoCodeModel.findOne({ code: promoCode });
            if (!promo) {
                return res.status(404).json({ error: 'Promo code not found' });
            }

            if (new Date(promo.expiryDate) < Date.now()) {
                return res.status(400).json({ error: 'Promo code has expired' });
            }

            discount = promo.discount;
        }

        if (address < 0 || address >= user.deliveryAddresses.length) {
            return res.status(400).json({ error: 'Incorrect address index' });
        }

        let message = "";

        let products = [];

        let paymentIntent;

        // Calculate the total amount
        let totalAmount = 0;
        for (const item of user.cart) {
            if (!item.productId || !item.quantity) {
                return res.status(400).json({ error: 'Invalid cart item structure. Each item must have an id and quantity.' });
            }

            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            products.push(item);

            // Calculate amount for the current product
            const tempAmount = product.Price * item.quantity;
            totalAmount += tempAmount;

            // Deduct quantity and update purchasers
            product.Quantity -= item.quantity;
            if (!product.Purchasers.includes(userId)) {
                product.Purchasers.push(userId);
            }

            product.SalesReport.push({
                price: product.Price,
                quantity: item.quantity,
                date: date
            });

            product.Sales += item.quantity;

            // Save the product
            await product.save();

            // Notify if out of stock
            if (product.Quantity === 0) {
                await notifyOutOfStock(product);
            }
        }

        let discountAmount = totalAmount * discount / 100;

        let oldTotalAmount = totalAmount;

        totalAmount -= discountAmount;

        if (paymentMethod === 'COD') {
            message = 'Cash on delivery. Cart cleared';
        } else if (paymentMethod === 'wallet') {
            if (user.wallet >= totalAmount) {
                user.wallet -= totalAmount;
                await user.save();
                message = 'Payment successful. Cart cleared';
            } else {
                return res.status(400).json({ error: 'Insufficient wallet balance' });
            }
        } else if (paymentMethod === 'card') {
            // Convert totalAmount to cents
            const amountInCents = totalAmount * 100;

            // Create a PaymentIntent with Stripe
            paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: 'usd',
                payment_method_types: ['card'],
                payment_method: 'pm_card_visa',
                confirm: true, // Automatically confirm the payment
            });

            message = 'Payment successful. Cart cleared';
        }

        const tempOrder = await orderModel.create({
            touristId: userId,
            products,
            totalPrice: oldTotalAmount,
            finalPrice: totalAmount,
            paymentMethod,
            deliveryAddress: user.deliveryAddresses[address],
            promoCode: promo ? promo.id : null,
            discountAmount: discountAmount,
            orderDate: date,
            deliveryDate: futureDate
        });

        // Clear the user's cart on successful payment
        user.cart = [];
        await user.save();

        user.orders.push(tempOrder.id);
        await user.save();


        res.status(200).json({
            success: true,
            message,
            order: tempOrder,
            ...(paymentIntent && { paymentIntent })
        });

        await sendProductInvoice(tempOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const user = await touristModel.findById(order.touristId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({ error: 'Order is already cancelled' });
        }

        if (order.status === 'Shipped') {
            return res.status(400).json({ error: 'Order is already shipped' });
        }

        if (order.status === 'Delivered') {
            return res.status(400).json({ error: 'Order is already delivered' });
        }

        for (const item of order.products) {
            if (!item.productId || !item.quantity) {
                return res.status(400).json({ error: 'Invalid product structure. Each item must have a productId and quantity.' });
            }

            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
            }

            // Revert product quantity
            product.Quantity += item.quantity;

            // Adjust sales array
            const saleEntryIndex = product.SalesReport.findIndex(sale => sale.date === order.date);

            if (saleEntryIndex !== -1) {
                // Remove the existing sale entry
                product.SalesReport.splice(saleEntryIndex, 1);
            } else {
                console.warn(`Sale entry for date ${order.date} not found in product sales.`);
            }

            product.Sales -= item.quantity;

            // Remove the user from the purchasers list if applicable
            if (product.Purchasers.includes(user.id)) {
                product.Purchasers = product.Purchasers.filter(purchaserId => purchaserId !== user.id);
            }

            // Save the updated product
            await product.save();
        }

        user.wallet += order.finalPrice;
        user.save();

        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ success: true, message: 'Order cancelled successfully' });
        await sendCancellationNotice(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

const sendProductInvoice = async (order) => {
    try {
        const user = await touristModel.findById(order.touristId);
        if (!user) {
            throw new Error('User not found');
        }

        let promo = null;

        if (order.promoCode !== null) {
            promo = await promoCodeModel.findById(order.promoCode);
        }

        let products = [];

        for (const item of order.products) {
            if (!item.productId || !item.quantity) {
                return res.status(400).json({ error: 'Invalid cart item structure. Each item must have an id and quantity.' });
            }
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            products.push({
                productName: product.Name,
                quantity: item.quantity,
                price: product.Price
            });
        }

        const sender = {
            name: 'Triptomania',
            email: 'triptomania.app@gmail.com',
        };

        const recipients = [
            { email: user.email },
            { email: 'nnnh7240@gmail.com' }
        ];

        const now = new Date(order.date);

        // Extract the day, month, and year
        const day = now.getDate(); // Day of the month (1-31)
        const month = now.getMonth() + 1; // Month (0-11, so add 1)
        const year = now.getFullYear(); // Full year

        const emailContent = {
            sender,
            to: recipients,
            templateId: 2, // Replace with your Brevo template ID
            params: {
                firstName: user.firstName,
                lastName: user.lastName,
                orderId: order.id,
                orderDate: `${day}-${month}-${year}`,
                products: products,
                totalPrice: order.totalPrice,
                promoCode: promo ? promo.code : null,
                discountAmount: order.discountAmount,
                finalTotal: order.finalPrice,
                currentYear: new Date().getFullYear()
            }
        };

        const response = await transactionalEmailApi.sendTransacEmail(emailContent);
    } catch (error) {
        throw new Error("Error sending invoice:", error);
    }
}

const sendCancellationNotice = async (order) => {
    try {
        const user = await touristModel.findById(order.touristId);
        if (!user) {
            throw new Error('User not found');
        }

        let products = [];

        for (const item of order.products) {
            if (!item.productId || !item.quantity) {
                return res.status(400).json({ error: 'Invalid cart item structure. Each item must have an id and quantity.' });
            }
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            products.push({
                productName: product.Name,
                quantity: item.quantity,
                price: product.Price
            });
        }

        const sender = {
            name: 'Triptomania',
            email: 'triptomania.app@gmail.com',
        };

        const recipients = [
            { email: user.email }
        ];

        const now = new Date(Date.now());

        // Extract the day, month, and year
        const day = now.getDate(); // Day of the month (1-31)
        const month = now.getMonth() + 1; // Month (0-11, so add 1)
        const year = now.getFullYear(); // Full year

        const emailContent = {
            sender,
            to: recipients,
            templateId: 3, // Replace with your Brevo template ID
            params: {
                firstName: user.firstName,
                lastName: user.lastName,
                orderId: order.id,
                orderDate: `${day}-${month}-${year}`,
                products: products,
                totalPrice: order.finalPrice,
                currentYear: new Date().getFullYear()
            }
        };

        const response = await transactionalEmailApi.sendTransacEmail(emailContent);
    } catch (error) {
        throw new Error("Error sending cancellation notice:", error);
    }
}

const notifyOutOfStock = async (product) => {
    try {
        // Fetch the seller and check if user exists
        const seller = await sellerModel.findById(product.Seller);
        if (!seller) {
            throw new Error('Seller not found');
        }

        // Fetch all admins and get their emails
        const admins = await adminModel.find({});
        const adminEmails = admins.map(admin => admin.email);

        // Add the seller's email to recipients
        const recipients = [
            { email: seller.email }, // Assuming the seller has an email field
            ...adminEmails.map(email => ({ email })) // Add all admin emails
        ];

        // Prepare the email content
        const sender = {
            name: 'Triptomania',
            email: 'triptomania.app@gmail.com',
        };

        const emailContent = {
            sender,
            to: recipients,
            templateId: 4, // Replace with your Brevo template ID
            params: {
                productName: product.Name,
                productId: product.id,
                price: product.Price,
                currentYear: new Date().getFullYear()
            }
        };

        // Send the email using Brevo transactional API
        const response = await transactionalEmailApi.sendTransacEmail(emailContent);
    } catch (error) {
        throw new Error("Error sending out-of-stock email:", error);
    }
};

const payForEvent = async (req, res) => {
    try {
        const userId = req.user._id;

        const { paymentMethod, eventType, eventId, promoCode } = req.body;
     
        if (!paymentMethod || !eventType || !eventId) {
            return res.status(400).json({ error: 'Missing required fields: userId, paymentMethod, eventType, eventId' });
        }

        const user = await touristModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const models = {
            activity: activityModel,
            itinerary: itineraryModel
        }
        
        const eventModel = models[eventType];
        
        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if the user has already booked this event
        if (!event.bookingMade.includes(userId)) {
            return res.status(400).json({ error: 'You have not booked this event ' });
        }

        let discount = 0;

        let promo = null;

        if (promoCode) {
            promo = await promoCodeModel.findOne({ code: promoCode });
            if (!promo) {
                return res.status(404).json({ error: 'Promo code not found' });
            }

            if (new Date(promo.expiryDate) < Date.now()) {
                return res.status(400).json({ error: 'Promo code has expired' });
            }

            discount = promo.discount;
        }
        const date = new Date();
        let message = "";
        let paymentIntent;
        let originalAmount = event.price;
        let discountAmount = originalAmount * discount / 100;
        let totalAmount = originalAmount - discountAmount;

        if (paymentMethod === 'wallet') {
            if (user.wallet >= totalAmount) {
                user.wallet -= totalAmount;
                await user.save();
                message = 'Payment successful. Event booked.';
            } else {
                return res.status(400).json({ error: 'Insufficient wallet balance' });
            }
        } else if (paymentMethod === 'card') {
            // Convert totalAmount to cents
            const amountInCents = totalAmount * 100;

            // Create a PaymentIntent with Stripe
            paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: 'usd',
                payment_method_types: ['card'],
                payment_method: 'pm_card_visa',
                confirm: true, // Automatically confirm the payment
            });

            message = 'Payment successful. Event booked.';
        }


        // Add a new sale entry if no match is found
        event.SalesReport.push({
            price: event.Price,
            quantity: 1,
            date: date
        });

        let eventMap;
        if (eventType === 'activity') {
            user.activities = user.activities.filter(activity => 
                activity.eventId.toString() !== eventId.toString()
            );
            eventMap = {
                name: event.name,
                eventType: eventType,
                eventId: eventId,
                originalPrice: originalAmount,
                discountAmount: discountAmount,
                finalPrice: totalAmount,
                promoCode: promo ? promo.code : null,
                date: event.date,
                paymentDate: date,
                status:'Paid'
            }
            user.activities.push(eventMap);
            await user.save();
        } else if (eventType === 'itinerary') {
            user.itineraries = user.itineraries.filter(itinerary => 
                itinerary.eventId.toString() !== eventId.toString()
            );
            eventMap = {
                name: event.Name,
                eventType: eventType,
                eventId: eventId,
                originalPrice: originalAmount,
                discountAmount: discountAmount,
                finalPrice: totalAmount,
                promoCode: promo ? promo.code : null,
                date: event.Start_date,
                paymentDate: date,
                status:'Paid'
            }

            user.itineraries.push(eventMap);
            await user.save();
        }

       

        res.status(200).json({
            success: true,
            message,
            event: eventMap,
            ...(paymentIntent && { paymentIntent })
        });

        await sendEventInvoice(eventMap, userId, eventType);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

const sendEventInvoice = async (event, userId, type) => {
    try {
        const user = await touristModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        let promo = null;

        if (event.promoCode !== null) {
            promo = await promoCodeModel.findById(event.promoCode);
        }

        const sender = {
            name: 'Triptomania',
            email: 'triptomania.app@gmail.com',
        };

        const recipients = [
            { email: user.email },
            { email: 'nnnh7240@gmail.com' }
        ];

        const now = new Date(event.date);

        // Extract the day, month, and year
        const day = now.getDate(); // Day of the month (1-31)
        const month = now.getMonth() + 1; // Month (0-11, so add 1)
        const year = now.getFullYear(); // Full year

        const emailContent = {
            sender,
            to: recipients,
            templateId: 6, // Replace with your Brevo template ID
            params: {
                firstName: user.firstName,
                lastName: user.lastName,
                eventName: event.name,
                bookingType: type,
                bookingDate: `${day}-${month}-${year}`,
                currency: 'USD',
                originalPrice: event.originalPrice,
                promoCode: promo ? promo.code : null,
                discountAmount: event.discountAmount,
                finalPrice: event.finalPrice,
                currentYear: new Date().getFullYear()
            }
        };

        const response = await transactionalEmailApi.sendTransacEmail(emailContent);
    } catch (error) {
        throw new Error("Error sending invoice:", error);
    }
}

const cancelEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const { eventType, eventId } = req.body;

        const user = await touristModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const models = {
            activity: activityModel,
            itinerary: itineraryModel
        }

        const eventModel = models[eventType];

        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if the user has already booked this event
        if (!event.bookingMade.includes(userId)) {
            return res.status(400).json({ error: 'You didn\'t book this event to cancel it' });
        }

        let refundAmount = 0;
        let eventMap = null;

        if (eventType === 'activity') {
            const activityIndex = user.activities.findIndex(a => a.eventId === eventId);

            if (activityIndex === -1) {
                return res.status(400).json({ error: 'This activity is not in your bookings' });
            }

            // Get the activity object before removing it
            eventMap = user.activities[activityIndex];

            refundAmount = eventMap.finalPrice;

            // Remove the activity from user's activities
            user.activities.splice(activityIndex, 1);
        } else if (eventType === 'itinerary') {
            const itineraryIndex = user.itineraries.findIndex(i => i.eventId === eventId);

            if (itineraryIndex === -1) {
                return res.status(400).json({ error: 'This itinerary is not in your bookings' });
            }

            // Get the itinerary object before removing it
            eventMap = user.itineraries[itineraryIndex];

            refundAmount = eventMap.finalPrice;

            // Remove the itinerary from user's itineraries
            user.itineraries.splice(itineraryIndex, 1);
        }

        // Adjust sales array
        const saleEntryIndex = event.SalesReport.findIndex(sale => sale.date === event.paymentDate);

        if (saleEntryIndex !== -1) {
            // Remove the existing sale entry
            event.SalesReport.splice(saleEntryIndex, 1);
        } else {
            console.warn(`Sale entry for date ${event.paymentDate} not found in event sales.`);
        }

        // Remove the user from event.bookingMade
        event.bookingMade = event.bookingMade.filter(id => id.toString() !== userId.toString());

        // Save the changes to the user and event
        user.wallet += refundAmount;
        await user.save();
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Event booking canceled successfully',
            eventDetails: eventMap, // Return the removed object
            refundAmount
        });

        await sendEventCancellation(eventMap, userId, eventType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const sendEventCancellation = async (event, userId, type) => {
    try {
        const user = await touristModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const sender = {
            name: 'Triptomania',
            email: 'triptomania.app@gmail.com',
        };

        const recipients = [
            { email: user.email },
            { email: 'nnnh7240@gmail.com' }
        ];

        const now = new Date(event.date);

        // Extract the day, month, and year
        const day = now.getDate(); // Day of the month (1-31)
        const month = now.getMonth() + 1; // Month (0-11, so add 1)
        const year = now.getFullYear(); // Full year

        const emailContent = {
            sender,
            to: recipients,
            templateId: 7, // Replace with your Brevo template ID
            params: {
                firstName: user.firstName,
                lastName: user.lastName,
                eventType: type,
                eventName: event.name,
                bookingType: type,
                bookingDate: `${day}-${month}-${year}`,
                currency: 'USD',
                originalPrice: event.originalPrice,
                refundedAmount: event.finalPrice,
                currentYear: new Date().getFullYear()
            }
        };

        const response = await transactionalEmailApi.sendTransacEmail(emailContent);
    } catch (error) {
        throw new Error("Error sending invoice:", error);
    }
}

export default {
    checkoutCart,
    cancelOrder,
    payForEvent,
    cancelEvent
}