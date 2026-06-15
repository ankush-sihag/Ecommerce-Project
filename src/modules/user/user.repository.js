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

module.exports = { findUserByEmail, createUser, findUserByEmailWithPassword };
