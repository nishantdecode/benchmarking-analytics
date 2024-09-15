const { BalanceSheet } = require("../models/BalanceSheet.model");
const BasicServices = require("./basic.service");

class BalanceSheetService extends BasicServices {
  constructor() {
    super(BalanceSheet);
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

module.exports.BalanceSheetService = new BalanceSheetService();
