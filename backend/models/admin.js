import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    AdminName: {
        type: String,
        required: true,
    },
    AdminUsername: {
        type: String,
        required: true,
    },
    AdminPassword: {
        type: String,
        required: true,
    }
});

adminSchema.pre('save', async function (next) {
    const admin = this;

    if (!admin.isModified('AdminPassword')) return next();

    try {
        const saltRounds = 10;
        admin.AdminPassword = await bcrypt.hash(admin.AdminPassword, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.AdminPassword);
};

const Admin = mongoose.model('admin', adminSchema);
export default Admin;