const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
//const axios = require('axios'); // Import Axios

//console.log("Books ID in general:", books.id);

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
    // Send JSON response with formatted book list data
//    res.send(JSON.stringify(books,null,4));
//});

const getBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(books); // Resolves with the `books` data
            } catch (error) {
                reject(error); // Rejects with an error if something goes wrong
            }
        }, 100); // Simulated delay
    });
};

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    getBooks() // Call `getBooks` which returns a Promise
        .then((booksList) => { // `booksList` is the resolved value from `getBooks`
            res.send(JSON.stringify(booksList, null, 4)); // Send the books data as JSON
        })
        .catch((error) => { // Handle any errors that occurred
            console.error("Error fetching books:", error);
            res.status(500).send("Error retrieving book list.");
        });
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding books's details
//    const isbn = req.params.isbn;
//    res.send(books[isbn]);
// });

const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        // Simulate an async operation with setTimeout (or use real async operations)
        setTimeout(() => {
            // Check if the book exists in the data
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error('Book ISBN not found'));
            }
        }, 100); // Simulate a short delay
    });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    getBookByISBN(isbn)
        .then((book) => {
            res.send(book);
        })
        .catch((error) => {
            console.error("Error fetching book details:", error);
            res.status(404).send({ message: "Book ISBN not found" });
        });
});

const getBooksAsync = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve(Object.values(books)); // Simulate async data fetching
        } catch (error) {
            reject('Failed to fetch books');
        }
    });
};

public_users.get('/author/:authorName', async (req, res) => {
    const authorName = req.params.authorName;

    try {
        // Fetch book data asynchronously
        const bookArray = await getBooksAsync();

        // Find books by the specified author
        const filteredBooks = bookArray.filter(book => book.author.toLowerCase() === authorName.toLowerCase());

        if (filteredBooks.length > 0) {
            res.send(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found by this author." });
        }
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "An error occurred while fetching books." });
    }
});
  
// Get book details based on author
//public_users.get('/author/:authorName',function (req, res) {
    // Retrieve the author parameter from the request URL and send the corresponding books's details
    // const keys = Object.keys(books);
  //  const authorName = req.params.authorName;

    // Get all book objects as an array
    //const bookArray = Object.values(books);

    // Find books by the specified author
    //const filteredBooks = bookArray.filter(book => book.author.toLowerCase() === authorName.toLowerCase());

    //if (filteredBooks.length > 0) {
        // res.json(filteredBooks);
      //  res.send(filteredBooks);
    //} else {
      //  res.status(404).json({ message: "No books found by this author." });
    //}
//});

const getBooksByTitleAsync = (title) => {
    return new Promise((resolve, reject) => {
        try {
            // Get all book objects as an array
            const bookArray = Object.values(books);
            
            // Find books by the specified title
            const filteredBooks = bookArray.filter(book => book.title.toLowerCase() === title.toLowerCase());

            resolve(filteredBooks);
        } catch (error) {
            reject('Failed to fetch books');
        }
    });
};

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        // Fetch book data asynchronously
        const filteredBooks = await getBooksByTitleAsync(title);

        if (filteredBooks.length > 0) {
            res.send(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found with this title." });
        }
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "An error occurred while fetching books." });
    }
});

// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
    // Retrieve the title parameter from the request URL and send the corresponding books's details
    // const keys = Object.keys(books);
    //const title = req.params.title;

    // Get all book objects as an array
   // const bookArray = Object.values(books);

    // Find books by the specified author
   // const filteredBooks = bookArray.filter(book => book.title.toLowerCase() === title.toLowerCase());

  //  if (filteredBooks.length > 0) {
  //      res.send(filteredBooks);
  //  } else {
   //     res.status(404).json({ message: "No books found with this title." });
   // }
//});

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
