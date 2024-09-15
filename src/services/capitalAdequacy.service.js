const { CapitalAdequacy } = require("../models/CapitalAdequacy.model");
const BasicServices = require("./basic.service");

class CapitalAdequacyService extends BasicServices {
  constructor() {
    super(CapitalAdequacy);
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

module.exports.CapitalAdequacyService = new CapitalAdequacyService();
