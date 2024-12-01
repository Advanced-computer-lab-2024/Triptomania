import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    previousWork: { type: String, required: true },
    comments: { type: [String], default: [] },
    type: { type: String, default: 'tourGuide' },
    tourists: [{ type: mongoose.Types.ObjectId, ref: 'Tourist' }],
    ratings: [
      {
        touristId: { type: mongoose.Types.ObjectId, ref: 'Tourist', required: true },
        rating: { type: Number, min: 0, max: 5, required: true }
      }
    ],
    averageRating: { type: Number, default: 0 },
    documents: {type: String, required: false, default: 'none'},
    status :{type: String, enum: ['accepted' , 'rejected', 'pending'] , required:false , default: 'pending' }, 
    acceptedTerms: { type: Boolean, default: false },
    profilePicture: {type: String, required: false, default: 'none'},
    deleteAccount:{
      type: Boolean,
      default: false
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiration: {
        type: Date,
    },
    fcmToken: {
        type: String
    }
},{timestamps:true});

UserSchema.pre('save', async function (next) {
    const tourguide = this;

    if (!tourguide.isModified('password')) return next();

    try {
        const saltRounds = 10;
        tourguide.password = await bcrypt.hash(tourguide.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (update.password) {
        try {
            const saltRounds = 10;
            update.password = await bcrypt.hash(update.password, saltRounds);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const tourguide = mongoose.model('TourGuide', UserSchema);
export default tourguide;
