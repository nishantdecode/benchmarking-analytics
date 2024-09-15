const { ObjectId } = require("mongoose").Types;

const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const Logger = require("../helpers/logger.helpers");

const {
  ExecutiveSummaryService,
} = require("../services/executiveSummary.service");
const { BankService } = require("../services/bank.service");
const { ExecutiveSummary } = require("../models/ExecutiveSummary.model");
const { Bank } = require("../models/Bank.model");

class ExecutiveSummaryController {
  //@desc add executive summary data for a bank with unique meta data!
  //@route POST /api/executiveSummary/create
  //@access public
  create = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankId, meta } = req.body;

    if (!bankId || !meta || !meta.interval || !meta.label || !meta.date) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const dataAvailable = await ExecutiveSummaryService.findOne({
      bankId,
      meta,
    });
    if (dataAvailable) {
      throw new HttpError(400, "Meta data already exists!");
    }

    const summary = await ExecutiveSummaryService.create({ ...req.body });

    if (summary) {
      Logger.info(`Executive Summary created for bank: ${{ bankId, meta }}`);
      Response(res)
        .status(201)
        .message("Executive Summary created successfully")
        .send();
    } else {
      throw new HttpError(400, "Executive Summary data is not valid");
    }
  };

  //@desc Get all years for which data is available in meta.date field and sort them in descending order
  //@route GET /api/executiveSummary/years
  //@access public
  getAllYears = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const uniqueYears = await ExecutiveSummaryService.find({})
      .distinct("meta.date")
      .then((dates) => dates.map((date) => new Date(date).getFullYear()))
      .then((years) => [...new Set(years)])
      .then((uniqueYears) => uniqueYears.sort((a, b) => a - b));

    Logger.info(`Data available for years: ${uniqueYears}`);
    Response(res).status(200).body(uniqueYears).send();
  };

  //@desc find executive summary data of bank by item(category) in a given date range.
  //@route POST /api/executiveSummary/item
  //@access public
  getItem = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankIds, category, interval, startDate, endDate } = req.body;

    if (!bankIds || !category || !interval || !startDate || !endDate) {
      throw new HttpError(400, "Invalid request parameters!");
    }

    const startMonth = new Date(startDate).getUTCMonth();
    const endMonth = new Date(endDate).getUTCMonth();

    const query = {
      bankId: { $in: bankIds.map((id) => new ObjectId(id)) },
      "meta.interval": interval,
      "meta.date": {
        $gte: new Date(
          Date.UTC(new Date(startDate).getFullYear(), startMonth, 1, 0, 0, 0, 0)
        ),
        $lte: new Date(
          Date.UTC(new Date(endDate).getFullYear(), endMonth, 1, 0, 0, 0, 0)
        ),
      },
    };

    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: { bankId: "$bankId", label: "$meta.label" },
          value: { $first: `$${category}` },
        },
      },
      {
        $sort: {
          "meta.date": 1,
        },
      },
      {
        $project: {
          bankId: "$_id.bankId",
          label: "$_id.label",
          value: 1,
          _id: 0,
        },
      },
    ];

    let results = await ExecutiveSummaryService.aggregate(pipeline);

    if (interval === "YEARLY") {
      const year = new Date(endDate).getFullYear();
      const yearlyDataExists = results.some(
        (result) => result.label === year.toString()
      );

      if (!yearlyDataExists) {
        const quarterlyData = await ExecutiveSummaryService.find({
          bankId: { $in: bankIds.map((id) => new ObjectId(id)) },
          "meta.interval": "QUARTERLY",
          "meta.date": {
            $gte: new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
          },
        }).sort({ "meta.date": 1 });

        console.log(quarterlyData);
        results = results.concat(
          quarterlyData.map((data) => ({
            label: data.meta.label,
            bankId: data.bankId.toString(),
            value: data[category],
          }))
        );
      }
    }

    const bankNames = await Promise.all(
      bankIds.map(async (id) => {
        const bank = await BankService.findById(id);
        return { bankId: id, name: bank.name };
      })
    );

    const responseData = results.reduce((acc, { label, bankId, value }) => {
      const { name } =
        bankNames.find(
          (bank) => bank.bankId.toString() === bankId.toString()
        ) || {};

      const labelIndex = acc.findIndex((data) => data.label === label);
      if (labelIndex !== -1) {
        acc[labelIndex][name] = Number(value).toFixed(4);
      } else {
        acc.push({ label, [name]: Number(value).toFixed(4) });
      }

      return acc;
    }, []);

    if (interval === "YEARLY") {
      responseData.sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
      });
    } else {
      responseData.sort((a, b) => {
        const [, quarterA, yearA] = a.label.match(/(Q\d) (\d{4})/);
        const [, quarterB, yearB] = b.label.match(/(Q\d) (\d{4})/);
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }
        const quarterOrder = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
        return quarterOrder[quarterA] - quarterOrder[quarterB];
      });
    }

    Response(res).status(200).body(responseData).send();
  };

  //@desc find executive summary data of a bank of all items(categories).
  //@route POST /api/executiveSummary/figures
  //@access public
  getFigures = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
    const { startDate, endDate } = req.body;
    const startMonth = new Date(startDate).getUTCMonth();
    const endMonth = new Date(endDate).getUTCMonth();
    let query = {
      bankId: req.body.bankId,
      "meta.interval": "YEARLY",
    }
    if (startDate) {
      query = {
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
    const data = await ExecutiveSummaryService.find(query).sort({ "meta.date": 1 });

    const latestYear = new Date(data[data.length - 1].meta.date).getFullYear();

    const latestYearData = await ExecutiveSummaryService.find({
      bankId: req.body.bankId,
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(Date.UTC(latestYear, 0, 1, 0, 0, 0, 0)), $lte: new Date(Date.UTC(latestYear + 2, 0, 1, 0, 0, 0, 0)) },
    }).sort({ "meta.date": 1 });

    if (latestYearData) {
      data.push(...latestYearData);
    }

    const groupedData = {};
    data.forEach((entry) => {
      Object.keys(entry.toObject()).forEach((key) => {
        if (
          key !== "bankId" &&
          key !== "meta" &&
          !isNaN(entry[key]) &&
          !key.startsWith("_") &&
          key !== "createdAt" &&
          key !== "updatedAt"
        ) {
          if (!groupedData[key]) {
            groupedData[key] = [];
          }
          const year = entry.meta.label;
          const existingCategory = groupedData[key].find(
            (item) => item.category === key
          );
          if (!existingCategory) {
            groupedData[key].push({
              id: String(Object.keys(groupedData).length + 1),
              category: key,
              [year]: entry[key].toFixed(4),
            });
          } else {
            existingCategory[year] = entry[key].toFixed(4);
          }
        }
      });
    });

    const flatData = Object.values(groupedData).reduce(
      (acc, val) => acc.concat(val),
      []
    );

    const reorderedData = flatData.map((item) => {
      const { id, category, ...rest } = item;

      return {
        ...rest,
        category,
        id,
      };
    });

    // Logger.info(`Executive Summary of bank by item: ${flatData}`);
    Response(res).status(200).body(reorderedData).send();
  };

  //@desc find all executive summary data.
  //@route GET /api/executiveSummary/
  //@access public
  getAll = async (req, res) => {
    const summary = await ExecutiveSummaryService.find({});
    Response(res).status(200).body(summary).send();
  };



  getMetricData = async (req, res) => {
    try {

      const interval = req.query.interval || 'QUARTERLY';
      const startPeriod = req.query.startPeriod || 'Q1 2021';
      const endPeriod = req.query.endPeriod || 'Q1 2022';


      const summaries = await ExecutiveSummary.find({ 'meta.interval': interval }).populate('bankId', 'name');

      const filteredSummaries = summaries.filter(
        summary => summary.meta.label === startPeriod || summary.meta.label === endPeriod
      );


      const bankData = {};
      filteredSummaries.forEach(summary => {
        const bankName = summary.bankId.name;
        if (!bankData[bankName]) {
          bankData[bankName] = {};
        }
        bankData[bankName][summary.meta.label] = summary;
      });


      const metrics = [
        'grossYield', 'coF', 'nyi', 'fees', 'fx', 'otherIncome', 'operatingIncome',
        'operatingExpenses', 'income_before_provision_zakat_and_taxes', 'provisionExpenses',
        'income_before_zakat_and_taxes', 'zakat_and_taxes', 'netIncome', 'coreEarnings',
        'totalLoans', 'retailLoans', 'corporateLoans', 'consumerLoans', 'creditCards'
      ];


      const transformedData = metrics.map(metric => ({ metric }));


      Object.keys(bankData).forEach(bankName => {
        const bank = bankData[bankName];
        if (bank[startPeriod] && bank[endPeriod]) {
          metrics.forEach((metric, index) => {
            const startValue = bank[startPeriod][metric];
            const endValue = bank[endPeriod][metric];
            const net = ((endValue - startValue) / startValue * 100).toFixed(2) + '%';

            transformedData[index][bankName] = {
              net,
              [startPeriod.replace(' ', '_')]: startValue.toFixed(2),
              [endPeriod.replace(' ', '_')]: endValue.toFixed(2)
            };
          });
        }
      });


      res.status(200).json(transformedData);
    } catch (error) {
      console.error('Error fetching executive summaries:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


}

module.exports.ExecutiveSummaryController = new ExecutiveSummaryController();
