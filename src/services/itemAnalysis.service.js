const { ItemAnalysis } = require("../models/ItemAnalysis.model");
const BasicServices = require("./basic.service");

class ItemAnalysisService extends BasicServices {
  constructor() {
    super(ItemAnalysis);
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

module.exports.ItemAnalysisService = new ItemAnalysisService();
