const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  return res.send(JSON.stringify(books[isbn],null,4))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let authorBooks = []
  Object.keys(books).forEach(element => {
    if(books[element].author === author){
        authorBooks.push(books[element])
    }
  });

  if(authorBooks.length > 0){
    return res.send(JSON.stringify(authorBooks,null,2))
  }else{
    return res.status(403).json({message: "Cannot find Author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let titleList = []
  Object.keys(books).forEach(element => {
    if(books[element].title === title){
        titleList.push(books[element])
    }
  });

  if(titleList.length > 0){
    return res.send(JSON.stringify(titleList,null,4))
  }else{
    return res.status(403).json({message: "Cannot find Book"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews,null,4))
});

module.exports.general = public_users;
