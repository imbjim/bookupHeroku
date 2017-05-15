/*jshint esversion: 6*/

const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: String, //added
  city: String, //added
  email: String,
  username: String,
  password: String,
  phone: String,// added by Imre
  country: String,// added by Imre
  age: Number,// added by Imre
  gender: String,// added by Imre
  picture: String,// added by Imre
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
