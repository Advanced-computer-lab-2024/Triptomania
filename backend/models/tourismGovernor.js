import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const tourismGovernorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'tourismGovernor'  // Default value for the type field
    }
});

tourismGovernorSchema.pre('save', async function (next) {
    const tourismGovernor = this;

    if (!tourismGovernor.isModified('password')) return next();

    try {
        const saltRounds = 10;
        tourismGovernor.password = await bcrypt.hash(tourismGovernor.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

tourismGovernorSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const TourismGovernor = mongoose.model('tourismGovernor', tourismGovernorSchema);
export default TourismGovernor;