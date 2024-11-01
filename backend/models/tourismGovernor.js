import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const tourismGovernorSchema = new Schema({
    TourismGovernorName: {
        type: String,
        required: true,
    },
    TourismGovernorUsername: {
        type: String,
        required: true,
    },
    TourismGovernorPassword: {
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

    if (!tourismGovernor.isModified('TourismGovenerPassword')) return next();

    try {
        const saltRounds = 10;
        tourismGovernor.TourismGovenerPassword = await bcrypt.hash(tourismGovernor.TourismGovenerPassword, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

tourismGovernorSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.TourismGovenerPassword);
};

const TourismGovernor = mongoose.model('tourismGovernor', tourismGovernorSchema);
export default TourismGovernor;