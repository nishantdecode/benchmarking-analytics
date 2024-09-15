const {
    getTestQueData,
    // getUserDataViaUserServer,
    syncCreateAndUpdateBank,
    syncCreateAndUpdateExecutiveSummary
  } = require("../services/rabbitmq.service");
  // const { UserService } = require("../services/user.service");
  
  module.exports = async () => {
    getTestQueData();
    syncCreateAndUpdateBank();
    syncCreateAndUpdateExecutiveSummary()
    // getUserDataViaUserServer();
  };
  