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
    nyi: {
      gross: {
        type: Number,
      },
      cof: {
        type: Number,
      },
      nyi: {
        type: Number,
      },
    },
    totalOperatingEquity: {
      fees: {
        type: Number,
      },
      fx: {
        type: Number,
      },
      fvisInvestments: {
        type: Number,
      },
      tradingIncome: {
        type: Number,
      },
      dividentIncome: {
        type: Number,
      },
      nonTradingIncome: {
        type: Number,
      },
      otherIncome: {
        type: Number,
      },
      totalOperatingEquity: {
        type: Number,
      },
    },
    totalOperatingExpenses: {
      salaries: {
        type: Number,
      },
      rentExpenses:{
        type:Number
      },
      depreciationExpenses: {
        type: Number,
      },
      amortisationExpenses:{
        type:Number
      },
      otherGeneralExpenses: {
        type: Number,
      },
      otherExpenses:{
        type:Number
      },
      financialImpairment: {
        type: Number,
      },
      investmentImpairment: {
        type: Number,
      },
      totalOperatingExpenses: {
        type: Number,
      },
    },
    netIncomeBeforeZakat: {
      otherIncome: {
        type: Number,
      },
      netIncomeBeforeZakat: {
        type: Number,
      },
    },
    netIncomeAfterZakat: {
      zakat: {
        type: Number,
      },
      netIncomeAfterZakat: {
        type: Number,
      },
    },
    equityHolder: {
      equityHoldersOfTheBank: {
        type: Number,
      },
    },
    totalNetIncome: {
      nonControllingInterest: {
        type: Number,
      },
      totalNetIncome: {
        type: Number,
      },
    },
    overall: {
      income_before_provsions_zakat_taxes: {
        type: Number,
      },
      cost: {
        type: Number,
      },
      income: {
        type: Number,
      },
      totalProvisions: {
        type: Number,
      },
      fxAndOtherIncome: {
        type: Number,
      },
      otherIncome: {
        type: Number,
      },
      nyi: {
        type: Number,
      },
      staffExpenses: {
        type: Number,
      },
      nonStaffExpenses: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const IncomeStatement = mongoose.model("IncomeStatement", schema);

module.exports.IncomeStatement = IncomeStatement;
