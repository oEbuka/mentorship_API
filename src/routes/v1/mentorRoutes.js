const express = require('express');
const { changeMentorStatus, getAllMentors, getMentorById } = require('../../controllers/mentorController');
const { auth, adminOnly } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/mentors:
 *   get:
 *     summary: Get all mentors
 *     tags: [Mentors]
 *     responses:
 *       200:
 *         description: Mentors retrieved successfully
 */
router.get('/', getAllMentors);

/**
 * @swagger
 * /api/v1/mentors/{mentorId}:
 *   get:
 *     summary: Get a specific mentor
 *     tags: [Mentors]
 *     parameters:
 *       - in: path
 *         name: mentorId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the mentor
 *     responses:
 *       200:
 *         description: Mentor retrieved successfully
 *       404:
 *         description: Mentor not found
 */
router.get('/:mentorId', getMentorById);

/**
 * @swagger
 * /api/v1/mentors/{userId}:
 *   patch:
 *     summary: Change a user to a mentor (Admin only)
 *     tags: [Mentors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to make a mentor
 *     responses:
 *       200:
 *         description: User set as mentor successfully
 *       400:
 *         description: User is already a mentor
 *       403:
 *         description: Access denied! Admin only
 *       404:
 *         description: User not found
 */
router.patch('/:userId', auth, adminOnly, changeMentorStatus);

module.exports = router;