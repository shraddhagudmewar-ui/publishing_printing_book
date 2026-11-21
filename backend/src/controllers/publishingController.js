const PublishingRequest = require('../models/PublishingRequest');
const Notification = require('../models/Notification');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Submit manuscript publishing request
// @route   POST /api/publishing
// @access  Private (Author or Customer)
exports.createPublishingRequest = async (req, res, next) => {
  try {
    const { title, genre, packageSelected, manuscriptFileUrl, sampleChapterUrl, abstract, targetWordCount } = req.body;

    const request = await PublishingRequest.create({
      author: req.user.id,
      authorName: req.user.name,
      title,
      genre,
      packageSelected,
      manuscriptFileUrl,
      sampleChapterUrl,
      abstract,
      targetWordCount: targetWordCount || 45000,
      status: 'pending',
    });

    // Notify author
    await Notification.create({
      recipient: req.user.id,
      title: 'Manuscript Inquest Received',
      message: `Your manuscript "${title}" has been registered into the KA Group editorial desk.`,
      type: 'publishing_status',
    });

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    for (const adm of admins) {
      await Notification.create({
        recipient: adm._id,
        title: `New Manuscript: "${title}"`,
        message: `Author ${req.user.name} submitted "${title}" (${genre}) for editorial review.`,
        type: 'publishing_status',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Publishing proposal transmitted to editorial board.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get publishing requests (Author sees own, Admin sees all)
// @route   GET /api/publishing
// @access  Private
exports.getPublishingRequests = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.author = req.user.id;
    }

    const requests = await PublishingRequest.find(query)
      .populate('author', 'name email avatar phoneNumber')
      .populate('packageSelected', 'name tier price royaltyPercentage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin review and status update (under_review, accepted, contract_sent, rejected)
//          If accepted / published, optionally creates a published Book in catalog!
// @route   PUT /api/publishing/:id/review
// @access  Private (Admin only)
exports.reviewPublishingRequest = async (req, res, next) => {
  try {
    const { status, editorialFeedback, publishToStore, price, isbn, stock, coverImage } = req.body;
    const request = await PublishingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Publishing request not found' });
    }

    request.status = status || request.status;
    request.editorialFeedback = editorialFeedback || request.editorialFeedback;
    request.assignedEditor = req.user.id;
    await request.save();

    // If approved and publishToStore requested, create Book in store
    let publishedBook = null;
    if (status === 'accepted' || publishToStore) {
      publishedBook = await Book.create({
        title: request.title,
        author: request.author,
        authorName: request.authorName,
        genre: request.genre || 'General Literature',
        description: request.abstract,
        price: price || 349,
        stock: stock || 50,
        isbn: isbn || '978-81-9' + Math.floor(1000000 + Math.random() * 9000000),
        coverImage: coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
        status: 'published',
        format: 'Paperback',
        pages: 240,
        language: 'English',
      });
    }

    // Send notification to author
    await Notification.create({
      recipient: request.author,
      title: `Editorial Decision: "${request.title}"`,
      message: `Status: [${request.status.toUpperCase()}]. Notes: ${editorialFeedback || 'Editorial board has completed evaluation.'}${publishedBook ? ' Your title is now live in the bookstore!' : ''}`,
      type: 'publishing_status',
    });

    res.status(200).json({
      success: true,
      message: `Editorial decision saved.${publishedBook ? ' Book published to bookstore!' : ''}`,
      data: request,
      publishedBook,
    });
  } catch (error) {
    next(error);
  }
};
