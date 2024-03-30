import { asyncHandler } from "../utils/AsyncHandler.js";
import { Device } from "../models/device.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Sensor } from "../models/sensor.model.js";

export const getAllSensors = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { sensors } = await Device.findById(deviceId).select("sensors").populate("sensors");
    if (!sensors) {
        throw new ApiError(404, 'Device not found');
    }
    res.status(200).json(new ApiResponse(200, sensors));
});

export const getSensor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sensor = await Sensor.findById(id);
    if (!sensor) {
        throw new ApiError(404, 'Sensor not found');
    }
    res.status(200).json(new ApiResponse(200, sensor));
});

export const createSensor = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { name, unit, minValue, maxValue } = req.body;
    const sensor = Sensor.create({
        device: deviceId,
        name,
        unit,
        minValue,
        maxValue,
    });
    res.status(201).json(new ApiResponse(201, sensor));
});

export const updateSensor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { unit, minValue, maxValue, status } = req.body;
    const update = {};
    if (unit) update.unit = unit;
    if (minValue) update.minValue = minValue;
    if (maxValue) update.maxValue = maxValue;
    if (status) update.status = status;
    const sensor = await Sensor.findByIdAndUpdate(id, update, { new: true });
    if (!sensor) {
        throw new ApiError(404, 'Sensor not found');
    }
    res.status(200).json(new ApiResponse(200, sensor));
});

export const deleteSensor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sensor = await Sensor.findByIdAndDelete(id);
    if (!sensor) {
        throw new ApiError(404, 'Sensor not found');
    }
    res.status(200).json(new ApiResponse(200, sensor));
});