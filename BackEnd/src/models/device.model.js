import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        required: true,
    },
    sensors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor",
        default: [],
    }],
    location: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Device = mongoose.model("Device", deviceSchema);