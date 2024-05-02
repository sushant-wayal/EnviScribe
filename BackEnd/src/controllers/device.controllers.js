import { asyncHandler } from "../utils/AsyncHandler.js";
import { Device } from "../models/device.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Sensor } from "../models/sensor.model.js";
import { Institution } from "../models/institution.model.js";

export const getAllDevices = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { institution } = await User.findById(id).select('institution').populate('institution').select('devices');
    if (!institution) {
        throw new ApiError(404, 'Institution not found');
    }
    const devices = institution.devices;
    if (!devices) {
        throw new ApiError(404, 'No devices found');
    }
    if (devices.length === 0) {
        return res.status(200).json(new ApiResponse(200, devices));
    } else {
        const { query } = req.query;
        if (query) {
            const resDevices = await Device.find({
                name: { $regex: query, $options: 'i' },
                institution: institution._id,
            }).select('name location sensors _id');
            res.status(200).json(new ApiResponse(200, resDevices));
        } else {
            let resDevices = [];
            for (const device of devices) {
                const { _id, name, location, sensors } = await Device.findById(device._id).select('name location sensors').populate('sensors');
                const visibleSensors = sensors.filter(sensor => sensor.display);
                resDevices.push({ _id, name, location, sensors : visibleSensors });
            }
            for (const device of resDevices) {
                const { sensors } = device;
                let status = "normal";
                for (const sensor of sensors) {
                    const { logs } = await Sensor.findById(sensor._id).select('logs').populate('logs').sort({ createdAt: -1 }).limit(1);
                    if (logs.length  && logs[0].createdAt > Date.now() - 900000) {
                        status = logs[0].status;
                        break;
                    }
                }
                device.status = status;
            }
            res.status(200).json(new ApiResponse(200, resDevices));
        }
    }
})

export const getDevice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let device;
    try {
        device = await Device.findById(id).select('name location sensors').populate('sensors');
    } catch {
        return res.status(404).json(new ApiResponse(404, null, 'Device not found'));
    }
    if (!device.sensors) {
        throw new ApiError(404, 'No sensors found');
    }
    device.sensors = device.sensors.filter(sensor => sensor.display);
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
        const device = await Device.findOne({ 
            "location.longitude": longitude,
            "location.latitude": latitude,
         });
        if (!device) {
            return res.status(404).json(new ApiResponse(404, null, 'No device found at given location'));
        }
        device.institution = user.institution;
        device.name = name;
        await device.save({ validateBeforeSave: false });
        const institution = await Institution.findById(user.institution);
        if (!institution.devices.includes(device._id)) {
            institution.devices.push(device._id);
            await institution.save({ validateBeforeSave: false });
        }
        if (device) {
            const sensorsId = device.sensors;
            for (const sensorId of sensorsId) {
                const sensor = await Sensor.findById(sensorId);
                if (!sensor) {
                    throw new ApiError(404, 'Sensor not found');
                }
                if (sensors.includes(sensor.name)) {
                    sensor.display = true;
                } else {
                    sensor.display = false;
                }
                await sensor.save({ validateBeforeSave: false });
            }
            let status = "normal";
            for (const sensorId of sensorsId) {
                const { display } = await Sensor.findById(sensorId).select('display');
                if (!display) continue;
                const { logs } = await Sensor.findById(sensorId).select('logs').populate('logs').sort({ createdAt: -1 }).limit(1);
                if (logs.length  && logs[0].createdAt > Date.now() - 900000) {
                    status = logs[0].status;
                    break;
                }
            }
            const newDevice = {...device._doc};
            const diaplaysensors = [];
            for (const sensorId of newDevice.sensors) {
                const sensor = await Sensor.findById(sensorId);
                if (sensor.display) diaplaysensors.push(sensorId);
            }
            newDevice.sensors = diaplaysensors;
            newDevice.id = newDevice._id;
            newDevice._id = undefined;
            newDevice.status = status;
            return res.status(201).json(new ApiResponse(201, newDevice));
        }
        res.status(201).json(new ApiResponse(201, device));
    } else {
        const deviceExits = await Device.findOne({ 
            "location.longitude": longitude,
            "location.latitude": latitude,
         });
        if (deviceExits) {
            const deviceId = deviceExits._id;
            const sensors = deviceExits.sensors;
            return res.status(201).json(new ApiResponse(201, {
                deviceId,
                sensors,
            }));
        }
        const newDevice = await Device.create({ location : { longitude, latitude }});
        const sensorsId = [];
        for (const sensor of sensors) {
            const { _id } = await Sensor.create({
                device: newDevice._id,
                ...sensor,
            });
            sensorsId.push(_id);
        }
        const device = await Device.findByIdAndUpdate(newDevice._id, { sensors: sensorsId })
        res.status(201).json(new ApiResponse(201, {
            deviceId : device._id,
            sensors : sensorsId,
        }));
    }
})

export const deleteDevice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const device = await Device.findById(id).select('institution sensors');
    if (!device) {
        throw new ApiError(404, 'Device not found');
    }
    const institution = await Institution.findById(device.institution);
    institution.devices = institution.devices.filter(deviceId => deviceId.toString() !== id.toString());
    await institution.save({ validateBeforeSave: false });
    await Device.findByIdAndUpdate(id, {
        institution: null,
        name: null,
    });
    for (const sensorId of device.sensors) {
        await Sensor.findByIdAndUpdate(sensorId, {
            display: false,
        });
    }
    res.status(200).json(new ApiResponse(200, device));
})