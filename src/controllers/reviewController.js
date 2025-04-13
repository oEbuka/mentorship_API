const reviewModel = require('../models/reviewModel');
const sessionModel = require('../models/sessionModel');
const userModel = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');


const createReview = (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;
    const userId = req.user.id;

    
    if (!sessionId || !rating) {
      return errorResponse(res, 400, 'Session ID and rating are required');
    }

    if (rating < 1 || rating > 5) {
      return errorResponse(res, 400, 'Rating must be between 1 and 5');
    }

    const session = sessionModel.findById(sessionId);
    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    if (session.userId !== userId) {
      return errorResponse(res, 403, 'You can only review sessions you participated in');
    }

    if (session.status !== 'accepted') {
      return errorResponse(res, 400, 'You can only review completed sessions');
    }

    const review = reviewModel.create({
      userId,
      mentorId: session.mentorId,
      sessionId,
      rating,
      comment: comment || '',
    });

    // Update session status
    sessionModel.updateStatus(sessionId, 'completed');

    return successResponse(res, 201, 'Review created successfully', review);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};


const getMentorReviews = (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = userModel.getMentorById(mentorId);
    if (!mentor) {
      return errorResponse(res, 404, 'Mentor not found');
    }

    const reviews = reviewModel.findByMentorId(mentorId);

    return successResponse(res, 200, 'Mentor reviews retrieved successfully', reviews);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// Delete a review (admin only)
const deleteReview = (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = reviewModel.findById(reviewId);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    reviewModel.delete(reviewId);

    return successResponse(res, 200, 'Review deleted successfully', {});
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  createReview,
  getMentorReviews,
  deleteReview,
};