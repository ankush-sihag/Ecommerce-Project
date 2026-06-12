const { findUserByEmail, createUser } = require("./user.repository");
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

module.exports = { registerUser };