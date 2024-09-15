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
    retailSegment: {
      assets: {
        type: Number,
      },
      liabilities: {
        type: Number,
      },
      revenues: {
        type: Number,
      },
      costs: {
        type: Number,
      },
      financialImpairments: {
        type: Number,
      },
      investmentImpairments: {
        type: Number,
      },
      totalProvisions: {
        type: Number,
      },
      totalExpenses: {
        type: Number,
      },
      ppi: {
        type: Number,
      },
      preZakat: {
        type: Number,
      },
    },
    corporateSegment: {
      assets: {
        type: Number,
      },
      liabilities: {
        type: Number,
      },
      revenues: {
        type: Number,
      },
      costs: {
        type: Number,
      },
      financialImpairments: {
        type: Number,
      },
      investmentImpairments: {
        type: Number,
      },
      totalProvisions: {
        type: Number,
      },
      totalExpenses: {
        type: Number,
      },
      ppi: {
        type: Number,
      },
      preZakat: {
        type: Number,
      },
    },
    treasury: {
      assets: {
        type: Number,
      },
      liabilities: {
        type: Number,
      },
      revenues: {
        type: Number,
      },
      costs: {
        type: Number,
      },
      financialImpairments: {
        type: Number,
      },
      investmentImpairments: {
        type: Number,
      },
      totalProvisions: {
        type: Number,
      },
      totalExpenses: {
        type: Number,
      },
      ppi: {
        type: Number,
      },
      preZakat: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Segment = mongoose.model("Segment", schema);

module.exports.Segment = Segment;
