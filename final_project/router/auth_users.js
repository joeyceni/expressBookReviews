const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

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
        }, 'access', { expiresIn: 30 });

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
   // Extract isbn parameter from request URL
   const isbn = req.params.isbn;
   let filteredbook = books[isbn];  // Retrieve books object associated with isbn
   if (filteredbook) {  // Check if book details exists
       let review = req.query.review;
       let reviewer = req.session.authorization['username'];
       if (review) {
           filteredbook["reviews"][reviewer] = review;
       }
       res.send(`The book review for ISBN ${isbn} has been added/updated.`);
   } else {
       // Respond if isbn is not found
       res.send("Unable to find this isbn!");
   }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
