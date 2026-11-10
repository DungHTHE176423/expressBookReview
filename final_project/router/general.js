const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });    
    }
  } 
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the book list available in the shop using Axios / Async-Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using Axios / Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});
  
// Task 12: Get book details based on author using Axios / Async-Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        const matchedBooks = [];
        for (let key in books) {
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchedBooks.push(books[key]);
          }
        }
        if (matchedBooks.length > 0) {
          resolve(matchedBooks);
        } else {
          reject({ status: 404, message: "No books found by this author" });
        }
      });
    };

    const result = await getBooksByAuthor();
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

// Task 13: Get all books based on title using Axios / Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    const matchedBooks = [];
    for (let key in books) {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchedBooks.push(books[key]);
      }
    }
    if (matchedBooks.length > 0) {
      resolve(matchedBooks);
    } else {
      reject({ status: 404, message: "No books found with this title" });
    }
  });

  getBooksByTitle
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
