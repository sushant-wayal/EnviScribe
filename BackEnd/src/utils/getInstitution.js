import User from "../models/User.js";

export const getInstitution = async (req) => {
    const { id } = req.user;
    const user = await User.findById(id).select("institution");
    return user.institution;
}