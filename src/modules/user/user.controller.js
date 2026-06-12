const { 
    registerUser: registerUserService 
} = require('./user.service');

const registerUser = async (req, res) => {
    res.status(201).json({
        success: true,
        message: "Register Controller Working"
    });
};

module.exports = { registerUser };