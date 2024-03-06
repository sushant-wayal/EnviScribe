import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        required: true,
    },
    sensors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor",
    }],
}, { timestamps: true });

export const Device = mongoose.model("Device", deviceSchema);