import { asyncHandler } from "../utils/AsyncHandler.js";
import { Device } from "../models/device.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Sensor } from "../models/sensor.model.js";

export const getAllDevices = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { devices } = await User.findById(id).select('institution').populate('institution').select('devices').populate('devices').select('_id name location sensors').populate('sensors');
    const { sensors } = devices;
    let status = "Normal";
    for (const sensor of sensors) {
        const recentAlert = await Sensor.findById(sensor._id).select('alerts').populate('alerts').sort({ createdAt: -1 }).limit(1);
        if (recentAlert.createdAt > Date.now() - 300000) {
            status = "Alert";
            break;
        }
    }
    res.status(200).json(new ApiResponse(200, {...devices, status}));
})

export const getDevice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const device = await Device.findById(id).select('name location sensors').populate('sensors');
    if (!device) {
        throw new ApiError(404, 'Device not found');
    }
    res.status(200).json(new ApiResponse(200, device));
})

export const createDevice = asyncHandler(async (req, res) => {
    const { name, location : { longitude, latitude }, sensors } = req.body;
    if (!longitude || !latitude) {
        throw new ApiError(400, 'Location is required');
    }
    if (longitude < -180 || longitude > 180) {
        throw new ApiError(400, 'Invalid longitude');
    }
    if (latitude < -90 || latitude > 90) {
        throw new ApiError(400, 'Invalid latitude');
    }
    if (name) {
        const { id } = req.user;
        const user = await User.findById(id).select('institution');
        const device = await Device.findOneAndUpdate({ location }, { name, institution: user.institution });
        if (device) {
            const sensorsId = device.sensors;
            for (const sensorId of sensorsId) {
                const sensor = await Sensor.findById(sensorId);
                if (!sensor) {
                    throw new ApiError(404, 'Sensor not found');
                }
                if (sensors.includes(sensor.name)) {
                    sensor.display = true;
                    await sensor.save({ validateBeforeSave: false });
                }
            }
        }
        res.status(201).json(new ApiResponse(201, device));
    } else {
        const deviceId = await Device.create({ location : { longitude, latitude }});
        const sensorsId = [];
        for (const sensor of sensors) {
            const { _id } = await Sensor.create({
                device: deviceId,
                ...sensor,
            });
            sensorsId.push(_id);
        }
        const device = await Device.findByIdAndUpdate(deviceId, { sensors: sensorsId })
        res.status(201).json(new ApiResponse(201, device));
    }
})

export const deleteDevice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const device = await Device.findByIdAndUpdate(id, {
        name: undefined,
        institution: undefined,
    });
    if (!device) {
        throw new ApiError(404, 'Device not found');
    }
    res.status(200).json(new ApiResponse(200, device));
})