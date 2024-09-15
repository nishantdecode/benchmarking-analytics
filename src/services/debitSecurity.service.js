const { DebitSecurity } = require("../models/DebitSecurity.model");
const BasicServices = require("./basic.service");

class DebitSecurityService extends BasicServices {
  constructor() {
    super(DebitSecurity);
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

module.exports.DebitSecurityService = new DebitSecurityService();
