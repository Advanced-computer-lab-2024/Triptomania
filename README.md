# Triptomania

## Description
This project is a travel platform designed to simplify the process of planning and booking vacations. It provides users with tools to organize their trips efficiently while offering features to enhance the travel experience. The platform caters to a variety of travel preferences, including historic sites, beaches, shopping, and budget-friendly options.

This platform is intended to streamline the travel planning process, providing users with a centralized solution for managing their trips from start to finish.

Key Features
- Easy trip planning and itinerary management.
- Integration with local attractions and businesses.
- Budget-friendly options and in-app shopping.
- Real-time notifications and updates.


---

## Motivation
The primary motivation behind this project is to simplify and enhance the travel planning experience by addressing common challenges faced by travelers. Many existing platforms require users to juggle multiple apps or websites for booking, budgeting, and discovering activities. This project aims to create a centralized solution that integrates these functionalities into a single platform.

Key motivating factors include:
- *Convenience*: Streamlining the planning process to save time and reduce complexity.
- *Accessibility*: Ensuring users have all essential tools and information in one place.
- *Personalization*: Catering to individual preferences for a more tailored travel experience.
- *Local Engagement*: Promoting local attractions and businesses to create meaningful connections between travelers and destinations.
- *Innovation*: Offering unique features like integrated budgeting and in-app shopping to differentiate from existing solutions.

Ultimately, this project aspires to make travel more accessible, enjoyable, and memorable for users, regardless of their destination or budget.

---

## Build Status
Build status details to be added.

---
## Code Style

The project follows a modern and clean React.js code style, emphasizing maintainability, readability, and scalability. Below are the key conventions:

### General Practices
- **Functional Components**: All components are implemented using functional components and React hooks (`useState`, `useNavigate`) for modern state management and routing.
- **JSX Syntax**: Components use JSX for a declarative UI structure, ensuring clarity in rendering logic.
- **Error Handling**: Client-side and server-side errors are managed with `try-catch` blocks, and meaningful error messages are displayed to users.

### State Management
- **Centralized State Updates**: A single state object is used to manage related form data, minimizing redundant code.
- **Dynamic State Handling**: Form inputs are dynamically updated using a universal `handleChange` method, which maps input `name` attributes to corresponding state fields.

### API Integration
- **Axios Instance**: API calls are handled using a reusable `axiosInstance` that simplifies configuration of base URLs, headers, and interceptors.
- **Error Feedback**: Server-side errors are captured and communicated to users with context-sensitive messages.

### Form Handling
- **Dynamic Input Management**: Input values are bound to state dynamically, ensuring simplicity in handling multiple fields.
- **Validation**: Basic validations are performed using HTML attributes like `required`, with additional error messages displayed for more complex validation scenarios.

### Styling
- **CSS Modules**: Each component has its own CSS file (e.g., `AdvertiserSignUp.css`) for scoped, modular styles.
- **Semantic Class Names**: Class names like `error-message` and `success-message` improve readability and convey intent clearly.

### Accessibility
- **Screen Reader Compatibility**: Error messages and success notifications are marked with roles (e.g., `role="alert"`) for better accessibility.
- **Keyboard Navigation**: Form inputs and buttons are designed to be fully accessible via keyboard navigation.

### Example Code Style
Below is an example of the coding style used in this project:

```jsx
import React, { useState } from 'react';
import axiosInstance from '@/axiosInstance.js';
import './AdvertiserSignUp.css';
import { useNavigate } from 'react-router-dom';

const AdvertiserSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await axiosInstance.post('/api/advertiser/addAdvertiser', formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during sign-up.');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName || ''}
          onChange={handleChange}
          required
          placeholder="Enter your first name"
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      {success && <p className="success-message">Sign-up successful!</p>}
    </div>
  );
};

export default AdvertiserSignUp;

/* Responsive Design */
@media (max-width: 640px) {
    .add-product-container {
        padding: 1.5rem;
        margin: 1rem;
    }
}
---


##Screenshots
![Home Page Screenshot](frontend/src/assets/images/shot1.png)
![Account Page Screenshot](frontend/src/assets/images/shot2.png)
![Flight Finder Page Screenshot](frontend/src/assets/images/shot3.png)
![Itineraries Page Screenshot](frontend/src/assets/images/shot4.png)

---
## Framework Used
- *Programming Languages*: HTML, CSS, JavaScript
- *Frameworks*:
  - *MongoDB*: NoSQL database for flexible data storage.
  - *Express*: Web application framework for building APIs.
  - *React*: Library for building the user interface.
  - *Node.js*: JavaScript runtime for server-side code.
  - *Vite*: Front-end build tool for optimized development.

---
## Features
1. *Customizable Travel Planning*
   - Personalize your travel experience by specifying preferences such as destinations, activities, and itineraries. The platform tailors recommendations to match your interests.
2. *Integrated Booking System*
   - Book flights, accommodations, and transportation directly through reliable third-party providers without leaving the platform.
3. *Budget Management*
   - Receive activity and destination suggestions that align with your remaining budget. All costs, including transportation, are factored in for easy planning.
4. *Activity Discovery*
   - Access a curated selection of local attractions, museums, and historical landmarks with detailed information.
5. *Notifications and Reminders*
   - Stay updated with real-time notifications about bookings, activities, and travel events.
6. *Itinerary Creation*
   - Create detailed custom itineraries or opt for expert-guided tours.
7. *User Profile Management*
   - Tourists, tour guides, advertisers, and sellers can create and manage profiles, including uploading required documents and updating personal information.
8. *In-App Gift Shop*
   - Browse and purchase souvenirs directly through the platform.
9. *Tour Guide and Seller Tools*
   - Manage tours, itineraries, and product listings in the integrated store.
10. *Advanced Search and Filtering*
    - Find activities, tours, or destinations based on your preferences.
---


##Code Examples

```jsx

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const addAdmin = async (req, res) => {
    const { adminName, adminUsername, adminPassword } = req.body;

    if (!adminName || !adminUsername || !adminPassword) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const admin = new adminModel({
            name: adminName,
            username: adminUsername,
            password: adminPassword
        });

        await admin.save();

        res.status(201).json({ message: "Admin added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

const addTourismGovernor = async (req, res) => {
    const { tourismGovernorName, tourismGovernorUsername, tourismGovernorPassword, email } = req.body;

    // Validate required fields
    if (!tourismGovernorName || !tourismGovernorUsername || !tourismGovernorPassword) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Create a new instance of the tourism governor model
        const tourismGovernor = new tourismGovernorModel({
            name: tourismGovernorName,
            username: tourismGovernorUsername,
            password: tourismGovernorPassword,
            email
        });

        // Save the new tourism governor to the database
        await tourismGovernor.save();

        // Respond with a success message
        res.status(201).json({ message: "Tourism Governor added successfully" });
    } catch (error) {
        console.error("Error saving tourism governor:", error); // Log the error for debugging
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Function to flag an itinerary

const flagItinerary = async (req, res) => {
    const { id } = req.body; // Extracting itineraryId from query parameters

    try {
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid itinerary ID format." });
        }

        // Find the itinerary by ID
        const itinerary = await ItineraryModel.findById(id);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found." });
        }

        let isFlagged = itinerary.isFlagged;

        // Preserve the creatorId and save the itinerary
        await ItineraryModel.findByIdAndUpdate(id, { isFlagged: !isFlagged }, { new: true });

        await sendEmail(itinerary); // Send an email to the tour guide

        return res.status(200).json({ message: `Itinerary ${isFlagged ? 'unflagged' : 'flagged'} successfully.` });
    } catch (error) {
        console.error("Error toggling itinerary flag:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}



const deleteAccount = async (req, res) => {
    try {
        const { id, type } = req.body;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format." });
        }

        let deletedAccount;

        // Depending on the type, delete the appropriate account
        switch (type) {
            case "tourist":
                if (!await checkValidity(id)) {
                    return res.status(400).json({ message: "Tourist has active bookings or itineraries" });
                }
                deletedAccount = await touristModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "tourGuide":
                deletedAccount = await tourGuideModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "seller":
                deletedAccount = await sellerModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "advertiser":
                deletedAccount = await advertiserModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "tourismGovernor":
                deletedAccount = await tourismGovernorModel.findByIdAndDelete(id); // Add await and capture result
                break;
            case "admin":
                deletedAccount = await adminModel.findByIdAndDelete(id); // Add await and capture result
                break;
            default:
                return res.status(400).json({ message: "Invalid type" }); // Return after sending response
        }

        // Check if the account was found and deleted
        if (!deletedAccount) {
            return res.status(404).json({ message: "Account not found or already deleted" });
        }

        // If the account was deleted successfully
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        // In case of any errors during the process
        res.status(500).json({ message: "Something went wrong" });
    }
}
const checkValidity = async (touristId) => {
    // Check if the tourist has any hotel or flight bookings
    const tourist = await touristModel.findById(touristId); // Use touristModel here
    if (!tourist) {
        throw new Error("Tourist not found");
    }

    // Check if there are any hotel or flight bookings
    if (tourist.hotelBookings.length > 0 || tourist.flightBookings.length > 0 || tourist.transportationBookings.length > 0) {
        return false; // Return false if there are any bookings
    }

    

const getDeleteUsers = async (req, res) => {
    try {
        const deletedTourists = await touristModel.find({ deleteAccount: true });
        console.log('Deleted Tourists:', deletedTourists); // Log the result

        const deletedTourGuides = await tourGuideModel.find({ deleteAccount: true });
        console.log('Deleted Tour Guides:', deletedTourGuides); // Log the result

        const deletedAdvertisers = await advertiserModel.find({ deleteAccount: true });
        console.log('Deleted Advertisers:', deletedAdvertisers); // Log the result

        const deletedSellers = await sellerModel.find({ deleteAccount: true });
        console.log('Deleted Sellers:', deletedSellers); // Log the result

        const deletedUsers = [
            ...deletedTourists,
            ...deletedTourGuides,
            ...deletedAdvertisers,
            ...deletedSellers
        ];

        // Check if deletedUsers is empty
        if (deletedUsers.length === 0) {
            console.log("No deleted users found.");
        }

        // Check validity for tourists only
        const usersResponse = await Promise.all(deletedUsers.map(async (user) => {
            const userObj = user.toObject(); // Convert Mongoose document to plain object
            if (user.type === 'tourist') {
                try {
                    const isValid = await checkValidity(user._id);
                    return {
                        ...userObj,
                        canDelete: isValid // Add a flag to indicate if the user can be deleted
                    };
                } catch (validityError) {
                    console.error("Error checking validity for user:", user._id, validityError);
                    return {
                        ...userObj,
                        canDelete: false // Default to false if there's an error
                    };
                }
            }
            return {
                ...userObj,
                canDelete: true // Non-tourist users can always be deleted
            };
        }));

        res.status(200).json(usersResponse);
    } catch (error) {
        console.error("Error retrieving deleted users:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

const createPromoCode = async (req, res) => {
    const { code, discount, expiryDate } = req.body;

    if (!code || !discount || !expiryDate) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const promoCode = new promoCodeModel({
            code,
            discount,
            expiryDate
        });

        await promoCode.save();

        res.status(201).json({ message: "Promo code created successfully" });
    } catch (error) {
        console.error("Error creating promo code:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const sendEmail = async (itinerary) => {
    try {
        // Fetch the seller and check if user exists
        const tourGuide = await tourGuideModel.findById(itinerary.creatorId);
        if (!tourGuide) {
            throw new Error('Tour guide not found');
        }

        // Add the seller's email to recipients
        const recipients = [
            { email: tourGuide.email },
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
            templateId: 5, // Replace with your Brevo template ID
            params: {
                itineraryTitle: itinerary.Name,
                itineraryDate: `${day}-${month}-${year}`,
                itineraryId: itinerary.id,
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
```

```jsx


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
                await notifyOutOfStock(product).catch((error) => {
                    console.error('Error sending out-of-stock email:', error);
                });
            }
        }

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

        await sendProductInvoice(tempOrder).catch((error) => {
            console.error('Error sending invoice:', error);
        });
    } catch (error) {
        console.error('Error processing payment:', error.message);
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
        await sendCancellationNotice(order).catch((error) => {
            console.error(error);
        });
    } catch (error) {
        console.error('Error cancelling order:', error.message);
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
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};


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

        await sendEventCancellation(eventMap, userId, eventType).catch((error) => {
            console.error('Error sending invoice:', error);
        });
    } catch (error) {
        console.error('Error unbooking event:', error.message);
        res.status(500).json({ error: error.message });
    }
};

```


---


##Installations

# npm
# vite
# CORS
---

## API References

## Admin Endpoints
- **View Products**: [http://localhost:5000/api/Admin/Products/ViewProducts](http://localhost:5000/api/Admin/Products/ViewProducts)
- **Admin Home Page**: [http://localhost:5000/api/Admin/AdminHomePage](http://localhost:5000/api/Admin/AdminHomePage)
- **Documents Viewer**: [http://localhost:5000/api/Admin/Documentsviewer/DocumentsViewer.jsx](http://localhost:5000/api/Admin/Documentsviewer/DocumentsViewer.jsx)
- **Generate PDFs**: [http://localhost:5000/api/Admin/GeneratePdfs/GeneratePdfs.jsx](http://localhost:5000/api/Admin/GeneratePdfs/GeneratePdfs.jsx)
- **Complaints List**: [http://localhost:5000/api/Admin/Complaints/Complaints](http://localhost:5000/api/Admin/Complaints/Complaints)
- **Specific Complaint**: [http://localhost:5000/api/Admin/Complaints/Complaint](http://localhost:5000/api/Admin/Complaints/Complaint)
- **Sales Report Viewer**: [http://localhost:5000/api/Admin/SalesReportViewer/SalesReportViewer](http://localhost:5000/api/Admin/SalesReportViewer/SalesReportViewer)
- **Delete Users**: [http://localhost:5000/api/Admin/DeleteUsers/DeleteUsers](http://localhost:5000/api/Admin/DeleteUsers/DeleteUsers)
- **Activity Categories**: [http://localhost:5000/api/Admin/ActivityCategories/ActivityCategories](http://localhost:5000/api/Admin/ActivityCategories/ActivityCategories)
- **Preference Tags**: [http://localhost:5000/api/Admin/PreferenceTags/PreferenceTags](http://localhost:5000/api/Admin/PreferenceTags/PreferenceTags)
- **Promo Code Management**: [http://localhost:5000/api/Admin/Promocode/Promocode](http://localhost:5000/api/Admin/Promocode/Promocode)
- **Account Creation**: [http://localhost:5000/api/Admin/AccountCreation/AccountCreation](http://localhost:5000/api/Admin/AccountCreation/AccountCreation)
- **View Activities**: [http://localhost:5000/api/Admin/ViewActivities/ViewActivities](http://localhost:5000/api/Admin/ViewActivities/ViewActivities)
- **View Itineraries**: [http://localhost:5000/api/Admin/ViewItineraries/ViewItineraries](http://localhost:5000/api/Admin/ViewItineraries/ViewItineraries)

## Advertiser Endpoints
- **Home Page**: [http://localhost:5000/api/Advertiser/AdvertiserHomePage](http://localhost:5000/api/Advertiser/AdvertiserHomePage)
- **View My Activities**: [http://localhost:5000/api/Advertiser/Activities/ViewMyActivities](http://localhost:5000/api/Advertiser/Activities/ViewMyActivities)

## Seller Endpoints
- **View Products**: [http://localhost:5000/api/Seller/Product/ViewProducts](http://localhost:5000/api/Seller/Product/ViewProducts)
- **View My Products**: [http://localhost:5000/api/Seller/Product/ViewMyProducts](http://localhost:5000/api/Seller/Product/ViewMyProducts)
- **Home Page**: [http://localhost:5000/api/Seller/SellerHomePage.jsx](http://localhost:5000/api/Seller/SellerHomePage.jsx)
- **Add Product**: [http://localhost:5000/api/Seller/Product/AddProduct](http://localhost:5000/api/Seller/Product/AddProduct)
- **Edit Product**: [http://localhost:5000/api/Seller/Product/editMyProducts](http://localhost:5000/api/Seller/Product/editMyProducts)
- **Upload Product Picture**: [http://localhost:5000/api/Seller/Product/UploadProductPicture](http://localhost:5000/api/Seller/Product/UploadProductPicture)

## Tourism Governor Endpoints
- **Home Page**: [http://localhost:5000/api/TourismGovernor/TourismGovernorHomePage](http://localhost:5000/api/TourismGovernor/TourismGovernorHomePage)
- **Add Historical Places**: [http://localhost:5000/api/TourismGovernor/HistoricalPlaces/AddHistoricalPlaces](http://localhost:5000/api/TourismGovernor/HistoricalPlaces/AddHistoricalPlaces)
- **Upload Historical Picture**: [http://localhost:5000/api/TourismGovernor/HistoricalPlaces/UploadHistoricalPicture](http://localhost:5000/api/TourismGovernor/HistoricalPlaces/UploadHistoricalPicture)
- **View Tag**: [http://localhost:5000/api/TourismGovernor/Tags/ViewTag](http://localhost:5000/api/TourismGovernor/Tags/ViewTag)

## Tour Guide Endpoints
- **Home Page**: [http://localhost:5000/api/TourGuide/TourGuideHomePage](http://localhost:5000/api/TourGuide/TourGuideHomePage)
- **Add Itinerary**: [http://localhost:5000/api/TourGuide/Itineraries/AddItineraries](http://localhost:5000/api/TourGuide/Itineraries/AddItineraries)
- **View All Itineraries**: [http://localhost:5000/api/TourGuide/TourGuideAllItirenaries.jsx](http://localhost:5000/api/TourGuide/TourGuideAllItirenaries.jsx)
- **View My Itineraries**: [http://localhost:5000/api/TourGuide/Itineraries/ViewMytineraries](http://localhost:5000/api/TourGuide/Itineraries/ViewMytineraries)
- **Edit Itinerary**: [http://localhost:5000/api/TourGuide/Itineraries/editMyItinerary](http://localhost:5000/api/TourGuide/Itineraries/editMyItinerary)
- **Upload Documents**: [http://localhost:5000/api/TourGuide/SignUp/uploadDocuments](http://localhost:5000/api/TourGuide/SignUp/uploadDocuments)

## Tourist Endpoints
- **Home Screen**: [http://localhost:5000/api/Tourist/TouristHomeScreen](http://localhost:5000/api/Tourist/TouristHomeScreen)
- **Get Hotels**: [http://localhost:5000/api/Tourist/HotelBooking/GetHotels](http://localhost:5000/api/Tourist/HotelBooking/GetHotels)
- **File Complaint**: [http://localhost:5000/api/Tourist/Complaints/FileComplaint](http://localhost:5000/api/Tourist/Complaints/FileComplaint)
- **View Products**: [http://localhost:5000/api/Tourist/Products/ViewProducts](http://localhost:5000/api/Tourist/Products/ViewProducts)
- **Get Hotel Offers**: [http://localhost:5000/api/Tourist/HotelBooking/GetHotelOffers](http://localhost:5000/api/Tourist/HotelBooking/GetHotelOffers)
- **Book Hotel**: [http://localhost:5000/api/Tourist/HotelBooking/BookHotel](http://localhost:5000/api/Tourist/HotelBooking/BookHotel)
- **Search Flights**: [http://localhost:5000/api/Tourist/FlightBooking/searchFlights](http://localhost:5000/api/Tourist/FlightBooking/searchFlights)
- **Flight Information**: [http://localhost:5000/api/Tourist/FlightBooking/FlightInfo](http://localhost:5000/api/Tourist/FlightBooking/FlightInfo)
- **Account Management**: [http://localhost:5000/api/Tourist/Account/pages/AccountManagement](http://localhost:5000/api/Tourist/Account/pages/AccountManagement)
- **Product Details**: [http://localhost:5000/api/Tourist/Products/ProductDetails](http://localhost:5000/api/Tourist/Products/ProductDetails)
- **Tourist Cart**: [http://localhost:5000/api/Tourist/TouristCart/TouristCart](http://localhost:5000/api/Tourist/TouristCart/TouristCart)
- **View My Complaints**: [http://localhost:5000/api/Tourist/Complaints/viewMyComplaints](http://localhost:5000/api/Tourist/Complaints/viewMyComplaints)
- **Flight Booking**: [http://localhost:5000/api/Tourist/FlightBooking/FlightBooking](http://localhost:5000/api/Tourist/FlightBooking/FlightBooking)

## Guest Endpoints
- **View Activities**: [http://localhost:5000/api/Guest/Activities/ViewActivities](http://localhost:5000/api/Guest/Activities/ViewActivities)
- **View Itineraries**: [http://localhost:5000/api/Guest/Itineraries/ViewItineraries](http://localhost:5000/api/Guest/Itineraries/ViewItineraries)
- **View Itinerary Details**: [http://localhost:5000/api/Guest/Details/ViewItineraryDetails](http://localhost:5000/api/Guest/Details/ViewItineraryDetails)
- **Activity Details**: [http://localhost:5000/api/Guest/Details/ActivityDetails](http://localhost:5000/api/Guest/Details/ActivityDetails)
- **Historical Places Details**: [http://localhost:5000/api/Guest/Details/HistoricalPlacesDetails](http://localhost:5000/api/Guest/Details/HistoricalPlacesDetails)
- **View Historical Places**: [http://localhost:5000/api/Guest/HistoicalPlaces/viewHistoricalPlaces](http://localhost:5000/api/Guest/HistoicalPlaces/viewHistoricalPlaces)


---

## Tests
Testing details to be added.

// POST /api/login
POST http://localhost:5000/api/auth/login
Body:
{
    "username": "sprint2",

    "password": "password",

    "type": "tourist"
}

Expected Response:
Status: 200 OK
Body:
{
  "message": "Login successful"
}
---


##How to Use

---
# Setup and Installation

Follow these steps to set up the project on your local machine.

## 1. Clone the Repository
Clone the repository to your local machine by running the following command:
git clone https://github.com/yourusername/projectname.git

## 2. Install Dependencies
Navigate into the project directory and install the required dependencies:
npm install

## 3. Run the Development Server
Start the development server to run the application locally:
npm run dev

You should now be able to access the application in your browser.

Enjoy coding!
---
# Contributing


We appreciate your interest in contributing to this project! Follow the steps below to submit a pull request and contribute effectively.

## How to Submit a Pull Request

1. *Fork the Repository*  
   Click the "Fork" button at the top-right corner of the repository page on GitHub to create a copy of the repository under your GitHub account.

2. *Clone the Forked Repository*  
   Clone your forked repository to your local machine.

3. *Create a New Branch*  
   Create a new branch in your forked repository to isolate your changes.

4. *Make Your Changes*  
   Implement your changes or features, then stage and commit them.

5. *Push Changes to Your Forked Repository*  
   Push the committed changes to the corresponding branch in your forked repository.

6. *Open a Pull Request*  
   Navigate to the original repository (upstream) on GitHub and submit your changes:  
   - Go to the "Pull Requests" tab and click "New Pull Request."  
   - In the "Compare Changes" section, choose your fork and the branch you created.  
   - Add a clear title and description of your pull request, explaining the changes you made.  
   - Click "Create Pull Request" to submit.

## Review and Approval

Once your pull request is submitted:
- It will be reviewed by the maintainers.
- You may be asked to make additional changes.
- After approval, your changes will be merged into the main branch.

Thank you for contributing to the project!



---
# Credits

Special thanks to the following resources for providing guidance and inspiration:

- [Video Tutorial 1](https://youtu.be/O3BUHwfHf84?si=oLRTM62t_ybKc_DJ)  
- [Video Tutorial 2](https://youtu.be/7Q17ubqLfaM?si=PyJ47vfE8PEwLngG)  
- [Video Tutorial 3](https://youtu.be/mbsmsi7l3r4?si=-qnp93gqJgm7wYYM)  

---

# License

 Apache License
        Version 2.0, January 2004
       http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
