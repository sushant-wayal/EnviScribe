import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Log } from "../models/log.model.js";
import { Device } from "../models/device.model.js";
import { Sensor } from "../models/sensor.model.js";
import { User } from "../models/user.model.js";
import { Institution } from "../models/institution.model.js";

const getIntervalLogs = (logs, intervalValue) => {
    const intervalLogs = [];
    for (let i = 0; i < logs.length; i+=intervalValue) {
        let value = 0;
        for (let j = 0; j < intervalValue; j++) {
            if (i+j >= logs.length) {
                break;
            }
            value += logs[i+j].value;
        }
        value /= intervalValue;
        let alert = 0;
        for (let j = 0; j < intervalValue; j++) {
            if (i+j >= logs.length) {
                break;
            }
            if (logs[i+j].status !== "normal") {
                alert++;
            }
        }
        intervalLogs.push({
            value,
            timestamp: logs[i].createdAt,
            status: alert/logs.length > 0.4 ? 'alert' : 'normal',
        });
    }
    return intervalLogs;
}

export const getAllLogs = asyncHandler(async (req, res) => {
    const { sensorId } = req.params;
    if (!sensorId) {
        throw new ApiError(400, 'Sensor ID is required');
    }
    const { startDate, endDate, interval } = req.query;
    if (startDate && endDate) {
        try {
            const logs = await Log.find({
                sensor: sensorId,
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            });
            if (!logs.length) {
                return res.status(200).json(new ApiResponse(200, []));
            }
            if (interval) {
                let intervalLogs = [];
                if (interval === 'Hour') {
                    intervalLogs = getIntervalLogs(logs, 4);
                } else if (interval === 'Day') {
                    intervalLogs = getIntervalLogs(logs, 96);
                } else if (interval === 'Week') {
                    intervalLogs = getIntervalLogs(logs, 672);
                } else if (interval === 'Month') {
                    intervalLogs = getIntervalLogs(logs, 2880);
                } else if (interval === 'Year') {
                    intervalLogs = getIntervalLogs(logs, 34560);
                } else {
                    throw new ApiError(400, 'Invalid interval');
                }
                return res.status(200).json(new ApiResponse(200, intervalLogs));
            } else {
                return res.status(200).json(new ApiResponse(200, logs.map(log => ({
                    value: log.value,
                    timestamp: log.createdAt,
                    status: log.status,
                }))));
            }
        } catch {
            return res.status(404).json(new ApiResponse(404, 'Logs not found'));
        }
        
    }
    const logs = await Log.find({ sensor: sensorId });
    res.status(200).json(new ApiResponse(200, logs));
});

export const getLog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const log = await Log.findById(id);
    if (!log) {
        return res.status(404).json(new ApiResponse(404, 'Log not found'));
    }
    res.status(200).json(new ApiResponse(200, log));
});

export const generateRandomLogs = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { institution : { devices : [ device ] } } = await User.findById(id).populate("institution");
    const { sensors } = await Device.findById(device).select("sensors").populate("sensors");
    for (const sensor of sensors) {
        const { _id, minValue, maxValue } = sensor;
        let time = new Date();
        for (let i = 0; i < 8640; i++) {
            const value = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
            const log = await Log.create({
                sensor: _id,
                value,
                status: value < minValue || value > maxValue ? "alert" : "normal",
                createdAt: time,
            });
            time = new Date(time.getTime() + 15*60000);
            await Sensor.findByIdAndUpdate(_id, {
                $push: {
                    logs: log._id,
                },
            })
        }
    }
    return res.status(200).json(new ApiResponse(200, 'Logs generated successfully'));
})

export const testRoute = asyncHandler(async (req,res) => {
    await Institution.create({
        name: "Test"+num.toString(),
        email: "1@gmail.com"+num.toString(),
        key: num.toString(),
    })
    num++;
    return res.status(200).json(new ApiResponse(200, 'Test Successfull'));
})

export const createLog = asyncHandler(async (req, res) => {
    const { sensorId, value } = req.body;
    console.log("sensorId",sensorId);
    console.log("value",value);
    if (!sensorId || !value) {
        throw new ApiError(400, 'Sensor ID and value are required');
    }
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
        throw new ApiError(404, 'Sensor not found');
    }
    const { minValue, maxValue } = sensor;
    const range = maxValue - minValue;
    let status = "normal";
    if (value < minValue || value > maxValue) {
        status = "alert";
    } else if (value < minValue + range*0.2 || value > maxValue - range*0.2) {
        status = "warning";
    }
    const log = await Log.create({
        sensor: sensorId,
        value,
        status,
    });
    const sensorLogs = await Log.find({
        sensor: sensorId,
        onHold: false
    }).sort({ createdAt: -1 }).limit(10);
    if (sensorLogs.length < 10) {
        await Sensor.findByIdAndUpdate(sensorId, {
            $push: {
                logs: log._id,
            },
        });
        res.status(201).json(new ApiResponse(201, log));
    }
    const logValues = sensorLogs.map(log => log.value);
    const meanValue = logValues.reduce((sum, value) => sum + value, 0) / logValues.length;
    let isOutlier = false;
    if (Math.abs(value - meanValue) > range * 0.5) {
        isOutlier = true;
    }
    const latestLogs = await Log.find({
        sensor: sensorId,
        onHold: true
    }).sort({ createdAt: -1 }).limit(2);
    if (isOutlier) {
        if (latestLogs.length >= 2) {
            await Log.updateMany(
                { _id: { $in: latestLogs.map(log => log._id) } },
                { $set: { onHold: false } }
            );
        } else {
            await Log.findByIdAndUpdate(log._id, { onHold: true });
        }
    } else {
        if (latestLogs.length <= 2) {
            await Log.updateMany(
                { _id: { $in: latestLogs.map(log => log._id) } },
                { $set: { onHold: false, value: meanValue, status: "normal" } }
            );
        }
    }
    await Sensor.findByIdAndUpdate(sensorId, {
        $push: {
            logs: log._id,
        },
    });
    res.status(201).json(new ApiResponse(201, log));
});