const { 
    registerUser: registerUserService 
} = require('./user.service');

const { loginUser: loginUserService } = require('./user.service');

const registerUser = async (req, res) => {
    const user = await registerUserService(req.body);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
};

const loginUser = async (req, res) => {
    const result = await loginUserService(req.body);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
    });
};

module.exports = { registerUser, loginUser };