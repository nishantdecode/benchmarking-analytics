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
    retail: {
      performingLoans: {
        type: Number,
      },
      npl: {
        type: Number,
      },
      gross: {
        type: Number,
      },
      allowance: {
        type: Number,
      },
      netLoan: {
        type: Number,
      },
    },
    corporate: {
      performingLoans: {
        type: Number,
      },
      npl: {
        type: Number,
      },
      gross: {
        type: Number,
      },
      allowance: {
        type: Number,
      },
      netLoan: {
        type: Number,
      },
    },
    consumer: {
      performingLoans: {
        type: Number,
      },
      npl: {
        type: Number,
      },
      gross: {
        type: Number,
      },
      allowance: {
        type: Number,
      },
      netLoan: {
        type: Number,
      },
    },
    total: {
      performingLoans: {
        type: Number,
      },
      npl: {
        type: Number,
      },
      gross: {
        type: Number,
      },
      allowance: {
        type: Number,
      },
      netLoan: {
        type: Number,
      },
    },
    creditCard: {
      performingLoans: {
        type: Number,
      },
      npl: {
        type: Number,
      },
      gross: {
        type: Number,
      },
      allowance: {
        type: Number,
      },
      netLoan: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Financing = mongoose.model("Financing", schema);

module.exports.Financing = Financing;
