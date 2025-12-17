const express = require('express');
const mongoose = require('mongoose');
const Book = require('../Models/Store');
const AboutPublisher = require('../Models/AboutPublisher');

const Bookrouter = express.Router();

/* =========================
   AUTHOR (SINGLETON)
========================= */

// Create author (ONLY ONCE)


// Get author (singleton)
Bookrouter.get('/getauthor', async (req, res) => {
  try {
    const author = await AboutPublisher.findOne();
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update author
Bookrouter.put('/author', async (req, res) => {
  try {
    const author = await AboutPublisher.findOneAndUpdate(
      {},
      req.body,
      { new: true, runValidators: true }
    );

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(author);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});



/* =========================
   BOOK ROUTES
========================= */

// GET all books
Bookrouter.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ publishTime: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new book
Bookrouter.post('/', async (req, res) => {
  try {
    const { _id, ...bookData } = req.body;
    const newBook = new Book(bookData);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
});

// ⚠️ DYNAMIC ROUTES MUST BE LAST ⚠️

// GET book by ID
Bookrouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  res.json(book);
});

// UPDATE book
Bookrouter.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  const { _id, ...updateData } = req.body;

  const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) return res.status(404).json({ message: 'Book not found' });

  res.json(updatedBook);
});

// DELETE book
Bookrouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  await Book.findByIdAndDelete(id);
  res.json({ message: 'Book deleted' });
});

module.exports = Bookrouter;
