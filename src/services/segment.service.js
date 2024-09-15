const { Segment } = require("../models/Segment.model");
const BasicServices = require("./basic.service");

class SegmentService extends BasicServices {
  constructor() {
    super(Segment);
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

module.exports.SegmentService = new SegmentService();
