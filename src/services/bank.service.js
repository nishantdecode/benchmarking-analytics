const { Bank } = require("../models/Bank.model");
const BasicServices = require("./basic.service");

class BankService extends BasicServices {
  constructor() {
    super(Bank);
  }
  aggregate = (pipeline) => {
    return this.modal.aggregate(pipeline);
  };
}

module.exports.BankService = new BankService();
