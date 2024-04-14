import { asyncHandler } from '../utils/AsyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Institution } from '../models/institution.model.js';
import pkg from 'mongoose';

// const cookieOptions = {
//     httpOnly: true,
//     secure: true,
// };

const { $or } = pkg;

const createAccessAndRefreshToken = async (userId) => {
    if (!userId) {
        throw new ApiError(500,'User ID is required');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(500,'User not found');
    }
    try {
        const accessToken = user.getAccessToken();
        const refreshToken = user.getRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false});
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500,'Error creating access and refresh tokens');
    }
}

const registerUser = asyncHandler(async (req, res) => {
    console.log("Registering user");
	const {
		username,
		firstName,
		lastName,
		email,
		profileImage,
		password,
        institutionEmail,
	} = req.body;
    const inValid = username === undefined || username === '' || username === null;
    if (inValid) {
        throw new ApiError(400, 'All fields are required');
    }
    const allReadyExistsWithUsername = await User.findOne({ username });
    const allReadyExistsWithEmail = await User.findOne({ email });
    if (allReadyExistsWithUsername || allReadyExistsWithEmail) {
        throw new ApiError(400, 'User already exists');
    }
    try {
        const { _id } = await Institution.findOne({
            email: institutionEmail,
        });
        console.log("Institution ID: ", _id);
        const user = await User.create({
            username,
            firstName,
            lastName,
            email,
            profileImage,
            password,
            institution: _id
        });
        const createdUser = await User.findById(user._id).select('-password -__v -refreshToken');
        const { accessToken, refreshToken } = await createAccessAndRefreshToken(user._id);
        res
        .status(201)
        .json(new ApiResponse(201,{
            authenticated: true,
            createdUser,
            accessToken,
            refreshToken,
        }, 'User created successfully'));
    } catch (error) {
        throw new ApiError(500, `Error creating user ${error}`);
    }
});

const login = asyncHandler(async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    console.log("credentials: ", usernameOrEmail, password);
    // const inValid = req.body.some(field => field === undefined || field === '' || field === null);
    // if (inValid) {
    //     throw new ApiError(400, 'All fields are required');
    // }
    const isEmail = usernameOrEmail.includes('@');
    const username = isEmail ? null : usernameOrEmail;
    const email = isEmail ? usernameOrEmail : null;
    const user = await User.findOne($or, [{ username }, { email }]);

    if (!user) {
        return res.status(400).json(new ApiResponse(400, null, 'No such User found'));
    }
	const isPasswordValid = await user.isPasswordValid(password);
	if (!isPasswordValid) {
		return res.status(400).json(new ApiResponse(400, null, 'Invalid username or password'));
	}
	const { accessToken, refreshToken } = await createAccessAndRefreshToken(user._id);
	return res
	.status(200)
	.json(new ApiResponse(200, {
		authenticated: true,
		user,
		accessToken,
		refreshToken,
	}, 'Login successful'));
});

export {
    registerUser,
    login,
};