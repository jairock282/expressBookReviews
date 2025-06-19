const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = "your_jwt_secret_key";
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Set session data
  req.session.authorization = {
    username: user.username,
    accessToken: jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' })
  };

  console.log("Session on login:", req.session);

  return res.status(200).json({ message: "Login successful", token: req.session.authorization.accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session?.authorization?.username;
  console.log("Session in review route:", req.session);


  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review query is required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  console.log(JSON.stringify(books[isbn].reviews[username]));
  return res.status(200).json({ message: "Review successfully posted/updated." });

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;
  
    if (!username) {
      return res.status(403).json({ message: "User not authenticated" });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "You have not posted a review for this book." });
    }
  
    delete book.reviews[username];
  
    return res.status(200).json({ message: "Your review has been deleted successfully." });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
