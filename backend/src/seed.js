const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ka_group_publications');
    console.log('[Seeder] Connected to MongoDB Compass at mongodb://127.0.0.1:27017/ka_group_publications');

    // Clear old data to prevent duplicate keys
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('[Seeder] Cleared old test records');

    // Create default test accounts
    const admin = await User.create({
      name: 'Chief Editorial Admin',
      email: 'admin@kagroup.com',
      password: 'password123',
      role: 'admin',
      bio: 'Head of publication board and catalog curation.',
    });

    const author = await User.create({
      name: 'Julian Vance',
      email: 'author@kagroup.com',
      password: 'password123',
      role: 'author',
      bio: 'Historical fiction and archival literature contributor.',
    });

    const reader = await User.create({
      name: 'Eleanor Gray',
      email: 'customer@kagroup.com',
      password: 'password123',
      role: 'customer',
      bio: 'Avid reader and collector of classical monographs.',
    });

    console.log('[Seeder] Created 3 Users (admin, author, customer)');

    // Seed Books
    const books = [
      {
        title: 'The Cartography of Solitude',
        subtitle: 'Essays on Silence, Art and Cartography',
        isbn: '978-1-95432-001-2',
        author: author._id,
        authorName: 'Evelyn St. Claire',
        genre: 'Philosophy & Literary Arts',
        description: 'A poetic dissection of memory and geography spanning three centuries of personal chronicles.',
        price: 34.50,
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
        status: 'published',
        pages: 312,
        language: 'English',
      },
      {
        title: 'Echoes of the Obsidian Crown',
        subtitle: 'The Chronicles of the High Vanguard: Volume I',
        isbn: '978-1-95432-002-9',
        author: author._id,
        authorName: 'Julian Vance',
        genre: 'Historical Fiction',
        description: 'An epic narrative of political court intrigue in 16th-century Mediterranean trade guilds.',
        price: 42.00,
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
        status: 'published',
        pages: 580,
        language: 'English',
      },
      {
        title: 'Architectures of Tomorrow',
        subtitle: 'Computational Semiotics and Modern Thought',
        isbn: '978-1-95432-003-6',
        author: author._id,
        authorName: 'Dr. Raymond Keene',
        genre: 'Academic & Science',
        description: 'A foundational handbook exploring future interfaces and humanistic computational reasoning.',
        price: 48.90,
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        status: 'published',
        pages: 440,
        language: 'English',
      },
      {
        title: 'Whispers from the Antiquity',
        subtitle: 'Restoring Forgotten Classical Epistles',
        isbn: '978-1-95432-004-3',
        author: author._id,
        authorName: 'Helena Rostov',
        genre: 'Classics & Anthology',
        description: 'Annotated translations of unpublished parchment letters uncovered in Alexandria.',
        price: 29.99,
        coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&q=80&w=600',
        status: 'published',
        pages: 288,
        language: 'English',
      },
    ];

    await Book.insertMany(books);
    console.log(`[Seeder] Seeded ${books.length} Books into collection "books"`);
    console.log('[Seeder] SUCCESS! You can open MongoDB Compass and inspect "ka_group_publications" database.');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
