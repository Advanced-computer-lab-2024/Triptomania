import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;