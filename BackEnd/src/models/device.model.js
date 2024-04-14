import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        // required: true,
    },
    sensors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor",
        default: [],
    }],
    location: {
        type: {
            longitude: {
                type: Number,
                required: true,
                validate: {
                    validator: value => value >= -180 && value <= 180,
                    message: 'Invalid longitude',
                },
            },
            latitude: {
                type: Number,
                required: true,
                validate: {
                    validator: value => value >= -90 && value <= 90,
                    message: 'Invalid latitude',
                },
            },
        },
        required: true,
    },
}, { timestamps: true });

export const Device = mongoose.model("Device", deviceSchema);