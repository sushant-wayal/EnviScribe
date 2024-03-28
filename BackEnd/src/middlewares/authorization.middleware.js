import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';

const isAdmin = async (req, res, next) => {
    const { id } = req.user;
	if (!id) {
        throw new ApiError(401, 'You are not authorized to access this route');
    }
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(401, 'User not found');
    }
    if (user.role === 'admin') {
        return next();
    }
    return res.status(401).json(new ApiResponse(401, null, 'You are not authorized to access this route'));
};

export { isAdmin };