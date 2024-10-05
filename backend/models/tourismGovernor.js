import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tourismGovernorSchema = new Schema({
    GovernerName: {
        type: String,
        required: true,
    },
    GovernerUsername: {
        type: String,
        required: true,
    },
    GovernerPassword: {
        type: String,
        required: true,
    },
});

tourismGovernorSchema.pre(method, options, fn)