const express = require('express');
const { createSessionRequest, acceptSessionRequest, declineSessionRequest, getUserSessions, } = require('../../controllers/sessionController');
const { auth, mentorOnly } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/sessions:
 *   post:
 *     summary: Create a mentorship session request
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mentorId
 *               - title
 *               - description
 *             properties:
 *               mentorId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session request created successfully
 *       400:
 *         description: Mentor ID, title and description are required
 *       404:
 *         description: Mentor not found
 */
router.post('/', auth, createSessionRequest);

/**
 * @swagger
 * /api/v1/sessions:
 *   get:
 *     summary: Get all sessions for the current user
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User sessions retrieved successfully
 */
router.get('/', auth, getUserSessions);

/**
 * @swagger
 * /api/v1/sessions/{sessionId}/accept:
 *   patch:
 *     summary: Accept a mentorship session request
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the session
 *     responses:
 *       200:
 *         description: Session request accepted successfully
 *       403:
 *         description: You are not authorized to accept this session request
 *       404:
 *         description: Session request not found
 */
router.patch('/:sessionId/accept', auth, mentorOnly, acceptSessionRequest);

/**
 * @swagger
 * /api/v1/sessions/{sessionId}/decline:
 *   patch:
 *     summary: Decline a mentorship session request
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the session
 *     responses:
 *       200:
 *         description: Session request declined successfully
 *       403:
 *         description: You are not authorized to decline this session request
 *       404:
 *         description: Session request not found
 */
router.patch('/:sessionId/decline', auth, mentorOnly, declineSessionRequest);

module.exports = router;