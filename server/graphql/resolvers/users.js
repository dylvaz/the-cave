const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterUserInput, validateLoginInput } = require('../../util/validators');
const User = require('../../models/User');

const generateToken = (user) => {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, process.env.SECRET_KEY, { expiresIn: `1h` });
};

module.exports = {
  Mutation: {
    login: async (_, { username, password }) => {
      const { errors, valid } = validateLoginInput(username, password);
      if(!valid) {
        throw new UserInputError('Errors', { errors });
      }
      //Query db for user
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User does not exist.';
        throw new UserInputError('User not found.', { errors });
      }
      //Compare password user inputed to password stored
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Incorrect credentials.';
        throw new UserInputError('Incorrect credentials.', { errors });
      }
      //Generate JWT for auth
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    register: async (_, {
      registerInput: { username, email, password, confirmPassword }
    }) => {
      //Validate userdata
      const { errors, valid } = validateRegisterUserInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      //Make sure user doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken.', {
          errors: {
            username: 'This username is taken.'
          }
        });
      }
      //Hash password and create an authtoken
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};
