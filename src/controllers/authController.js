const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET; 

// Sign up a new user
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, bio, skills, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return errorResponse(res, 400, 'All fields are required');
    }

    const existingUser = userModel.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, 409, 'Email already exists');
    }

    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password,
      bio,
      skills,
      role
    });

    return successResponse(res, 201, 'User created successfully', newUser);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// Sign in existing user
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }

    const user = userModel.findByEmail(email);
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Create token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    // Return user data without password
    const { password: userPassword, ...userWithoutPassword } = user;

    return successResponse(res, 200, 'Sign in successful', {
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  signUp,
  signIn,
};