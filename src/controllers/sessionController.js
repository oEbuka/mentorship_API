const sessionModel = require('../models/sessionModel');
const userModel = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// create mentorship session request
const createSessionRequest = (req, res) => {
  try {
    const { mentorId, title, description } = req.body;
    const userId = req.user.id;

    // validate request
    if (!mentorId || !title || !description) {
      return errorResponse(res, 400, 'Mentor ID, title and description are required');
    }

    // check if mentor exists
    const mentor = userModel.getMentorById(mentorId);
    if (!mentor) {
      return errorResponse(res, 404, 'Mentor not found');
    }

    // create session request
    const session = sessionModel.create({
      userId,
      mentorId,
      title,
      description,
    });

    return successResponse(res, 201, 'Session request created successfully', session);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// accept mentorship session request
const acceptSessionRequest = (req, res) => {
  try {
    const { sessionId } = req.params;
    const mentorId = req.user.id;

    const session = sessionModel.findById(sessionId);
    if (!session) {
      return errorResponse(res, 404, 'Session request not found');
    }

    if (session.mentorId !== mentorId) {
      return errorResponse(res, 403, 'You are not authorized to accept this session request');
    }

    const updatedSession = sessionModel.updateStatus(sessionId, 'accepted');

    return successResponse(res, 200, 'Session request accepted successfully', updatedSession);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// decline mentorship session request
const declineSessionRequest = (req, res) => {
  try {
    const { sessionId } = req.params;
    const mentorId = req.user.id;
    
    const session = sessionModel.findById(sessionId);
    if (!session) {
      return errorResponse(res, 404, 'Session request not found');
    }

    // check if current user is the mentor of this session
    if (session.mentorId !== mentorId) {
      return errorResponse(res, 403, 'You are not authorized to decline this session request');
    }

    // update session status
    const updatedSession = sessionModel.updateStatus(sessionId, 'declined');

    return successResponse(res, 200, 'Session request declined successfully', updatedSession);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// get all sessions for the current user
const getUserSessions = (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = sessionModel.findByUserId(userId);
    
    return successResponse(res, 200, 'User sessions retrieved successfully', sessions);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  createSessionRequest,
  acceptSessionRequest,
  declineSessionRequest,
  getUserSessions,
};