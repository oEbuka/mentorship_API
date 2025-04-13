const express = require('express');
const authRoutes = require('./authRoutes');
const mentorRoutes = require('./mentorRoutes');
const sessionRoutes = require('./sessionRoutes');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/mentors', mentorRoutes);
router.use('/sessions', sessionRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;