const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.json(books);  // Task 2
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get all books based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const result = {};
    for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
            result[isbn] = books[isbn];
        }
    }
    if (Object.keys(result).length > 0) {
        return res.json(result);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const result = {};
    for (let isbn in books) {
        if (books[isbn].title.toLowerCase() === title) {
            result[isbn] = books[isbn];
        }
    }
    if (Object.keys(result).length > 0) {
        return res.json(result);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
