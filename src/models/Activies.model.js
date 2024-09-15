const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    title:{
        type:String
    },

  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", schema);

module.exports.Activity = Activity;
