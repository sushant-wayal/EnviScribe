import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Alert } from "../models/alert.model.js";

export const getAllAlerts = asyncHandler(async (req, res) => {
    const { sensorId } = req.params;
    if (!sensorId) {
        throw new ApiError(400, 'Sensor ID is required');
    }
    const { startDate, endDate } = req.body;
    if (startDate && endDate) {
        const alerts = await Alert.find({
            sensor: sensorId,
            createdAt: {
                $gte: new Date(startDate),
                $lt: new Date(endDate),
            },
        });
        res.status(200).json(new ApiResponse(200, alerts));
    }
    const alerts = await Alert.find({ sensor: sensorId });
    res.status(200).json(new ApiResponse(200, alerts));
});

export const getAlert = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const alert = await Alert.findById(id);
    if (!alert) {
        return res.status(404).json(new ApiResponse(404, null, 'Alert not found'));
    }
    res.status(200).json(new ApiResponse(200, alert));
});