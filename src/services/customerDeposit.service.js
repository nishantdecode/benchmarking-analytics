const { CustomerDeposit } = require("../models/CustomerDeposit.model");
const BasicServices = require("./basic.service");

class CustomerDepositService extends BasicServices {
  constructor() {
    super(CustomerDeposit);
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

module.exports.CustomerDepositService = new CustomerDepositService();
