import mongoose from "mongoose";
const Schema = mongoose.Schema;

const activityCategorySchema = new Schema({
    CategoryName: {
        type: String,
        required: true,
    },
    CategoryDescription: {
        type: String,
        required: true,
    }
});

const ActivityCategory = mongoose.model('activityCategory', activityCategorySchema);
export default ActivityCategory;