import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Log } from "../models/log.model.js";

const getIntervalLogs = (logs, intervalValue) => {
    const intervalLogs = [];
    for (let i = 0; i < logs.length; i+=intervalValue) {
        const value = 0;
        for (let j = 0; j < intervalValue; j++) {
            value += logs[i+j].value;
        }
        value /= intervalValue;
        const alert = 0;
        for (let j = 0; j < intervalValue; j++) {
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
        const logs = await Log.find({
            sensor: sensorId,
            createdAt: {
                $gte: new Date(startDate),
                $lt: new Date(endDate),
            },
        });
        if (!logs.length) {
            throw new ApiError(404, 'Logs not found');
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
            res.status(200).json(new ApiResponse(200, intervalLogs));
        } else {
            res.status(200).json(new ApiResponse(200, logs.map(log => ({
                value: log.value,
                timestamp: log.createdAt,
                status: log.status,
            }))));
        }
    }
    const logs = await Log.find({ sensor: sensorId });
    res.status(200).json(new ApiResponse(200, logs));
});

export const getLog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const log = await Log.findById(id);
    if (!log) {
        throw new ApiError(404, 'Log not found');
    }
    res.status(200).json(new ApiResponse(200, log));
});