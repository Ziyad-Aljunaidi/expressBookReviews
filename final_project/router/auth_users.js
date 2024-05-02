const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review
  const book = books[isbn]
  const username = req.session.authorization.username
  if(books[isbn].reviews > 0){
    if(book.reviews[username].length > 0){
        book.reviews[username] = {
            review:req.body.review
        }
    }
  }else{
   book.reviews[username] = {
        review:req.body.review
    }
    books[isbn].reviews[username].review= review
    console.log("hehe")
  }

  
  return res.status(200).json({message: "Your review is added"});
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{
    const isbn = req.params.isbn;
    const username = req.session.authorization.username
    const reviews = books[isbn].reviews

    try {
        delete books[isbn].reviews[username]
        console.log(books[isbn].reviews[username])
    } catch (error) {
        console.log(error)
        return res.status(403).json({message: "you don't have any reviews on this Book"})
       
    }
    return res.status(200).json({message: ` your review is now deleted`, reviews:reviews})
    // ${books[isbn].reviews[username]}
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
