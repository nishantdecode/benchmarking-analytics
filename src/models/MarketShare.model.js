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
    totalLoansNet: {
      type: Number,
    },
    retailLoansGross: {
      type: Number,
    },
    corporate_and_other_loans_gross: {
      type: Number,
    },
    investments_net: {
      type: Number,
    },
    assets: {
      type: Number,
    },
    totalLoansNet: {
      type: Number,
    },
    retailLoansGross: {
      type: Number,
    },
    corporate_and_other_loans_gross: {
      type: Number,
    },
    investments_net: {
      type: Number,
    },
    assets: {
      type: Number,
    },
    totalDeposits: {
      type: Number,
    },
    demandDeposits: {
      type: Number,
    },
    time_and_saving_deposits: {
      type: Number,
    },
    lcs: {
      type: Number,
    },
    lgs: {
      type: Number,
    },
    totalTradeFinance: {
      type: Number,
    },
    grossYield: {
      type: Number,
    },
    coF: {
      type: Number,
    },
    nyi: {
      type: Number,
    },
    fees: {
      type: Number,
    },
    fx: {
      type: Number,
    },
    otherIncome: {
      type: Number,
    },
    salaries_and_employeesrelatedExpenses: {
      type: Number,
    },
    depreciation_and_amortisation: {
      type: Number,
    },
    other_general_and_admin_expenses: {
      type: Number,
    },
    operating_exp: {
      type: Number,
    },
    operating_income: {
      type: Number,
    },
    total_provisions: {
      type: Number,
    },
    net_income_before_provisions: {
      type: Number,
    },
    income_before_zakat_and_taxes: {
      type: Number,
    },
    net_income: {
      type: Number,
    },
    brokerage_firms_value_traded: {
      type: Number,
    },
    branches: {
      type: Number,
    },
    atms: {
      type: Number,
    },
    pos_terminals: {
      type: Number,
    },
    remittance_centers: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const MarketShare = mongoose.model("MarketShare", schema);

module.exports.MarketShare = MarketShare;
