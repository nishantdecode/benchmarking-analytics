const { Investment } = require("../models/Investment.model");
const BasicServices = require("./basic.service");

class InvestmentService extends BasicServices {
  constructor() {
    super(Investment);
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

module.exports.InvestmentService = new InvestmentService();
