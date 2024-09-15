const { ObjectId } = require("mongoose").Types;

const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const Logger = require("../helpers/logger.helpers");

const { CommonSizeService } = require("../services/commonSize.service");
const { BankService } = require("../services/bank.service");

class CommonSizeController {
  //@desc add common size data for a bank with unique meta data!
  //@route POST /api/commonSize/create
  //@access public
  create = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankId, meta } = req.body;

    if (!bankId || !meta || !meta.interval || !meta.label || !meta.date) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const dataAvailable = await CommonSizeService.findOne({
      bankId,
      meta,
    });
    if (dataAvailable) {
      throw new HttpError(400, "Meta data already exists!");
    }

    const summary = await CommonSizeService.create({ ...req.body });

    if (summary) {
      Logger.info(`common size created for bank: ${{ bankId, meta }}`);
      Response(res)
        .status(201)
        .message("common size created successfully")
        .send();
    } else {
      throw new HttpError(400, "common size data is not valid");
    }
  };

  //@desc find common size data of a bank.
  //@route POST /api/commonSize/individualBank
  //@access public
  getSizeByBank = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankId,startDate,endDate } = req.body;
    const startMonth = new Date(startDate).getUTCMonth();
    const endMonth = new Date(endDate).getUTCMonth();
    let query = {
      bankId: req.body.bankId,
      "meta.interval": "YEARLY",
    }
    if(startDate){
      query ={
        bankId: req.body.bankId,
        "meta.interval": "YEARLY",
        "meta.date": {
          $gte: new Date(
            Date.UTC(new Date(startDate).getFullYear(), startMonth, 1, 0, 0, 0, 0)
          ),
          $lte: new Date(
            Date.UTC(new Date(endDate).getFullYear(), endMonth, 1, 0, 0, 0, 0)
          ),
        },
      }
    }
    const data = await CommonSizeService.find(query).sort({ "meta.date": 1 });

    const latestYear = new Date(data[data.length - 1].meta.date).getFullYear();

    const latestYearData = await CommonSizeService.find({
      bankId,
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(Date.UTC(Number(latestYear) + 1, 0, 1, 0, 0, 0, 0)) },
    }).sort({ "meta.date": 1 });

    if (latestYearData) {
      data.push(...latestYearData);
    }

    const tableData = {
      assets: null,
      liabilities: null,
      shareholders_equity: null,
      operating_income: null,
      operating_expenses: null,
    };

    Object.keys(tableData).map((table) => {
      const extractedData = data.map((entry) => {
        const { id, meta } = entry;
        const item = entry[table];
        return {
          id,
          label: meta.label,
          ...item,
        };
      });

      extractedData.sort((a, b) => {
        if (a.label < b.label) return 1;
        if (a.label > b.label) return -1;
        return 0;
      });

      tableData[table] = extractedData;
    });

    Response(res).status(200).body(tableData).send();
  };

  //@desc find common size data of a bank.
  //@route POST /api/commonSize/multipleBank
  //@access public
  getSizeOfBanks = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankIds, table, category } = req.body;

    const data = await CommonSizeService.find({
      bankId: { $in: bankIds },
      "meta.interval": "YEARLY",
    }).sort({ "meta.date": 1 });

    const latestYear = new Date(data[data.length - 1].meta.date).getFullYear();

    const latestYearData = await CommonSizeService.find({
      bankId: { $in: bankIds },
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(Date.UTC(Number(latestYear) + 1, 0, 1, 0, 0, 0, 0)) },
    }).sort({ "meta.date": 1 });

    if (latestYearData) {
      data.push(...latestYearData);
    }

    const extractedData = data.map((entry) => {
      const { id, bankId, meta } = entry;
      const item = entry[table];
      return {
        id,
        bankId,
        label: meta.label,
        ...item,
      };
    });

    extractedData.sort((a, b) => {
      if (a.label < b.label) return 1;
      if (a.label > b.label) return -1;
      return 0;
    });

    const bankNames = await BankService.find().select("_id name");

    const groupedData = {};
    extractedData.forEach((entry) => {
      const label = entry.label.toString();
      if (!groupedData[label]) {
        groupedData[label] = {
          id: new ObjectId(),
          label,
        };
      }
      const bank = bankNames.find(
        (item) => item._id.toString() === entry.bankId.toString()
      ).name;
      groupedData[label][bank] = Number(entry[category])?.toFixed(4);
    });

    const flatenData = Object.values(groupedData)

    flatenData.sort((a, b) => {
      if (a.label < b.label) return 1;
      if (a.label > b.label) return -1;
      return 0;
    });

    Response(res).status(200).body(flatenData).send();
  };

  //@desc find all executive summary data.
  //@route GET /api/executiveSummary/
  //@access public
  getAll = async (req, res) => {
    const summary = await CommonSizeService.find();
    Response(res).status(200).body(summary).send();
  };
}

module.exports.CommonSizeController = new CommonSizeController();
