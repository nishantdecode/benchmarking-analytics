const amqp = require("../setup/amqp.setup");
const { BankService } = require("./bank.service");
const { ExecutiveSummaryService } = require("./executiveSummary.service");

module.exports.isConnectedWithRabbitMQ = async () => {
    // console.log("INSIDE FUNC")
    try {
      const test = await amqp
      .connectQueue()
      return true
    } catch (error) {
      return false
    }
  return 

};

module.exports.getTestQueData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await amqp.consumeData("test", (msg) => {
        // Handle the received message here
        console.log("Received inside", msg);

        // Resolve the Promise with the finalData
        resolve(msg);
      });
    } catch (error) {
      console.error("Error getting user data:", error);
      reject(error);
    } finally {
      await amqp.disconnectQueue();
    }
  });
};




module.exports.syncCreateAndUpdateBank= async () => {
    return new Promise(async (resolve, reject) => {
      try {
  
        await amqp.consumeData("bank-create",async (msg) => {
          // Handle the received message here
          console.log("Received inside", msg);
          if(msg){
            const data = JSON.parse(msg);
            const bank = await BankService.findById(data._id)
            if(bank) await BankService.findByIdAndUpdate(data._id,{...data});
            else await BankService.create({...data});
          }
  
          // Resolve the Promise with the finalData
          resolve("Bank Created!");
        });
      } catch (error) {
        console.error("Error getting user data:", error);
        reject(error);
      } finally {
        await amqp.disconnectQueue();
      }
    });
  }


module.exports.syncCreateAndUpdateExecutiveSummary= async () => {
    return new Promise(async (resolve, reject) => {
      try {
  
        await amqp.consumeData("executiveSummary-create",async (msg) => {
          // Handle the received message here
          console.log("Received inside", msg);
          if(msg){
            const data = JSON.parse(msg);
            const executiveSummary = await ExecutiveSummaryService.findById(data._id)
            if(executiveSummary) await ExecutiveSummaryService.findByIdAndUpdate(data._id,{...data});
            else await ExecutiveSummaryService.create({...data});
          }
  
          // Resolve the Promise with the finalData
          resolve("executiveSummary Created!");
        });
      } catch (error) {
        console.error("Error getting user data:", error);
        reject(error);
      } finally {
        await amqp.disconnectQueue();
      }
    });
  }