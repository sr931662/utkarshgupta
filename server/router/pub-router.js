// router/pub-router.js
const express = require('express');
const router = express.Router();
const pubController = require('../controller/pub-controller');
const authController = require('../controller/auth-controller');

// File upload middleware
const { uploadPublicationFile } = pubController;

// Public routes
router.get('/', pubController.getAllPublications);
router.get('/counts', pubController.getPublicationCounts);
router.get('/featured', pubController.getFeaturedPublications);
router.get('/:id', pubController.getPublication);

// Protected routes (require authentication)
router.use(authController.protect);

// Admin-only routes
router.use(authController.restrictTo('admin'));

router.post('/', uploadPublicationFile, pubController.createPublication);
router.patch('/:id', uploadPublicationFile, pubController.updatePublication);
router.delete('/:id', pubController.deletePublication);

module.exports = router;