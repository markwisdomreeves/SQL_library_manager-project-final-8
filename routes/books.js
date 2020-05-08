const express = require('express');
const router = express.Router();
const Books = require('../models').Books;

// the asyncErrorHandler function is used to validate all routes
function asyncErrorHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

// Getting all book details from the database to display on the page
router.get('/', asyncErrorHandler(async (req, res) => {
  const books = await Books.findAll({ order: [["title", "ASC"]] });
  res.render("books/index", { books });
}));

// Create a new book
router.get('/new', (req, res) => {
  res.render("books/new-book", { book: {}});
});

// Post the newly created book and details to the database
router.post('/new', asyncErrorHandler(async (req, res) => {
  let book;
  try{
    book = await Books.create(req.body);
    res.redirect("/books/" + book.id);
  }catch(error){
    if(error.name === 'SequelizeValidationError'){
      book = await Books.build(req.body);
      res.render("books/new-book", {book, errors: error.errors})
    }else{
      throw error;
    }
  }
 
}));


// Update book by getting a single book detalis by it's ID
router.get("/:id", asyncErrorHandler(async (req, res) => {
  const book = await Books.findByPk(req.params.id);
  if(book){
    res.render("books/update-book", { book, title: book.title });
  }else{
    res.render('books/page-not-found');
  } 
}));

// Update book by posting a single updated book details to a database
router.post('/:id', asyncErrorHandler(async (req, res) => {
  let book;
  try{
    book = await Books.findByPk(req.params.id);
    if(book){
      await book.update(req.body);
      res.redirect("/books/");
    }else{
      res.sendStatus(404);
    } 
  }catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Books.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }   
}));

// Delete book details from the database
router.get('/:id/delete', asyncErrorHandler(async (req ,res) => {
  const book = await Books.findByPk(req.params.id);
  if(book){
    res.render("books/delete", {book, title: "Delete Book"});
  } else{
    res.sendStatus(404);
  } 
}));

router.post('/:id/delete', asyncErrorHandler(async (req, res) => {
  const book = await Books.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect('/books');
  }else{
    let error = new Error(`We are very sorry, the book is Not Avaibable`);
    res.render("error", { error, message: error.message });
  }
 
}));

module.exports = router;