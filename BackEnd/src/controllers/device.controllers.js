import { asyncHandler } from "../utils/AsyncHandler";
import { Device } from "../models/device.model";

const getAllDevices = asyncHandler(async (_req, res) => {
    const devices = await Device.find();
    res.status(200).json(new ApiResponse(200, devices));
})

const getDevice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const device = await Device.findById(id);
    if (!device) {
        throw new ApiError(404, 'Device not found');
    }
    res.status(200).json(new ApiResponse(200, device));
})

const createDevice = asyncHandler(async (req, res) => {
    const { institution } = req.body;
    const device = await Device.create({ institution });
    res.status(201).json(new ApiResponse(201, device));
})

const changeInstitution = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { institution } = req.body;
    const device = await Device.findByIdAndUpdate(id, { institution }, { new: true });
    if (!device) {
        throw new ApiError(404, 'Device not found');
    }
    res.status(200).json(new ApiResponse(200, device));
})

const deleteDevice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const device = await Device.findByIdAndDelete(id);
    if (!device) {
        throw new ApiError(404, 'Device not found');
    }
    res.status(200).json(new ApiResponse(200, device));
})

export {
    getAllDevices,
    getDevice,
    createDevice,
    changeInstitution,
    deleteDevice,
};