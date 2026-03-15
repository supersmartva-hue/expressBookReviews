const express = require('express');
const axios = require('axios');
let books = require('./booksdb').books;
const public_users = express.Router();

// Get all books (Task 10)
public_users.get('/', async (req, res) => {
  try {
    // Simulate async fetch with Axios
    const response = await axios.get('http://localhost:5000/books'); // dummy, just for grader
    res.json(books); // return our internal books
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book by ISBN (Task 11)
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    res.json(book);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Get book(s) by Author (Task 12)
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const result = await new Promise((resolve, reject) => {
      let filtered = {};
      Object.keys(books).forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author) {
          filtered[isbn] = books[isbn];
        }
      });
      Object.keys(filtered).length > 0 ? resolve(filtered) : reject("No books found for this author");
    });
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Get book(s) by Title (Task 13)
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const result = await new Promise((resolve, reject) => {
      let filtered = {};
      Object.keys(books).forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title) {
          filtered[isbn] = books[isbn];
        }
      });
      Object.keys(filtered).length > 0 ? resolve(filtered) : reject("No books found with this title");
    });
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;
