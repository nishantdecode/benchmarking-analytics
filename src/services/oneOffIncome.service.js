const { OneOffIncome } = require("../models/OneOffIncome.model");
const BasicServices = require("./basic.service");

class OneOffIncomeService extends BasicServices {
  constructor() {
    super(OneOffIncome);
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

module.exports.OneOffIncomeService = new OneOffIncomeService();
