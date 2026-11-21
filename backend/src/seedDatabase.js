const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load all models
const User = require('./models/User');
const Author = require('./models/Author');
const Category = require('./models/Category');
const Book = require('./models/Book');
const PublishingPackage = require('./models/PublishingPackage');
const PublishingRequest = require('./models/PublishingRequest');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Review = require('./models/Review');
const Wishlist = require('./models/Wishlist');
const Cart = require('./models/Cart');
const PrintingRequest = require('./models/PrintingRequest');
const Notification = require('./models/Notification');
const Address = require('./models/Address');

dotenv.config();

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ka_publications';
    console.log(`Connecting to MongoDB Compass at: ${uri}`);
    await mongoose.connect(uri);
    console.log('Successfully connected to ka_publications database!');

    // Clean existing records to prevent unique index conflicts
    await Promise.all([
      User.deleteMany({}),
      Author.deleteMany({}),
      Category.deleteMany({}),
      Book.deleteMany({}),
      PublishingPackage.deleteMany({}),
      PublishingRequest.deleteMany({}),
      Order.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      Wishlist.deleteMany({}),
      Cart.deleteMany({}),
      PrintingRequest.deleteMany({}),
      Notification.deleteMany({}),
      Address.deleteMany({}),
    ]);
    console.log('Cleared existing collections for clean seed.');

    // 1. Seed Categories
    const categories = await Category.insertMany([
      { name: 'Philosophy & Literary Arts', description: 'Monographs, philosophical treatises, and essays.' },
      { name: 'Historical Fiction', description: 'Historical epics, chronicles, and period literature.' },
      { name: 'Academic & Science', description: 'Peer-reviewed treatises, university texts, and research.' },
      { name: 'Classics & Anthology', description: 'Preserved classical manuscripts and poetical anthologies.' },
      { name: 'Poetry & Epistles', description: 'Lyrical anthologies and personal epistolary collections.' },
    ]);
    console.log(`✓ Seeded ${categories.length} Categories`);

    // 2. Seed Users
    // Admin (Created securely via seeder, cannot be chosen on public form)
    const admin = await User.create({
      name: 'Chief Editorial Admin',
      email: 'admin@kagroup.com',
      password: 'password123',
      role: 'admin',
      bio: 'Editorial Director and Chief Curator at KA Group of Publications.',
      phoneNumber: '+91 98765 43210',
    });

    // Author
    const author = await User.create({
      name: 'Julian Vance',
      email: 'author@kagroup.com',
      password: 'password123',
      role: 'author',
      bio: 'Fellow in Historical Narrative and classical translation.',
      phoneNumber: '+91 98765 43211',
    });

    // Customer / Reader
    const customer = await User.create({
      name: 'Eleanor Gray',
      email: 'customer@kagroup.com',
      password: 'password123',
      role: 'customer',
      bio: 'Collector of antiquarian folios and modern philosophical essays.',
      phoneNumber: '+91 98765 43212',
    });
    console.log('✓ Seeded 3 Core Users (Admin, Author, Customer)');

    // 3. Seed Author Profile
    const authorProfile = await Author.create({
      user: author._id,
      penName: 'Julian Vance',
      genres: ['Historical Fiction', 'Classics & Anthology'],
      biography: 'Award-winning historical fiction novelist based in Alexandria study.',
      totalPublishedBooks: 2,
      totalRoyaltiesAccrued: 24800,
      isVerified: true,
    });
    console.log('✓ Seeded Author Profile');

    // 4. Seed Publishing Packages (Like JEC reference)
    const packages = await PublishingPackage.insertMany([
      {
        name: 'Standard Scholar',
        tier: 'Standard',
        price: 12000,
        features: ['ISBN Allocation', 'Custom Cover Design', 'Amazon/Flipkart Syndication', '10 Author Copies'],
        royaltyPercentage: 100,
        complimentaryCopies: 10,
      },
      {
        name: 'Royal Archive Hardbound',
        tier: 'Gold',
        price: 28000,
        features: ['ISBN & Barcode', 'Hardcover Velvet Finish', 'Editorial Proofreading', 'Global Distribution', '25 Author Copies'],
        royaltyPercentage: 100,
        complimentaryCopies: 25,
      },
    ]);
    console.log(`✓ Seeded ${packages.length} Publishing Packages`);

    // 5. Seed Books
    const books = await Book.insertMany([
      {
        title: 'The Cartography of Solitude',
        subtitle: 'Essays on Silence, Art and Cartography',
        isbn: '978-93-5432-001-2',
        author: author._id,
        authorName: 'Evelyn St. Claire',
        category: categories[0]._id,
        genre: 'Philosophy & Literary Arts',
        description: 'A poetic dissection of memory and geography spanning three centuries of personal chronicles.',
        price: 499,
        stock: 120,
        pages: 312,
        format: 'Paperback',
        status: 'published',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
        ratingAverage: 4.9,
        totalReviews: 14,
      },
      {
        title: 'Echoes of the Obsidian Crown',
        subtitle: 'The Chronicles of the High Vanguard: Volume I',
        isbn: '978-93-5432-002-9',
        author: author._id,
        authorName: 'Julian Vance',
        category: categories[1]._id,
        genre: 'Historical Fiction',
        description: 'An epic narrative of political court intrigue in 16th-century Mediterranean trade guilds.',
        price: 650,
        stock: 80,
        pages: 580,
        format: 'Hardcover',
        status: 'published',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
        ratingAverage: 4.8,
        totalReviews: 22,
      },
      {
        title: 'Architectures of Tomorrow',
        subtitle: 'Computational Semiotics and Modern Thought',
        isbn: '978-93-5432-003-6',
        author: author._id,
        authorName: 'Dr. Raymond Keene',
        category: categories[2]._id,
        genre: 'Academic & Science',
        description: 'A foundational handbook exploring future interfaces and humanistic computational reasoning.',
        price: 799,
        stock: 50,
        pages: 440,
        format: 'Hardcover',
        status: 'published',
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        ratingAverage: 5.0,
        totalReviews: 8,
      },
      {
        title: 'Whispers from the Antiquity',
        subtitle: 'Restoring Forgotten Classical Epistles',
        isbn: '978-93-5432-004-3',
        author: author._id,
        authorName: 'Helena Rostov',
        category: categories[3]._id,
        genre: 'Classics & Anthology',
        description: 'Annotated translations of unpublished parchment letters uncovered in Alexandria.',
        price: 399,
        stock: 90,
        pages: 288,
        format: 'Paperback',
        status: 'published',
        coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&q=80&w=600',
        ratingAverage: 4.7,
        totalReviews: 11,
      },
    ]);
    console.log(`✓ Seeded ${books.length} Books`);

    // 6. Seed Address
    const address = await Address.create({
      user: customer._id,
      fullName: 'Eleanor Gray',
      phone: '+91 98765 43212',
      streetAddress: '42 Library Boulevard, Literary Enclave',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411001',
      country: 'India',
      isDefault: true,
    });
    console.log('✓ Seeded User Address');

    // 7. Seed Order & Payment
    const order = await Order.create({
      orderNumber: 'KA-ORD-982104-101',
      user: customer._id,
      items: [
        {
          book: books[0]._id,
          title: books[0].title,
          quantity: 1,
          price: books[0].price,
          format: books[0].format,
        },
      ],
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      subTotal: 499,
      shippingFee: 0,
      totalAmount: 499,
      paymentStatus: 'paid',
      orderStatus: 'dispatched',
      trackingNumber: 'INDPOST9823419IN',
    });

    await Payment.create({
      order: order._id,
      user: customer._id,
      paymentId: 'PAY-ONLINE-9821049',
      amount: 499,
      currency: 'INR',
      paymentMethod: 'UPI',
      status: 'completed',
    });
    console.log('✓ Seeded Order & Payment records');

    // 8. Seed Publishing Request
    await PublishingRequest.create({
      author: author._id,
      authorName: author.name,
      title: 'Vanguard of the Aegean Trade Guilds',
      genre: 'Historical Fiction',
      packageSelected: packages[1]._id,
      abstract: 'An inquest into maritime merchant treaties during the 15th century Venetian expansion.',
      targetWordCount: 65000,
      status: 'under_review',
      editorialFeedback: 'Passed first copyedit gate. Sample chapters under historical review.',
      assignedEditor: admin._id,
    });
    console.log('✓ Seeded Publishing Request');

    // 9. Seed Printing Request
    await PrintingRequest.create({
      author: author._id,
      book: books[1]._id,
      bookTitle: books[1].title,
      quantity: 50,
      paperQuality: '80 GSM Royal Bond',
      coverFinish: 'Hardcover Cloth Bound',
      deliveryAddress: 'Chancery Lane 12, Mumbai, MH',
      estimatedCost: 7000,
      status: 'in_printing',
    });
    console.log('✓ Seeded Printing Request');

    // 10. Seed Reviews
    await Review.create({
      user: customer._id,
      userName: customer.name,
      book: books[0]._id,
      rating: 5,
      title: 'Monumental work of philosophical prose',
      comment: 'The typography, binding quality, and depth of contemplation make this edition a treasure.',
      isVerifiedPurchase: true,
    });
    console.log('✓ Seeded Review');

    // 11. Seed Wishlist & Cart
    await Wishlist.create({
      user: customer._id,
      books: [books[1]._id, books[2]._id],
    });

    await Cart.create({
      user: customer._id,
      items: [
        {
          book: books[3]._id,
          quantity: 1,
          format: 'Paperback',
          price: books[3].price,
        },
      ],
      totalAmount: books[3].price,
    });
    console.log('✓ Seeded Wishlist and Cart');

    // 12. Seed Notifications
    await Notification.insertMany([
      {
        recipient: author._id,
        title: 'Editorial Gate Notice',
        message: 'Your manuscript "Vanguard of the Aegean Trade Guilds" has entered second copyedit review.',
        type: 'publishing_status',
        read: false,
      },
      {
        recipient: customer._id,
        title: 'Dispatch Notice: KA-ORD-982104-101',
        message: 'Your volume "The Cartography of Solitude" has shipped via India Post.',
        type: 'order_update',
        read: false,
      },
    ]);
    console.log('✓ Seeded Notifications');

    console.log('===============================================================');
    console.log(' ALL 14 COLLECTIONS CREATED AND POPULATED IN ka_publications !');
    console.log('===============================================================');
    process.exit(0);
  } catch (error) {
    console.error('[Database Seeder Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
