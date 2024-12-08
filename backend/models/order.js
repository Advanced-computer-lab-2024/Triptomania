import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    touristId: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    },
    products: [
        Object
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: Object,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        default: null
    },
    promoCode: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;