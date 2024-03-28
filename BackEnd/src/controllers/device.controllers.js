import { asyncHandler } from "../utils/AsyncHandler.js";
import { Device } from "../models/device.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getInstitution } from "../utils/GetInstitution.js";


export const getAllDevices = asyncHandler(async (req, res) => {
    const institution = await getInstitution(req);
    const devices = await Device.findMany({
        institution,
    });
    res.status(200).json(new ApiResponse(200, devices));
})

export const getDevice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const device = await Device.findById(id);
    if (!device) {
        throw new ApiError(404, 'Device not found');
    }
    res.status(200).json(new ApiResponse(200, device));
})

export const createDevice = asyncHandler(async (req, res) => {
    const institution = await getInstitution(req);
    const device = await Device.create({ institution });
    res.status(201).json(new ApiResponse(201, device));
})

export const deleteDevice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const device = await Device.findByIdAndDelete(id);
    if (!device) {
        throw new ApiError(404, 'Device not found');
    }
    res.status(200).json(new ApiResponse(200, device));
})