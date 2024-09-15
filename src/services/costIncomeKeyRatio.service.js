const { CostIncomeKeyRatio } = require("../models/CostIncomeKeyRatio.model");
const BasicServices = require("./basic.service");

class CostIncomeKeyRatioService extends BasicServices {
  constructor() {
    super(CostIncomeKeyRatio);
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

module.exports.CostIncomeKeyRatioService = new CostIncomeKeyRatioService();
