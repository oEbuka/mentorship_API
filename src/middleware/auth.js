// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');
const userModel = require('../models/userModel');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET; 

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return errorResponse(res, 401, 'Authentication failed! Token not provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = userModel.findById(decoded.userId);
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    req.user = user;
    return next();
  } catch (error) {
    return errorResponse(res, 401, 'Authentication failed! Invalid token');
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 403, 'Access denied! Admin only');
};

const mentorOnly = (req, res, next) => {
  if (req.user && req.user.isMentor) {
    return next();
  }
  return errorResponse(res, 403, 'Access denied! Mentors only');
};

module.exports = {
  auth,
  adminOnly,
  mentorOnly,
};