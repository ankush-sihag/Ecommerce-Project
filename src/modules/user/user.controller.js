const { 
    registerUser: registerUserService,
    loginUser: loginUserService,
    getProfile: getProfileService
} = require('./user.service');

const asyncHandler = require('../../utils/asyncHandler');

const registerUser = asyncHandler(async (req, res) => {
    const user = await registerUserService(req.body);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const result = await loginUserService(req.body);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
    });
});

const getProfile = asyncHandler(async (req, res) => {
    const profile = await getProfileService(req.user.userId);
    res.status(200).json({
        success: true,
        data: profile,
    });
});

module.exports = { registerUser, loginUser, getProfile };