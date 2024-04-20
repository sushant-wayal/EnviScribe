import { Institution } from "../models/institution.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerInstitution = asyncHandler(async (req, res) => {
	const {
		name,
    email,
    key
	} = req.body;
  if (!name || !email || !key) {
    return res.status(400).json(new ApiResponse(400, "Please fill all fields"));
  }
  const institutionExists = await Institution.findOne({ email });
  if (institutionExists) {
    return res.status(400).json(new ApiResponse(400, "Institution already exists"));
  }
  const institution = await Institution.create({
    name,
    email,
    key
  });
  res.status(201).json(institution);
});