const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send JSON response with formatted book list data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding books's details
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:authorName',function (req, res) {
    // Retrieve the author parameter from the request URL and send the corresponding books's details
    // const keys = Object.keys(books);
    const authorName = req.params.authorName;

    // Get all book objects as an array
    const bookArray = Object.values(books);

    // Find books by the specified author
    const filteredBooks = bookArray.filter(book => book.author.toLowerCase() === authorName.toLowerCase());

    if (filteredBooks.length > 0) {
        // res.json(filteredBooks);
        res.send(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found by this author." });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve the title parameter from the request URL and send the corresponding books's details
    // const keys = Object.keys(books);
    const title = req.params.title;

    // Get all book objects as an array
    const bookArray = Object.values(books);

    // Find books by the specified author
    const filteredBooks = bookArray.filter(book => book.title.toLowerCase() === title.toLowerCase());

    if (filteredBooks.length > 0) {
        res.send(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found with this title." });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);

    if (books[isbn]) {
        const book = books[isbn];

        res.send(book.reviews)

    } else {
        res.status(404).json({ message: "No reviews found for this ISBN." });
    }
});

module.exports.general = public_users;
