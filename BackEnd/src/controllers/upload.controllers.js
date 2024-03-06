import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadImage = asyncHandler(async (req, res) => {
    const result = await uploadOnCloudinary(req.file.path);
    if (!result) {
        return res.status(500).json(new ApiResponse(500, null, 'Error uploading image'));
    }
    return res.status(201).json(new ApiResponse(201, {url: result.url}, 'Image uploaded successfully'));
});

export { uploadImage };