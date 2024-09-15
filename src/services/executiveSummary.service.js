const { ExecutiveSummary } = require("../models/ExecutiveSummary.model");
const BasicServices = require("./basic.service");

class ExecutiveSummaryService extends BasicServices {
  constructor() {
    super(ExecutiveSummary);
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

module.exports.ExecutiveSummaryService = new ExecutiveSummaryService();
