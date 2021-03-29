const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    requestId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    shrinkedUrl: {
      type: String,
      require: true,
    },
    hashedContent: {
      type: String,
      require: true,
    },
    wordCount: {
      type: Number,
    },
    visitedDate: {
      type: Date,
      default: new Date(),
    },

  },
);

const Link = mongoose.model('Link', LinkSchema);

module.exports = Link;
