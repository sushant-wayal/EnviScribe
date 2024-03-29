import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Log } from "../models/log.model.js";

export const getAllLogs = asyncHandler(async (req, res) => {
    const { sensorId } = req.params;
    if (!sensorId) {
        throw new ApiError(400, 'Sensor ID is required');
    }
    const { startDate, endDate } = req.body;
    if (startDate && endDate) {
        const logs = await Log.find({
            sensor: sensorId,
            createdAt: {
                $gte: new Date(startDate),
                $lt: new Date(endDate),
            },
        });
        res.status(200).json(new ApiResponse(200, logs));
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