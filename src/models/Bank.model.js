const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    headquarters: {
      type: String,
    },
    code: {
      type: String,
    },
    contact: {
      type: String,
    },
    iconUrl: {
      type: String,
    },
    color: {
      type: String,
    },
    dataUrl:{
      type:String
    },
    extraction: {
      disabled: {
        type: Boolean,
      },
      date: {
        type: Date,
      },
      status: {
        type: String,
        enum: ["Extraction requested","Data extracted","Request Extraction"]
      }
    },
  },
  {
    timestamps: true,
  }
);

const Bank = mongoose.model("Bank", schema);

module.exports.Bank = Bank;
