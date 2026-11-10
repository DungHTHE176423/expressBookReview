const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchedBooks = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchedBooks.push(books[key]);
    }
  }
  if (matchedBooks.length > 0) {
    res.send(JSON.stringify(matchedBooks, null, 4));
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchedBooks = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchedBooks.push(books[key]);
    }
  }
  if (matchedBooks.length > 0) {
    res.send(JSON.stringify(matchedBooks, null, 4));
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
