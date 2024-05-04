import { asyncHandler } from "../utils/AsyncHandler.js";
import { Device } from "../models/device.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Sensor } from "../models/sensor.model.js";
import { User } from "../models/user.model.js";

export const getAllSensors = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { query } = req.query;
    if (deviceId) {
        if (query != undefined) {
            let { sensors } = await Device.findById(deviceId).select("sensors").populate({
                path: "sensors",
                match: { name: { $regex: query, $options: "i" } }
            });
            if (sensors == undefined) {
                return res.status(404).json(new ApiResponse(404, null, "Sensor not found"));
            }
            sensors = sensors.filter((sensor, index, self) => self.findIndex(s => s.name === sensor.name) === index);
            if (!sensors) {
                throw new ApiError(404, 'Device not found');
            }
            const resSensorsWithLogStatus = [];
            for (const sensor of sensors) {
                const { logs } = await Sensor.findById(sensor._id).select('logs').populate('logs').sort({ createdAt: -1 }).limit(1);
                if (logs.length  && logs[0].createdAt > Date.now() - 900000) {
                    resSensorsWithLogStatus.push({ ...sensor, logStatus: logs[0].status, display: sensor.display});
                }else {
                    resSensorsWithLogStatus.push({ ...sensor, logStatus: "normal", display: sensor.display});
                }
            }
            return res.status(200).json(new ApiResponse(200, resSensorsWithLogStatus));
        } else {
            let sensors;
            try {
                const device = await Device.findById(deviceId).select("sensors institution");
                const { institution } = await User.findById(req.user.id).select("institution");
                if (device.institution.toString() != institution.toString()) {
                    return res.status(404).json(new ApiResponse(404, null, "Device not found"));
                }
                sensors = device.sensors;
            } catch {
                return res.status(404).json(new ApiResponse(404, null, "Device not found"));
            }
            const resSensors = []
            for (const sensorId of sensors) {
                const sensor = await Sensor.findById(sensorId).select("-device -unit -alerts -createdAt -updatedAt -__v").populate("logs");
                resSensors.push(sensor);
            }
            const resSensorsWithLogStatus = []
            for (const sensor of resSensors) {
                const { logs } = await Sensor.findById(sensor._id).select('logs').populate('logs').sort({ createdAt: -1 }).limit(1);
                if (logs.length  && logs[0].createdAt > Date.now() - 900000) {
                    resSensorsWithLogStatus.push({ ...sensor, logStatus: logs[0].status, display: sensor.display});
                } else {
                    resSensorsWithLogStatus.push({ ...sensor, logStatus: "normal", display: sensor.display});
                }
            }
            if (req.query.sensors) {
                return res.status(200).json(new ApiResponse(200, resSensorsWithLogStatus.filter(sensor => sensor.display === true).map(sensor => ({...sensor, logs: sensor._doc.logs.slice(0,5)}))));
            }
            return res.status(200).json(new ApiResponse(200, resSensorsWithLogStatus.filter(sensor => sensor.display === true)));
        }
    } else {
        if (query) {
            const sensors = await Sensor.find({ name: { $regex: query, $options: "i" } });
            const resSensorsWithLogStatus = []
            for (const sensor of sensors) {
                const { logs } = await Sensor.findById(sensor._id).select('logs').populate('logs').sort({ createdAt: -1 }).limit(1);
                if (logs.length  && logs[0].createdAt > Date.now() - 900000) {
                    resSensorsWithLogStatus.push({ ...sensor, logStatus: logs[0].status, display: sensor.display});
                } else {
                    resSensorsWithLogStatus.push({ ...sensor, logStatus: "normal", display: sensor.display});
                }
            }
            return res.status(200).json(new ApiResponse(200, resSensorsWithLogStatus));
        } else {
            const sensors = await Sensor.find();
            const resSensorsWithLogStatus = []
            for (const sensor of sensors) {
                const { logs } = await Sensor.findById(sensor._id).select('logs').populate('logs').sort({ createdAt: -1 }).limit(1);
                if (logs.length  && logs[0].createdAt > Date.now() - 900000) {
                    resSensorsWithLogStatus.push({ ...sensor, logStatus: logs[0].status, display: sensor.display});
                } else {
                    resSensorsWithLogStatus.push({ ...sensor, logStatus: "normal", display: sensor.display});
                }
            }
            return res.status(200).json(new ApiResponse(200, resSensorsWithLogStatus.filter(sensor => sensor.display === true)));
        }
    }
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