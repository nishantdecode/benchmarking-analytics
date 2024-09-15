const { CostRiskKeyRatio } = require("../models/CostRiskKeyRatio.model");
const BasicServices = require("./basic.service");

class CostRiskKeyRatioService extends BasicServices {
  constructor() {
    super(CostRiskKeyRatio);
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

module.exports.CostRiskKeyRatioService = new CostRiskKeyRatioService();
