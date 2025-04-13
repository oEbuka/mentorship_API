const express = require('express');
const { createReview, getMentorReviews, deleteReview,} = require('../../controllers/reviewController');
const { auth, adminOnly } = require('../../middleware/auth');

const router = express.Router();

// src/routes/v1/reviewRoutes.js (continued)
/**
 * @swagger
 * /api/v1/reviews:
 *   post:
 *     summary: Create a review after a mentorship session
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - rating
 *             properties:
 *               sessionId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Session ID and rating are required
 *       403:
 *         description: You can only review sessions you participated in
 *       404:
 *         description: Session not found
 */
router.post('/', auth, createReview);

/**
 * @swagger
 * /api/v1/reviews/mentors/{mentorId}:
 *   get:
 *     summary: Get reviews for a specific mentor
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: mentorId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the mentor
 *     responses:
 *       200:
 *         description: Mentor reviews retrieved successfully
 *       404:
 *         description: Mentor not found
 */
router.get('/mentors/:mentorId', getMentorReviews);

/**
 * @swagger
 * /api/v1/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Access denied! Admin only
 *       404:
 *         description: Review not found
 */
router.delete('/:reviewId', auth, adminOnly, deleteReview);

module.exports = router;