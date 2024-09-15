const { ObjectId } = require("mongoose").Types;

const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const Logger = require("../helpers/logger.helpers");

const { MarketShareService } = require("../services/marketShare.service");
const { BankService } = require("../services/bank.service");

class MarketShareController {
  //@desc add market share data for a bank with unique meta data!
  //@route POST /api/marketShare/create
  //@access public
  create = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankId, meta } = req.body;

    if (!bankId || !meta || !meta.interval || !meta.label || !meta.date) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const dataAvailable = await MarketShareService.findOne({
      bankId,
      meta,
    });
    if (dataAvailable) {
      throw new HttpError(400, "Meta data already exists!");
    }

    const summary = await MarketShareService.create({ ...req.body });

    if (summary) {
      Response(res)
        .status(201)
        .message("Market Share data created successfully")
        .send();
    } else {
      throw new HttpError(400, "Market Share data is not valid");
    }
  };

  //@desc Get all years for which data is available in meta.date field and sort them in descending order
  //@route GET /api/marketShare/years
  //@access public
  getAllYears = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    let uniqueYears = await MarketShareService.find({
      "meta.interval": "YEARLY",
    })
      .distinct("meta.date")
      .then((dates) => dates.map((date) => new Date(date).getFullYear()))
      .then((years) => [...new Set(years)])
      .then((uniqueYears) => uniqueYears.sort((a, b) => a - b));

    const quarterlyLabels = await MarketShareService.find({
      "meta.interval": "QUARTERLY",
      "meta.date": {
        $gt: new Date(
          Date.UTC(uniqueYears[uniqueYears.length - 1], 0, 1, 0, 0, 0, 0)
        ),
      },
    })
      .distinct("meta.label")
      .then((uniqueYears) => uniqueYears.sort((a, b) => a - b));

    uniqueYears = uniqueYears.concat(quarterlyLabels);

    Response(res).status(200).body(uniqueYears).send();
  };

  //@desc find market share data of bank.
  //@route POST /api/marketShare/individualBank
  //@access public
  getIndividualBankData = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankId,startDate,endDate } = req.body;

    if (!bankId) {
      throw new HttpError(400, "Invalid request parameters!");
    }
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
    let marketShareData = await MarketShareService.find(query).sort({ "meta.date": -1 });

    const latestYear = new Date(marketShareData[0].meta.date).getFullYear();
    // const year = parseInt(latestYear) || 0;
    const date = new Date(Date.UTC(latestYear - 1, 0, 1, 0, 0, 0, 0));
    console.log({date})
    const quarterlyData = await MarketShareService.find({
      bankId,
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: date },
    }).sort({ "meta.label": -1 }).limit(4);

    marketShareData = quarterlyData.concat(marketShareData);

    const reorderedData = marketShareData.map((item) => {
      const { _id, bankId, meta, createdAt, updatedAt, __v, ...rest } =
        item.toObject();

      return {
        id: _id,
        year: meta.label,
        ...rest,
      };
    });

    Response(res).status(200).body(reorderedData).send();
  };

  //@desc find market share data of multiple banks by category.
  //@route POST /api/marketShare/multipleBank
  //@access public
  getMultipleBankData = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { category, year } = req.body;

    const bankData = await MarketShareService.find({
      "meta.label": year,
    });

    let bankNames = {};
    await Promise.all(
      bankData.map(async (item) => {
        const bank = await BankService.findById(item.bankId);
        bankNames[item.bankId.toString()] = bank.name;
      })
    );

    const filteredData = bankData.map((data) => {
      return {
        name: bankNames[data.bankId],
        value: data[category],
      };
    });

    Response(res).status(200).body(filteredData).send();
  };

  //@desc find all market share data.
  //@route GET /api/marketShare/
  //@access public
  getAll = async (req, res) => {
    const summary = await MarketShareService.find();
    Response(res).status(200).body(summary).send();
  };

  updateDate = async (req, res) => {
    const summaries = await MarketShareService.find({});

    summaries.forEach(async (summary) => {
      if (summary.meta.interval === "QUARTERLY") {
        const label = summary.meta.label;
        const date = new Date(summary.meta.date);

        if (label.startsWith("Q1")) {
          date.setUTCMonth(0);
        } else if (label.startsWith("Q2")) {
          date.setUTCMonth(3);
        } else if (label.startsWith("Q3")) {
          date.setUTCMonth(6);
        } else if (label.startsWith("Q4")) {
          date.setUTCMonth(9);
        }

        summary.meta.date = date.toISOString();
        await summary.save();
      }
    });

    Response(res).status(200).body(summaries).send();
  };
}

module.exports.MarketShareController = new MarketShareController();
