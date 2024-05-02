import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor",
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["warning", "alert"],
        required: true,
    },
}, { timestamps: true });

export const Alert = mongoose.model("Alert", alertSchema);