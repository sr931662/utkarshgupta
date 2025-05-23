// controllers/pub-controller.js
const Publication = require('../db/pubSchema');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../client/src/assets/media/publications');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF, JPEG, and PNG files are allowed!', 400), false);
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

exports.uploadPublicationFile = upload.single('file');

// Helper to process publication data
const processPublicationData = (req) => {
  const data = { ...req.body };
  
  // Convert comma-separated authors to array if needed
  if (typeof data.authors === 'string') {
    data.authors = data.authors.split(',').map(author => author.trim());
  }
  
  // Handle file upload
  if (req.file) {
    data.mediaUrl = `/assets/media/publications/${req.file.filename}`;
  }
  
  return data;
};

// Get all publications
exports.getAllPublications = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Publication.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const publications = await features.query;

  res.status(200).json({
    status: 'success',
    results: publications.length,
    data: {
      publications
    }
  });
});

// Get a single publication
exports.getPublication = catchAsync(async (req, res, next) => {
  const publication = await Publication.findById(req.params.id);
  
  if (!publication) {
    return next(new AppError('No publication found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      publication
    }
  });
});

// Create a new publication
exports.createPublication = catchAsync(async (req, res, next) => {
  const data = processPublicationData(req);
  
  const publication = await Publication.create(data);

  res.status(201).json({
    status: 'success',
    data: {
      publication
    }
  });
});

// Update a publication
exports.updatePublication = catchAsync(async (req, res, next) => {
  const data = processPublicationData(req);
  
  const publication = await Publication.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true
  });

  if (!publication) {
    return next(new AppError('No publication found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      publication
    }
  });
});

// Delete a publication
exports.deletePublication = catchAsync(async (req, res, next) => {
  const publication = await Publication.findByIdAndDelete(req.params.id);
  
  if (!publication) {
    return next(new AppError('No publication found with that ID', 404));
  }

  // Delete associated file if exists
  if (publication.mediaUrl) {
    const filePath = path.join(__dirname, '../../client', publication.mediaUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get publication counts by type
exports.getPublicationCounts = catchAsync(async (req, res, next) => {
  const counts = await Publication.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      counts
    }
  });
});

// Get featured publications
exports.getFeaturedPublications = catchAsync(async (req, res, next) => {
  const publications = await Publication.find({ isFeatured: true })
    .sort('-createdAt')
    .limit(5);

  res.status(200).json({
    status: 'success',
    results: publications.length,
    data: {
      publications
    }
  });
});