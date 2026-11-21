const mongoose = require('mongoose');
const Book = require('../models/Book');
const Category = require('../models/Category');

// @desc    Get all published books (supports filter by category, search, sorting)
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    const { category, search, genre, sort, limit = 20, page = 1 } = req.query;
    let query = { status: 'published' };

    const catFilter = category || genre;
    if (catFilter && catFilter !== 'All') {
      const isObjectId = mongoose.Types.ObjectId.isValid(catFilter) && String(new mongoose.Types.ObjectId(catFilter)) === catFilter;
      if (isObjectId) {
        query.category = catFilter;
      } else {
        const catDoc = await Category.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${catFilter.trim()}$`, 'i') } },
            { slug: catFilter.trim().toLowerCase() }
          ]
        });
        if (catDoc) {
          query.$or = [
            { category: catDoc._id },
            { genre: { $regex: new RegExp(`^${catFilter.trim()}$`, 'i') } }
          ];
        } else {
          query.genre = { $regex: new RegExp(`^${catFilter.trim()}$`, 'i') };
        }
      }
    }

    if (search) {
      const searchConditions = [
        { title: { $regex: search, $options: 'i' } },
        { authorName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { ratingAverage: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      books, // Provide both .books and .data for consistent frontend compatibility
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('category', 'name slug description')
      .populate('author', 'name email avatar bio');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in publication repository.',
      });
    }

    res.status(200).json({
      success: true,
      book,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Publish a book
// @route   POST /api/books
// @access  Private (Author or Admin)
exports.createBook = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      isbn,
      category,
      genre,
      description,
      price,
      pages,
      language,
      coverImage,
      format,
    } = req.body;

    // Authors publish with their account as author reference; Admins can override
    const authorId = req.user.role === 'author' ? req.user.id : req.body.author || req.user.id;
    const authorName = req.user.role === 'author' ? req.user.name : req.body.authorName || req.user.name;

    // Automatically resolve Category ObjectId if name or slug passed
    let finalCategory = category;
    if (finalCategory && !mongoose.Types.ObjectId.isValid(finalCategory)) {
      const catDoc = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${String(finalCategory).trim()}$`, 'i') } },
          { slug: String(finalCategory).trim().toLowerCase() }
        ]
      });
      if (catDoc) finalCategory = catDoc._id;
      else finalCategory = undefined;
    } else if (!finalCategory && genre) {
      const catDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${String(genre).trim()}$`, 'i') }
      });
      if (catDoc) finalCategory = catDoc._id;
    }

    const book = await Book.create({
      title,
      subtitle,
      isbn,
      author: authorId,
      authorName,
      category: finalCategory,
      genre: genre || 'General Literature',
      description,
      price: Number(price) || 29.99,
      pages: Number(pages) || 200,
      language: language || 'English',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
      format: format || 'Paperback',
      status: 'published', // Admin always publishes directly
      isBestseller: req.body.isBestseller || false,
      isNewRelease: req.body.isNewRelease || false,
      stock: req.body.stock || 50,
    });

    res.status(201).json({
      success: true,
      message:
        req.user.role === 'admin'
          ? 'Book successfully inducted into public catalogue.'
          : 'Book draft submitted to editorial board for review.',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Private (Admin or Book Author)
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check ownership
    if (req.user.role !== 'admin' && book.author?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own publication manuscripts.',
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Book record updated successfully.',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin only)
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    await book.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Book record removed from catalog.',
    });
  } catch (error) {
    next(error);
  }
};
