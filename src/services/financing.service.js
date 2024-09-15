const { Financing } = require("../models/Financing.model");
const BasicServices = require("./basic.service");

class FinancingService extends BasicServices {
  constructor() {
    super(Financing);
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

module.exports.FinancingService = new FinancingService();
