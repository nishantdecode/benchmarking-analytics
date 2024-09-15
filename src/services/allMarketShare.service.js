const { AllMarketShare } = require("../models/AllMarketShare.model");
const BasicServices = require("./basic.service");

class AllMarketShareService extends BasicServices {
  constructor() {
    super(AllMarketShare);
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

module.exports.AllMarketShareService = new AllMarketShareService();
