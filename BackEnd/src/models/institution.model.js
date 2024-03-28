import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema({
    device: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        default: [],
    }],
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        default: "",
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, { timestamps: true });

export const Institution = mongoose.model("Institution", institutionSchema);