const { MarketShare } = require("../models/MarketShare.model");
const BasicServices = require("./basic.service");

class MarketShareService extends BasicServices {
  constructor() {
    super(MarketShare);
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

module.exports.MarketShareService = new MarketShareService();
