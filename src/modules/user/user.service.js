const { findUserByEmail, createUser, findUserById } = require("./user.repository");

const { findUserByEmailWithPassword } = require('./user.repository');

const comparePassword = require('../../utils/comparePassword');

const generateToken = require('../../utils/generateToken');

const hashPassword = require("../../utils/hashPassword");

const ApiError = require('../../utils/ApiError')

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

module.exports = { registerUser, loginUser, getProfile };