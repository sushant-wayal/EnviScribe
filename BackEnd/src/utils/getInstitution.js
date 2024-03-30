import { User } from "../models/user.model.js";

export const getInstitution = async (req) => {
    const { id } = req.user;
    const user = await User.findById(id).select("institution");
    return user.institution;
}