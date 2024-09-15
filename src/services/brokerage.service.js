const { Brokerage } = require("../models/Brokerage.model");
const BasicServices = require("./basic.service");

class BrokerageService extends BasicServices {
  constructor() {
    super(Brokerage);
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

module.exports.BrokerageService = new BrokerageService();
