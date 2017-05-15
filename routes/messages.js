//jshint esversion: 6

var express = require('express');
var router = express.Router();

const auth = require('../helpers/auth');
const User = require('../models/user');
const Book = require('../models/book');
const Message = require('../models/message');

var multer  = require('multer'); //added by Imre
var upload = multer({ dest: 'public/uploads' });

router.get('/inbox', auth.isAuthenticated, (req, res, next) => {
  // User
  // .findOne({_id: req.session.passport.user})
  // .populate("messages")
  // .exec((err, user)=>{
  //   if (err) {
  //     next (err);
  //     return;
  //   }
    Message
    .find({receiver: req.session.passport.user})
    .populate("book")
    .populate("sender")
    .exec((err, message)=>{
      if (err) {
        next (err);
        return;
      }
      res.render('inbox', { message});
    });

});

router.get('/sentmessages', auth.isAuthenticated, (req, res, next) => {
    Message
    .find({sender: req.session.passport.user})
    .populate("book")
    .populate("receiver")
    .exec((err, message)=>{
      if (err) {
        next (err);
        return;
      }
      res.render('sentmessages', { message});
    });

});

router.get('/sendmessage/:id', auth.isAuthenticated, (req, res, next) => {
  let bookId = req.params.id;
  Book.findById({_id: bookId}, (err, book) => {
    if (err) throw err;
    console.log(book);
      res.render('sendmessage', { book: book });
  });
});


router.post('/sendmessage',  auth.isAuthenticated, (req, res, next) => {
const messageInfo = {
  subject: req.body.subject,
  body: req.body.body,
  book: req.body.bookId,
  sender: req.session.passport.user,
  receiver: req.body.ownerId
};

const newMessage = new Message(messageInfo);

newMessage.save( (err, message) => {
  if (err) {
    next(err);
  } else {
        User.findByIdAndUpdate({_id: req.body.ownerId}, {$push: {messages: message._id}}, (err, user) => {
      if (err) {next (err);
      } else {
        User.findByIdAndUpdate({_id: req.session.passport.user}, {$push: {messages: message._id}}, (err, user) => {
              if (err) {next (err);
              } else {
            res.redirect('/');
              }
            });
      }

    });
}
});
});

router.get('/sendmessagetosender/:id', auth.isAuthenticated, (req, res, next) => {
    console.log(req.params.id);
  Message
  .findById({_id: req.params.id})
  .populate("receiver")
  .populate("sender")
  .populate("book")
  .exec((err, message)=>{
    if (err) {
      next (err);
      return;
    }
    res.render('sendmessagetosender', { message});
  });
});


router.post('/sendmessagetosender',  auth.isAuthenticated, (req, res, next) => {
  const messageInfo = {
    subject: req.body.subject,
    body: req.body.body,
    book: req.body.bookId,
    sender: req.session.passport.user,
    receiver: req.body.receiverId
  };

  const newMessage = new Message(messageInfo);

  newMessage.save( (err, message) => {
    if (err) {
      next(err);
    } else {
          User.findByIdAndUpdate({_id: req.body.receiverId}, {$push: {messages: message._id}}, (err, user) => {
        if (err) {next (err);
        } else {
          User.findByIdAndUpdate({_id: req.session.passport.user}, {$push: {messages: message._id}}, (err, user) => {
                if (err) {next (err);
                } else {
                  console.log("after saving", message);
          Book.findByIdAndUpdate({_id: req.body.bookId}, {$push: {messages: message._id}}, (err, book) => {
                        if (err) {next (err);
                        } else {
                          console.log(book);
                      res.redirect('/');
                        }
                      });
                }
              });
        }

      });
  }
  });
});

router.get('/sendmessagefromsent/:id', auth.isAuthenticated, (req, res, next) => {
    console.log(req.params.id);
  Message
  .findById({_id: req.params.id})
  .populate("receiver")
  .populate("sender")
  .populate("book")
  .exec((err, message)=>{
    if (err) {
      next (err);
      return;
    }
    res.render('sendmessagefromsent', { message});
  });
});


router.post('/sendmessagefromsent',  auth.isAuthenticated, (req, res, next) => {
  const messageInfo = {
    subject: req.body.subject,
    body: req.body.body,
    book: req.body.bookId,
    sender: req.session.passport.user,
    receiver: req.body.receiverId
  };

  const newMessage = new Message(messageInfo);

  newMessage.save( (err, message) => {
    if (err) {
      next(err);
    } else {
          User.findByIdAndUpdate({_id: req.body.receiverId}, {$push: {messages: message._id}}, (err, user) => {
        if (err) {next (err);
        } else {
          User.findByIdAndUpdate({_id: req.session.passport.user}, {$push: {messages: message._id}}, (err, user) => {
                if (err) {next (err);
                } else {
          Book.findByIdAndUpdate({_id: req.body.bookId}, {$push: {messages: message._id}}, (err, book) => {
                        if (err) {next (err);
                        } else {
                      res.redirect('/');
                        }
                      });
                }
              });
        }

      });
  }
  });
});
module.exports = router;
