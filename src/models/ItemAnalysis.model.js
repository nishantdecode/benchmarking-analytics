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
    balanceSheet: {
      demandDeposits: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      t_and_s_deposits: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      total_deposits: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      investments: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      assets: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      lc: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      lg: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      trade_finance: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      retail_performing_loans: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      corporate_and_others_performing_loans: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      total_loans_net: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
    },
    incomeStatement: {
      grossYield: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      coF: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      nyi: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      fees: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      fx: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      otherIncome: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      operatingIncome: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      salaries_and_employees_related_expenses: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      depreciation_and_amortization_expenses: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      other_general_and_admin_expenses: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      operatingExpenses: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      provisions_loans_and_investments: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      income_before_provisions: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      income_before_zakat_and_tax: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
      netIncome: {
        value: {
          type: String,
        },
        share: {
          type: String,
        },
        rank: {
          type: String,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const ItemAnalysis = mongoose.model("ItemAnalysis", schema);

module.exports.ItemAnalysis = ItemAnalysis;
