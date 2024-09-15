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
    marketShare: {
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
      nyi: {
        type: Number,
      },
      fees: {
        type: Number,
      },
      fx: {
        type: Number,
      },
      brokerageFirms: {
        type: Number,
      },
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
      residentialMortgages: {
        type: Number,
      },
      aum: {
        type: Number,
      },
      grossYield: {
        type: Number,
      },
      coF: {
        type: Number,
      },
      otherIncome: {
        type: Number,
      },
      operatingIncome: {
        type: Number,
      },
      operatingIncomeAdjusted: {
        type: Number,
      },
      costs: {
        type: Number,
      },
      provision: {
        type: Number,
      },
      ppi: {
        type: Number,
      },
      incomeBeforeZakat: {
        type: Number,
      },
      zakat: {
        type: Number,
      },
      periodDays: {
        type: Number,
      },
      periodYearDays: {
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
      irrevocableCommitments: {
        type: Number,
      },
      annualNonYield: {
        type: Number,
      },
      annualOpex: {
        type: Number,
      },
      nonyield_operatingIncome: {
        type: Number,
      },
      nonyield_operatingExpenses: {
        type: Number,
      },
      nonyield_totalAssets: {
        type: Number,
      },
      operatingExpenses_totalAssets: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const AllMarketShare = mongoose.model("AllMarketShare", schema);

module.exports.AllMarketShare = AllMarketShare;
