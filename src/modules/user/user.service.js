const { findUserByEmail, createUser } = require("./user.repository");

const { findUserByEmailWithPassword } = require('./user.repository');

const comparePassword = require('../../utils/comparePassword');

const generateToken = require('../../utils/generateToken');

const hashPassword = require("../../utils/hashPassword");

const registerUser = async (userData) => {
  const { email, password } = userData;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
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
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
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

module.exports = { registerUser, loginUser };