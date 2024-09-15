const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    bankId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Bank"
    },
    meta: {
      interval: {
        type:String,
        enum:["QUARTERLY","YEARLY"],
      },
      label: {
        type:String,
      },
      date: {
        type:Date,
      },
    },
    grossYield:{
      type:Number
    },
    coF:{
      type:Number
    },
    nyi:{
      type:Number
    }, 
    fees:{
      type:Number
    },
    fx:{
      type:Number
    }, 
    otherIncome:{
      type:Number
    },
    operatingIncome:{
      type:Number
    },
    operatingExpenses:{
      type:Number
    },  
    income_before_provision_zakat_and_taxes:{
      type:Number
    },
    provisionExpenses:{
      type:Number
    },
    income_before_zakat_and_taxes:{
      type:Number
    },
    zakat_and_taxes:{
      type:Number
    },
    netIncome:{
      type:Number
    },
    coreEarnings:{
      type:Number
    },
    totalLoans:{
      type:Number
    },
    retailLoans:{
      type:Number
    },
    corporateLoans:{
      type:Number
    },
    consumerLoans:{
      type:Number
    },
    creditCards:{
      type:Number
    }
  },
  {
    timestamps: true,
  }
);

const ExecutiveSummary = mongoose.model("ExecutiveSummary", schema);

module.exports.ExecutiveSummary = ExecutiveSummary;