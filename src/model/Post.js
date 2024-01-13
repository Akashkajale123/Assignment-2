const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Post', postSchema);
