import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const tourismGovernerSchema = new Schema({
    TourismGovernerName: {
        type: String,
        required: true,
    },
    TourismGovernerUsername: {
        type: String,
        required: true,
    },
    TourismGovernerPassword: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'tourismGoverner'  // Default value for the type field
    }
});

tourismGovernerSchema.pre('save', async function (next) {
    const tourismGoverner = this;

    if (!tourismGoverner.isModified('TourismGovenerPassword')) return next();

    try {
        const saltRounds = 10;
        tourismGoverner.TourismGovenerPassword = await bcrypt.hash(tourismGoverner.TourismGovenerPassword, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

tourismGovernerSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.TourismGovenerPassword);
};

const TourismGoverner = mongoose.model('tourismGoverner', tourismGovernerSchema);
export default TourismGoverner;