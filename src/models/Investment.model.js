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
    portfolio:{
      totalInvestments:{
        type:Number
      },
      investmentInAssociation:{
        type:Number
      },
      Portfolio:{
        type:Number
      }
    }
    
  },
  {
    timestamps: true,
  }
);

const Investment = mongoose.model("Investment", schema);

module.exports.Investment = Investment;
