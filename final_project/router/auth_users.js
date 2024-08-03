const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

//console.log("Books ID in auth_users:", books.id);

let users = [];

const isValid = (username)=>{ //returns boolean
    for (var user in users) {
      if (user["username"]===username) {
          return true;
      }
  }
    return false;
  }

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Retrieve all books and their reviews for the user
regd_users.get("/auth/books", (req, res) => {
    // Check if user is authenticated
    if (req.session.authorization) {
        res.send(JSON.stringify(books,null,4));
    } else {
        res.status(401).send("User not authenticated.");
    }
});

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 3600 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //console.log("Books before update:", JSON.stringify(books, null, 2));

    if (req.session.authorization) {
        const isbn = req.params.isbn;
        const filteredbook = books[isbn];  // Retrieve books object associated with isbn

        if (filteredbook) {
            const review = req.query.review;
            const reviewer = req.session.authorization['username'];

            if (review && review.trim()) {  // Check if review is not empty or just whitespace
                filteredbook["reviews"][reviewer] = review;
                //console.log(`Review added by ${reviewer}: ${review}`);
                res.send(`The book review for ISBN ${isbn} has been added/updated.`);
            } else {
                res.status(400).send("Review cannot be empty.");
            }

            //console.log("Books after update:", JSON.stringify(books, null, 2));
        } else {
            res.status(404).send("Unable to find this ISBN!");
        }
    } else {
        res.status(401).send("User not authenticated.");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Ensure the user is authenticated
    if (req.session.authorization) {
        const isbn = req.params.isbn; // Extract ISBN from request parameters
        const filteredBook = books[isbn]; // Retrieve the book object using ISBN

        if (filteredBook) { // Check if the book exists
            const reviewer = req.session.authorization['username']; // Get the current user's username
            
            // Check if the review exists for the current user
            if (filteredBook.reviews[reviewer]) {
                delete filteredBook.reviews[reviewer]; // Delete the review
                res.send(`The review for ISBN ${isbn} has been deleted.`);
            } else {
                res.status(404).send("Review not found for the user.");
            }
        } else {
            res.status(404).send("Unable to find this ISBN.");
        }
    } else {
        res.status(401).send("User not authenticated.");
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
