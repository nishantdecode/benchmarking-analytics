const { ObjectId } = require("mongoose").Types;

const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const Logger = require("../helpers/logger.helpers");

const { KeyRatioService } = require("../services/keyRatio.service");
const { BankService } = require("../services/bank.service");

class KeyRatioController {
  //@desc add Key Ratio data for a bank with unique meta data!
  //@route POST /api/keyRatio/create
  //@access public
  create = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankId, meta } = req.body;

    if (!bankId || !meta || !meta.interval || !meta.label || !meta.date) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const dataAvailable = await KeyRatioService.findOne({
      bankId,
      meta,
    });
    if (dataAvailable) {
      throw new HttpError(400, "Meta data already exists!");
    }

    const ratio = await KeyRatioService.create({ ...req.body });

    if (ratio) {
      Response(res)
        .status(201)
        .message("Key Ratio created successfully")
        .send();
    } else {
      throw new HttpError(400, "Key Ratio data is not valid");
    }
  };

  //@desc Get all years for which data is available in meta.date field and sort them in descending order
  //@route GET /api/keyRatio/years
  //@access public
  getAllYears = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

   await KeyRatioService.find({}).then(obj => {
    obj.map(async ele => {
      const year = new Date(ele?.meta?.date).getFullYear()
      if(year === 0){
        console.log({ele,year})
        await KeyRatioService.findByIdAndDelete(ele._id)
      }
    })
    })
  //  console.log(await KeyRatioService.find({})
  //  .distinct("meta.date"))

    const uniqueYears = await KeyRatioService.find({})
      .distinct("meta.date")
      .then((dates) => dates.map((date,i) => {
        const year = new Date(date).getFullYear()
        if(year === 0){
          // console.log({date,year,i})
        }
        return year
      }))
      .then((years) => [...new Set(years)])
      .then((uniqueYears) => uniqueYears.sort((a, b) => a - b));

    Response(res).status(200).body(uniqueYears).send();
  };

  //@desc find Key Ratio data of bank by item(category).
  //@route POST /api/keyRatio/ratioBank
  //@access public
  getRatioBank = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankIds, category } = req.body;

    if (!bankIds || !category) {
      throw new HttpError(400, "Invalid request parameters!");
    }

    console.log(bankIds)

    const query = {
      bankId: { $in: bankIds.map((id) => new ObjectId(id)) },
      "meta.interval": "YEARLY",
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
          "_id.label": 1,
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

    let results = await KeyRatioService.aggregate(pipeline);

    const latestYear = new Date(
      results[results.length - 1].label
    ).getFullYear();

    const quarterlyData = await KeyRatioService.find({
      bankId: { $in: bankIds.map((id) => new ObjectId(id)) },
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(Date.UTC(Number(latestYear) + 1, 0, 1, 0, 0, 0, 0)) },
    }).sort({ "meta.date": 1 });

    results = results.concat(
      quarterlyData.map((data) => ({
        bankId: data.bankId.toString(),
        label: data.meta.label,
        value: data[category],
      }))
    );

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

    responseData.sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });

    Response(res).status(200).body(responseData).send();
  };

  //@desc find Key Ratio data of bank by item(category) in a given date range.
  //@route POST /api/keyRatio/ratio
  //@access public
  getRatio = async (req, res) => {
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

    let results = await KeyRatioService.aggregate(pipeline);

    if (interval === "YEARLY") {
      const year = new Date(endDate).getFullYear();
      const yearlyDataExists = results.some(
        (result) => result.label === year.toString()
      );

      if (!yearlyDataExists) {
        const quarterlyData = await KeyRatioService.find({
          bankId: { $in: bankIds.map((id) => new ObjectId(id)) },
          "meta.interval": "QUARTERLY",
          "meta.date": {
            $gte: new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
          },
        }).sort({ "meta.date": 1 });

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

  //@desc find Key Ratio data of a bank of all items(categories).
  //@route POST /api/keyRatio/figures
  //@access public
  getFigures = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
    const {startDate,endDate} = req.body
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
    const data = await KeyRatioService.find(query).sort({ "meta.date": 1 });

    const latestYear = new Date(data[data.length - 1].meta.date).getFullYear();

    const latestYearData = await KeyRatioService.find({
      bankId: req.body.bankId,
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(Date.UTC(Number(latestYear) + 1, 0, 1, 0, 0, 0, 0)) },
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

    Response(res).status(200).body(reorderedData).send();
  };

  //@desc find Key Ratio data of a item(category) of all banks.
  //@route POST /api/keyRatio/figuresCategory
  //@access public
  getFiguresByCategory = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
    const data = await KeyRatioService.find({
      "meta.interval": "YEARLY",
    }).sort({ "meta.date": 1 });

    const { category } = req.body;

    const latestYear = new Date(data[data.length - 1].meta.date).getFullYear();

    const latestYearData = await KeyRatioService.find({
      "meta.interval": "QUARTERLY",
      "meta.date": {
        $gte: new Date(Date.UTC(Number(latestYear) + 1, 0, 1, 0, 0, 0, 0)),
      },
    }).sort({ "meta.date": 1 });

    if (latestYearData) {
      data.push(...latestYearData);
    }

    const groupedData = {};
    data.forEach((entry) => {
      const bankId = entry.bankId.toString();
      if (!groupedData[bankId]) {
        groupedData[bankId] = {};
      }
      groupedData[bankId][entry.meta.label] = entry[category].toFixed(4);
    });

    const reorderedData = Object.entries(groupedData).map(
      ([bankId, values]) => ({
        ...values,
        bankId,
        id: new ObjectId(),
      })
    );

    [reorderedData[0], reorderedData[1]] = [reorderedData[1], reorderedData[0]];
    Response(res).status(200).body(reorderedData).send();
  };

  //@desc find all Key Ratio data.
  //@route GET /api/keyRatio/
  //@access public
  getAll = async (req, res) => {
    const summary = await KeyRatioService.find();
    Response(res).status(200).body(summary).send();
  };
}

module.exports.KeyRatioController = new KeyRatioController();
