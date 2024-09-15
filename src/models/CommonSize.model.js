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
    assets: {
      cash: {
        type: Number,
      },
      due_from_banks_and_fis: {
        type: Number,
      },
      investments_net: {
        type: Number,
      },
      financing_net: {
        type: Number,
      },
      pp_and_e: {
        type: Number,
      },
      invested_properties_net: {
        type: Number,
      },
      other_assets: {
        type: Number,
      },
      other_real_estate: {
        type: Number,
      },
      derivatives: {
        type: Number,
      },
      investments_in_association: {
        type: Number,
      },
      goodwill: {
        type: Number,
      },
      totalAssets: {
        type: Number,
      },
    },
    liabilities: {
      due_to_banks_and_other_fis: {
        type: Number,
      },
      customers_deposits: {
        type: Number,
      },
      borrowings: {
        type: Number,
      },
      derivatives_net: {
        type: Number,
      },
      other_liabilities: {
        type: Number,
      },
      total_liabilities: {
        type: Number,
      },
    },
    shareholders_equity: {
      share_capital: {
        type: Number,
      },
      statutory_reserve: {
        type: Number,
      },
      other_reserve: {
        type: Number,
      },
      retained_earnings: {
        type: Number,
      },
      proposed_dividends: {
        type: Number,
      },
      treasury_shares: {
        type: Number,
      },
      employees_related: {
        type: Number,
      },
      foreign_currency_translation_reserve: {
        type: Number,
      },
      total_shareholders_equity: {
        type: Number,
      },
    },
    operating_income: {
      gross_financing_and_investment_income: {
        type: Number,
      },
      coF_positive_value: {
        type: Number,
      },
      nyi: {
        type: Number,
      },
      fees_net: {
        type: Number,
      },
      fx_net: {
        type: Number,
      },
      income_loss_from_fvis_investments_net: {
        type: Number,
      },
      trading_income_net: {
        type: Number,
      },
      dividend_income: {
        type: Number,
      },
      gains_on_non_trading_financial_institutions_net: {
        type: Number,
      },
      other_income_expenses_net: {
        type: Number,
      },
      total_operating_income: {
        type: Number,
      },
    },
    operating_expenses: {
      salaries_and_employees_related_expenses: {
        type: Number,
      },
      depreciation_and_amortisation: {
        type: Number,
      },
      other_general_and_admin_expenses: {
        type: Number,
      },
      impairments_financing_net: {
        type: Number,
      },
      impairments_investments_net: {
        type: Number,
      },
      total_operating_expenses: {
        type: Number,
      },
      operating_income: {
        type: Number,
      },
      zakat: {
        type: Number,
      },
      net_income_after_zakat: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const CommonSize = mongoose.model("CommonSize", schema);

module.exports.CommonSize = CommonSize;
