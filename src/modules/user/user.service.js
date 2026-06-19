const { findUserByEmail, createUser, findUserById, findUserByIdWithPassword, findUserByResetToken } = require("./user.repository");

const { findUserByEmailWithPassword } = require('./user.repository');
const { findById } = require("./user.model");
const comparePassword = require('../../utils/comparePassword');

const generateToken = require('../../utils/generateToken');

const hashPassword = require("../../utils/hashPassword");

const generateResetToken = require('../../utils/generateResetToken');

const hashResetToken = require('../../utils/hashResetToken');

const ApiError = require('../../utils/ApiError');


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

const forgotPassword = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    return { message: 'If aaccount exists, password reset instruction have been generated'};
  }

  const resetToken = generateResetToken();
  const hashedToken = hashResetToken(resetToken);
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 25 * 60 * 1000 );
  await user.save();
  return {
    message: 'If aaccount exists, password reset instruction have been generated',
    resetToken,
  };
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = hashResetToken(token);
  const user = await findUserByResetToken(hashedToken);
  if(!user) {
    throw new ApiError(400, 'Invalid reset token');
  }

  if (user.passwordResetExpires < new Date()) {
    throw new ApiError(400, 'Reset token expired');
  }

  const isSamePassword = await comparePassword(newPassword, user.password);
  if (isSamePassword) {
    throw new ApiError(400, 'New password must be diffrent from current password');
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return {
    message: 'Passwordreset successfully',
  };
};

module.exports = { registerUser, loginUser, getProfile, changePassword, forgotPassword, resetPassword };