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
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not available.");
    }
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(500).json({ message: err }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({ message: err }));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const matchingBooks = Object.values(books).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found by this author.");
    }
  })
  .then(books => res.status(200).json(books))
  .catch(err => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const matchingBooks = Object.values(books).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with this title.");
    }
  })
  .then(books => res.status(200).json(books))
  .catch(err => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book && book.reviews) {
      resolve(book.reviews);
    } else {
      reject("No reviews found for this book.");
    }
  })
  .then(reviews => res.status(200).json(reviews))
  .catch(err => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
