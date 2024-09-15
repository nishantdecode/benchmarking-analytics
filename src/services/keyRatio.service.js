const { KeyRatio } = require("../models/KeyRatio.model");
const BasicServices = require("./basic.service");

class KeyRatioService extends BasicServices {
  constructor() {
    super(KeyRatio);
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

module.exports.KeyRatioService = new KeyRatioService();
