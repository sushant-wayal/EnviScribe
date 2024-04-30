import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor",
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["normal", "warning", "alert"],
        default: "normal",
    },
    onHold: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Log = mongoose.model("Log", logSchema);