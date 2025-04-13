const userModel = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const changeMentorStatus = (req, res) => {
  try {
    const { userId } = req.params;

    const user = userModel.findById(userId);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (user.isMentor) {
      return errorResponse(res, 400, 'User is already a mentor');
    }

    const updatedUser = userModel.updateToMentor(userId);

    return successResponse(res, 200, 'User set as mentor successfully', updatedUser);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};


const getAllMentors = (req, res) => {
  try {
    const mentors = userModel.getAllMentors();

    return successResponse(res, 200, 'Mentors retrieved successfully', mentors);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};


const getMentorById = (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = userModel.getMentorById(mentorId);
    if (!mentor) {
      return errorResponse(res, 404, 'Mentor not found');
    }

    return successResponse(res, 200, 'Mentor retrieved successfully', mentor);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  changeMentorStatus,
  getAllMentors,
  getMentorById,
};