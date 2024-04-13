import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
    display : {
        type: Boolean,
        default: false,
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    minValue: {
        type: Number,
        required: true,
    },
    maxValue: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    alerts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alert",
        default: [],
    }],
    logs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Log",
        default: [],
    }],
}, { timestamps: true });

export const Sensor = mongoose.model("Sensor", sensorSchema);