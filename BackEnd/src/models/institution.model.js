import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema({
    devices: [{
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
        unique: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    key: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

export const Institution = mongoose.model("Institution", institutionSchema);