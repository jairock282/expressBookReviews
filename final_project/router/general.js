const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // Register new user
  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully." });

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  axios.get('http://localhost:5000/books/internal')
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch(error => {
    res.status(500).json({ message: "Failed to fetch books." });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  axios.get('http://localhost:5000/books/internal')
    .then(response => {
      const books = response.data;
      const book = books[isbn];

      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to fetch book data." });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  axios.get('http://localhost:5000/books/internal')
    .then(response => {
      const books = response.data;
      const matchingBooks = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
      );

      if (matchingBooks.length > 0) {
        res.status(200).json(matchingBooks);
      } else {
        res.status(404).json({ message: "No books found by this author." });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to fetch books." });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  axios.get('http://localhost:5000/books/internal')
    .then(response => {
      const books = response.data;
      const matchingBooks = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
      );

      if (matchingBooks.length > 0) {
        res.status(200).json(matchingBooks);
      } else {
        res.status(404).json({ message: "No books found with this title." });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to fetch books." });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  axios.get('http://localhost:5000/books/internal')
    .then(response => {
      const books = response.data;
      const book = books[isbn];

      if (book && book.reviews) {
        res.status(200).json(book.reviews);
      } else {
        res.status(404).json({ message: "No reviews found for this book." });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to fetch review data." });
    });
});

module.exports.general = public_users;
