const { IncomeStatement } = require("../models/IncomeStatement.model");
const BasicServices = require("./basic.service");

class IncomeStatementService extends BasicServices {
  constructor() {
    super(IncomeStatement);
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

module.exports.IncomeStatementService = new IncomeStatementService();
