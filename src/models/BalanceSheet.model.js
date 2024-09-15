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
      dueFromBanksAndOtherFinancial: {
        type: Number,
      },
      investments: {
        type: Number,
      },
      property: {
        type: Number,
      },
      investedProperty: {
        type: Number,
      },
      otherAssets: {
        type: Number,
      },
      otherRealEstate: {
        type: Number,
      },
      derivatives: {
        type: Number,
      },
      goodWill: {
        type: Number,
      },
      investmentInAssociation: {
        type: Number,
      },
      totalAssets: {
        type: Number,
      },
    },
    liabilities: {
      dueToSaudiMonetaryAutority: {
        type: Number,
      },
      customerDeposit: {
        type: Number,
      },
      debetSecurityIssued: {
        type: Number,
      },
      netDerivatives: {
        type: Number,
      },
      otherLiablities: {
        type: Number,
      },
      totalLiablities: {
        type: Number,
      },
    },
    shareEquityHolder: {
      shareCapital: {
        type: Number,
      },
      statutoryReserve: {
        type: Number,
      },
      totalOtherReserve: {
        type: Number,
      },
      retainedEarning: {
        type: Number,
      },
      proposedDividends: {
        type: Number,
      },
      treasuryShares: {
        type: Number,
      },
      employeeRelated: {
        type: Number,
      },
      foreignCurrenyReserve: {
        type: Number,
      },
      totalShareHolderEquity: {
        type: Number,
      },
    },
    equity: {
      tier1skuku: {
        type: Number,
      },
      bankEquityHolder: {
        type: Number,
      },
      nonControllingIntersts: {
        type: Number,
      },
      totalEquity: {
        type: Number,
      },
    },
    liabilityAndEquity: {
      totalLiabilityAndEquity: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const BalanceSheet = mongoose.model("BalanceSheet", schema);

module.exports.BalanceSheet = BalanceSheet;
