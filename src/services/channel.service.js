const { Channel } = require("../models/Channel.model");
const BasicServices = require("./basic.service");

class ChannelService extends BasicServices {
  constructor() {
    super(Channel);
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

module.exports.ChannelService = new ChannelService();
