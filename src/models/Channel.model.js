const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
    meta: {
      interval: {
        type: String,
        enum: ["QUARTERLY", "YEARLY"],
      },
      label: {
        type: String,
      },
      date: {
        type: Date,
      },
    },
    channel: {
      branches: {
        type: Number,
      },
      atms: {
        type: Number,
      },
      pos: {
        type: Number,
      },
      remittance: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Channel = mongoose.model("Channel", schema);

module.exports.Channel = Channel;
