//jshint esversion: 6

var express = require('express');
var router = express.Router();

const auth = require('../helpers/auth');
const User = require('../models/user');
const Book = require('../models/book');


//Get Add Book

var multer  = require('multer'); //added by Imre
var upload = multer({ dest: 'public/uploads' });


router.get('/add-book', auth.isAuthenticated, (req, res, next) => { //added by eduard
  res.render('addbook');
});

// Post Add Book

router.post('/newbook',  auth.isAuthenticated, upload.single('cover'), (req, res, next) => {// added by Imre

  var file;

  if(req.file !== undefined) {
    file = req.file.filename;
  } else {
    file = req.body.bookPicture.split("/")[1];
  }

  const bookInfo = {
    title: req.body.title,
    author: req.body.author,
    picture: 'uploads/' + file,
    description: req.body.description,
    available: req.body.available,
    genre: req.body.genre,
    pages: req.body.pages,
    owner: req.user._id,
    current_user: req.user._id,
  };

// picture: 'uploads/' + req.file.filename,

  const newBook = new Book(bookInfo);
  newBook.save( (err) => {
    if (err) {
      next(err);
    }
    res.redirect('/');
  });
});

//Get Edit Book



//becareful with this part from here----------------
  // Book.findById(req.params.id, (err, book) => {
  //   if (err) { next(err) }

// router.get('/editbook/:id', auth.isAuthenticated, (req, res, next) => { //added by Imre

router.get('/:id/edit', auth.isAuthenticated, (req, res, next) => { //added by Imre

  let user = req.user;
  let bookId= req.params.id;

  Book.findById({_id: bookId}, (err, book) => {
    if (err) throw err;

      res.render('editbook', { user: user, book: book });

  });
});

router.post('/:id', upload.single('cover'), (req, res, next) => {// added by Imre

  var file;

  if(req.file !== undefined) {
    file = req.file.filename;
  } else {
    file = req.body.bookPicture.split("/")[1];
  }

  const bookInfo = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    genre: req.body.genre,
    pages: req.body.pages,
    picture: 'uploads/' + file
  };

  //becareful with this part from here ----------------

  Book.findByIdAndUpdate(req.params.id, bookInfo, (err, book) => {

    if (err) {next(err)}
    res.redirect('/');
  });
});

//Get All Books

router.get('/all-books', auth.isAuthenticated, (req, res, next) => { //added by eduard
  let user = req.user;

  Book.find({}, (err, book) => {
    if (err) {
      next(err);
    } else {
      res.render('allbooks', { book: book, user: user });
    }
  });
});

//Get Available Books

router.get('/available-books', auth.isAuthenticated, (req, res, next) => { //added by eduard
  let user = req.user;

  Book.find({}, (err, book) => {
    if (err) {
      next(err);
    } else {
      res.render('availablebooks', { user: user, book: book});
    }

  });


  });
// });

router.get('/:id/showbook', (req, res, next) => {
  let user = req.user;
  let bookId= req.params.id;
  Book.findById({_id: bookId}, (err, book)=>{
    if (err) throw err;

      res.render('showbook', { user: user, book : book});

  });
});

router.get('/:id/sharebook', auth.isAuthenticated, (req, res, next) => {

  let user = req.user;

    Book.findById({_id:req.params.id}, (err, book) => {
      if (err) {
        next(err);
      } else {
        User.find({}, (err, users) => {
          if (err) {
            next(err);
          } else {
            console.log("this is users", users);
            res.render('sharebook', { user, book, users});

          }
        });
      }
    });
});

router.post('/:id/sharebook', auth.isAuthenticated, (req, res, next) => {

  const bookInfo = {
    current_user: req.body.user,
    available: false,
  };

  console.log(req.body.user);

  console.log("before finding by Id");
  Book.findByIdAndUpdate(req.params.id, bookInfo, {new: true}, (err, book) => {
    console.log("after find by id");
    if (err) {next(err)}
    res.redirect('/');
  });
});



module.exports = router;
