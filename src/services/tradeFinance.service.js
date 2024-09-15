const { TradeFinance } = require("../models/TradeFinance.model");
const BasicServices = require("./basic.service");

class TradeFinanceService extends BasicServices {
  constructor() {
    super(TradeFinance);
  }
  distinct = (filter) => {
    return this.modal.distinct({ ...filter });
  };
  sort = (filter) => {
    return this.modal.sort({ ...filter });
  };
  aggregate = (pipeline) => {
    return this.modal.aggregate(pipeline);
  };
}

module.exports.TradeFinanceService = new TradeFinanceService();
