/*jshint esversion: 6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  body: String,
  subject: String,
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  book: { type: Schema.Types.ObjectId, ref: 'Book' },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

 const Message = mongoose.model('Message', messageSchema);

 module.exports = Message;
