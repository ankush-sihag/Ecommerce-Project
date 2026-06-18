const { findUserByEmail, createUser, findUserById, findUserByIdWithPassword } = require("./user.repository");

const { findUserByEmailWithPassword } = require('./user.repository');

const comparePassword = require('../../utils/comparePassword');

const generateToken = require('../../utils/generateToken');

const hashPassword = require("../../utils/hashPassword");

const ApiError = require('../../utils/ApiError');
const { findById } = require("./user.model");

const registerUser = async (userData) => {
  const { email, password } = userData;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(
      409,
      "User already exists"
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    ...userData,
    password: hashedPassword,
  });

  return user;
};

const loginUser = async (loginData) => {
  const { email, password } = loginData;
  const user = await findUserByEmailWithPassword(email);
  if (!user) {
    throw new ApiError(
      401,
      'Invalid email or password'
    );
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const getProfile = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(
      404,
      'User not found'
    );
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerfied,
  };
};

const changePassword = async ( userId,passwordData ) => {
  const { oldPassword, newPassword } = passwordData;

  if(oldPassword === newPassword) {
    throw new ApiError(
      400,
      'New password must be diffrent from old password'
    );
  }

  const user = await findUserByIdWithPassword(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isOldPasswordValid = await comparePassword(oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new ApiError(400, 'Old password is incorrect'); 
  }

  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;
  await user.save();

  return {
    message: 'Password changed successfully',
  };
};

module.exports = { registerUser, loginUser, getProfile, changePassword };