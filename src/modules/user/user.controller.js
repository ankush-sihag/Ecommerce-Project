const { 
    registerUser: registerUserService,
    loginUser: loginUserService,
    getProfile: getProfileService,
    changePassword: changePasswordService,
    forgotPassword: forgotPasswordService,
    resetPassword: resetPasswordService
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

const changePassword = asyncHandler(async (req, res) => {
    const result = await changePasswordService(
        req.user.userId,
        req.body
    );

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const result = await forgotPasswordService(req.body.email);
    res.status(200).json({
        success: true,
        ...result,
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const result = await resetPasswordService(req.body.token, req.body.newPassword);
    res.status(200).json({
        success: true,
        message: result.message,
    });
});

module.exports = { registerUser, loginUser, getProfile, changePassword, forgotPassword, resetPassword };