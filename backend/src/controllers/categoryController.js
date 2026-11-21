const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    
    // Auto-seed baseline categories if collection is completely empty
    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Fiction & Literature', slug: 'fiction-literature', description: 'Novels, anthologies, contemporary and narrative prose.', icon: 'BookOpen' },
        { name: 'Historical Fiction', slug: 'historical-fiction', description: 'Period epics, archival chronicles, and historical narratives.', icon: 'BookOpen' },
        { name: 'Philosophy & Literary Arts', slug: 'philosophy-literary-arts', description: 'Aesthetic treatises, philosophical monographs, and essays.', icon: 'BookOpen' },
        { name: 'Poetry & Classical Verse', slug: 'poetry-classical-verse', description: 'Poetic verses, rhythmic anthologies, and literary ghazals.', icon: 'BookOpen' },
        { name: 'Academic & Research', slug: 'academic-research', description: 'Scholarly papers, peer-reviewed texts, and university guides.', icon: 'BookOpen' },
        { name: 'Memoirs & Biographies', slug: 'memoirs-biographies', description: 'Personal chronicles, memoirs, and autobiographical narratives.', icon: 'BookOpen' },
      ];
      try {
        await Category.insertMany(defaultCategories, { ordered: false });
        categories = await Category.find().sort({ name: 1 });
      } catch (e) {
        // In case of parallel race condition
        categories = await Category.find().sort({ name: 1 });
      }
    }

    res.status(200).json({ 
      success: true, 
      count: categories.length, 
      categories, 
      data: categories 
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const slug = req.body.slug || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } },
        { slug: slug },
      ],
    });

    if (existing) {
      return res.status(400).json({ success: false, message: `Category "${trimmedName}" already exists` });
    }

    const category = await Category.create({
      name: trimmedName,
      slug,
      description: description ? description.trim() : '',
      icon: icon || 'BookOpen',
    });

    res.status(201).json({ 
      success: true, 
      message: 'Category added successfully', 
      category, 
      data: category 
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, message: 'Category updated', category, data: category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};
