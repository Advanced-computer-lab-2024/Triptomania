import touristModel from '../../models/tourist.js';
import dotenv from 'dotenv';
import productModel from '../../models/product.js';
import Stripe from 'stripe';
import orderModel from '../../models/order.js';
import promoCodeModel from '../../models/promoCode.js';
import sellerModel from '../../models/seller.js';
import adminModel from '../../models/admin.js';
import SibApiV3Sdk from 'sib-api-v3-sdk';

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkoutCart = async (req, res) => {
    const { userId, paymentMethod, address, promoCode } = req.body;

    if (!userId || !paymentMethod || address < 0) {
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
            let tempAmount = 0;
            tempAmount = product.Price * item.quantity;
            totalAmount += tempAmount;
            product.Quantity -= item.quantity;
            product.Purchasers.push(userId);
            product.Sales += tempAmount;
            if (product.quantity === 0) {
                await notifyOutOfStock(product).catch((error) => {
                    console.error('Error sending out-of-stock email:', error);
                });
            }
            await product.save();
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
            discountAmount: discountAmount
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

        await sendInvoice(tempOrder).catch((error) => {
            console.error('Error sending invoice:', error);
        });
    } catch (error) {
        console.error('Error processing payment:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

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
                return res.status(400).json({ error: 'Invalid cart item structure. Each item must have an id and quantity.' });
            }
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            product.Quantity += item.quantity;
            product.Sales -= item.quantity * product.Price;
            product.Purchasers.pull(user.id);
            product.save();
        }

        user.wallet += order.price;
        user.save();

        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ success: true, message: 'Order cancelled successfully' });
        await sendCancellationNotice(order).catch((error) => {
            console.error(error);
        });
    } catch (error) {
        console.error('Error cancelling order:', error.message);
        res.status(500).json({ error: error.message });
    }

}

const sendInvoice = async (order) => {
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

        const now = new Date(Date.now());

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
        console.log(response);
    } catch (error) {
        console.error(error);
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
        console.log(response);
    } catch (error) {
        console.error(error);
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

        const now = new Date(Date.now());

        // Extract the day, month, and year
        const day = now.getDate(); // Day of the month (1-31)
        const month = now.getMonth() + 1; // Month (0-11, so add 1)
        const year = now.getFullYear(); // Full year

        const emailContent = {
            sender,
            to: recipients,
            templateId: 4, // Replace with your Brevo template ID
            params: {
                firstName: seller.firstName, // Assuming seller has firstName
                lastName: seller.lastName, // Assuming seller has lastName
                productName: product.Name,
                productId: product.id,
                price: product.Price,
                currentYear: new Date().getFullYear()
            }
        };

        // Send the email using Brevo transactional API
        const response = await transactionalEmailApi.sendTransacEmail(emailContent);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};

export default {
    checkoutCart,
    cancelOrder
}