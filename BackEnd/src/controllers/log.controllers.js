import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Log } from "../models/log.model.js";
import { Device } from "../models/device.model.js";
import { Sensor } from "../models/sensor.model.js";
import { User } from "../models/user.model.js";

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