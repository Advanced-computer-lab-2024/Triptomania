import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const tourismGovernerSchema = new Schema({
    TourismGovenerName: {
        type: String,
        required: true,
    },
    TourismGovenerUsername: {
        type: String,
        required: true,
    },
    TourismGovenerPassword: {
        type: String,
        required: true,
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