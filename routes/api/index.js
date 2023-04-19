const router = require('express').Router();
const userRoutes = require('./UserRoutes');
const thoughtRoutes = require('./ThoughtRoutes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;