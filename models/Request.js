const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
  {
    home: {
      type: String,
      required: true,
      trim: true,
    },
    IP: {
      type: String,
      required: true,
    },
    include: [
      {
        type: String,
      },
    ],
    exclude: [
      {
        type: String,
      },
    ],
    submittedDate: {
      type: Date,
      default: new Date(),
    },
    isAborted: {
      type: Boolean,
      default: false,
    },
    totalLink: {
      type: Number,
    },
    totalWord: {
      type: Number,
    },
  },
);

const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;
