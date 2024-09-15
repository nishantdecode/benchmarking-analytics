const { CommonSize } = require("../models/CommonSize.model");
const BasicServices = require("./basic.service");

class CommonSizeService extends BasicServices {
  constructor() {
    super(CommonSize);
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

module.exports.CommonSizeService = new CommonSizeService();
