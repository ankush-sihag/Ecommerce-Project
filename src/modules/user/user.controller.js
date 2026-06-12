const { 
    registerUser: registerUserService 
} = require('./user.service');

const registerUser = async (req, res) => {
    const user = await registerUserService(req.body);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
};

module.exports = { registerUser };