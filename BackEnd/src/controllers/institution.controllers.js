import { Institution } from "../models/institution.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const registerInstitution = asyncHandler(async (req, res) => {
	const {
		name,
    email,
    key
	} = req.body;
  const institution = await Institution.create({
    name,
    email,
    key
  });
  res.status(201).json(institution);
});