const User = require('./user.model');

const findUserByEmail = async (email) => {
    return User.findOne({ email });
};

const createUser = async (userData) => {
    return User.create(userData);
};

const findUserByEmailWithPassword = async (email) => {
    return User.findOne({ email }).select("+password");
};

const findUserById = async(userId) => {
    return User.findById(userId);
};

const findUserByIdWithPassword = async (userId) => {
    return User.findById(userId).select('+password');
};

module.exports = { findUserByEmail, createUser, findUserByEmailWithPassword, findUserById, findUserByIdWithPassword };
