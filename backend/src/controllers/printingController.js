const PrintingRequest = require('../models/PrintingRequest');
const Notification = require('../models/Notification');

// @desc    Submit customized printing run
// @route   POST /api/printing
// @access  Private (Author, Customer, or Admin)
exports.createPrintingRequest = async (req, res, next) => {
  try {
    const { book, bookTitle, quantity, paperQuality, coverFinish, deliveryAddress } = req.body;

    // Rate calculations
    const costPerCopy = coverFinish?.includes('Hardcover') ? 140 : 85;
    const estimatedCost = Number(quantity || 50) * costPerCopy;

    const requestData = {
      author: req.user.id,
      book,
      bookTitle,
      quantity: Number(quantity || 50),
      paperQuality: paperQuality || '70 GSM Natural Shade',
      coverFinish: coverFinish || 'Matte Velvet with Gold Foil',
      deliveryAddress,
      estimatedCost,
      status: 'submitted',
    };

    // Attach PDF URL if uploaded
    if (req.file) {
      requestData.pdfUrl = 'uploads/manuscripts/' + req.file.filename;
    }

    const request = await PrintingRequest.create(requestData);

    await Notification.create({
      recipient: req.user.id,
      title: 'Printing Batch Ordered',
      message: `Your print order for ${quantity} copies of "${bookTitle}" has been scheduled with KA Printworks.`,
      type: 'print_ready',
    });

    res.status(201).json({
      success: true,
      message: 'Print run request registered.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get printing requests
// @route   GET /api/printing
// @access  Private
exports.getPrintingRequests = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.author = req.user.id;
    }

    const requests = await PrintingRequest.find(query)
      .populate('author', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Update printing request status
// @route   PUT /api/printing/:id/status
// @access  Private (Admin only)
exports.updatePrintingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await PrintingRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ success: false, message: 'Print request not found' });

    request.status = status;
    await request.save();

    await Notification.create({
      recipient: request.author,
      title: 'Print Batch Status Update',
      message: `Batch for "${request.bookTitle}" is now: [${status.toUpperCase()}].`,
      type: 'print_ready',
    });

    res.status(200).json({ success: true, message: 'Print status updated', data: request });
  } catch (error) {
    next(error);
  }
};
