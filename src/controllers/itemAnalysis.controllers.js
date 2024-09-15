const { ObjectId } = require("mongoose").Types;

const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const Logger = require("../helpers/logger.helpers");

const { ItemAnalysisService } = require("../services/itemAnalysis.service");
const { BankService } = require("../services/bank.service");
const { ItemAnalysis } = require("../models/ItemAnalysis.model");

class ItemAnalysisController {
  //@desc add Item Analysis data for a bank with unique meta data!
  //@route POST /api/itemAnalysis/create
  //@access public
  create = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankId, meta } = req.body;

    if (!bankId || !meta || !meta.interval || !meta.label || !meta.date) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const dataAvailable = await ItemAnalysisService.findOne({
      bankId,
      meta,
    });
    if (dataAvailable) {
      throw new HttpError(400, "Meta data already exists!");
    }

    const ratio = await ItemAnalysisService.create({ ...req.body });

    if (ratio) {
      Response(res)
        .status(201)
        .message("Item Analysis created successfully")
        .send();
    } else {
      throw new HttpError(400, "Item Analysis data is not valid");
    }
  };

  addRankingInExistingData = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
    let { quarter, year } = req.query;
    const interval = quarter ? "QUARTERLY" : "YEARLY";
    if (quarter) year = `Q${quarter} ${year}`;
    const items = await ItemAnalysisService.find({ "meta.label": year }).lean();
    const result = [];
    const arrayOfTables = [
      {
        table: "balanceSheet",
        field: "demandDeposits",
      },
      {
        table: "balanceSheet",
        field: "t_and_s_deposits",
      },
      {
        table: "balanceSheet",
        field: "total_deposits",
      },
      {
        table: "balanceSheet",
        field: "investments",
      },
      {
        table: "balanceSheet",
        field: "assets",
      },
      {
        table: "balanceSheet",
        field: "lc",
      },
      {
        table: "balanceSheet",
        field: "lg",
      },
      {
        table: "balanceSheet",
        field: "trade_finance",
      },
      {
        table: "balanceSheet",
        field: "retail_performing_loans",
      },
      {
        table: "balanceSheet",
        field: "corporate_and_others_performing_loans",
      },
      {
        table: "balanceSheet",
        field: "total_loans_net",
      },
      {
        table: "incomeStatement",
        field: "grossYield",
      },
      {
        table: "incomeStatement",
        field: "coF",
      },
      {
        table: "incomeStatement",
        field: "nyi",
      },
      {
        table: "incomeStatement",
        field: "fees",
      },
      {
        table: "incomeStatement",
        field: "fx",
      },
      {
        table: "incomeStatement",
        field: "otherIncome",
      }, {
        table: "incomeStatement",
        field: "operatingIncome",
      }, {
        table: "incomeStatement",
        field: "salaries_and_employees_related_expenses",
      }, {
        table: "incomeStatement",
        field: "depreciation_and_amortization_expenses",
      },
      {
        table: "incomeStatement",
        field: "other_general_and_admin_expenses",
      },
      {
        table: "incomeStatement",
        field: "operatingExpenses",
      },
      {
        table: "incomeStatement",
        field: "provisions_loans_and_investments",
      },
      {
        table: "incomeStatement",
        field: "income_before_provisions",
      },
      {
        table: "incomeStatement",
        field: "income_before_zakat_and_tax",
      },
      {
        table: "incomeStatement",
        field: "netIncome",
      },
    ];
    //demand deposit
    for await (let row of arrayOfTables){
      const tableName = row.table;
      const fieldName = row.field;
      const sortedArray = await items.sort(
        (a, b) =>
          a[tableName]?.[fieldName]?.value - b[tableName]?.[fieldName]?.value
      );
      for (let i = 0; i < sortedArray.length; i++) {
        if (sortedArray[i]?.[tableName]?.[fieldName]?.rank) {
          const itemIndex = items.findIndex((item) => {
            // console.log(sortedArray[i])
            // console.log(i.bankId.toString())
  
            return (
              item?.bankId?.toString() === sortedArray[i]?.bankId?.toString()
            );
          });
          if (itemIndex > -1) {
            console.log("FOUND");
            items[itemIndex][tableName][fieldName].rank = i + 1;
          } else {
            console.log("NOTFOUND");
          }
        }
      }
    }
    
    // //demand deposit
    // const t_and_s_depositsSort = await items.sort((a,b)=>a.t_and_s_deposits?.value - b.t_and_s_deposits?.value)
    // for (let i = 0;i<t_and_s_depositsSort.length ;i++){
    //   if(t_and_s_depositsSort[i].balanceSheet?.t_and_s_deposits?.rank){
    //     t_and_s_depositsSort[i].balanceSheet.t_and_s_deposits.rank = i+1
    //   }
    // }
    for await (let analysis of items){
      await ItemAnalysis.findByIdAndUpdate(analysis._id,{...analysis})
    }
    Response(res)
      .status(201)
      .body({ items })
      .message("Item Analysis Ranking successfully")
      .send();
  };

  //@desc find Key Ratio data of bank by item(category).
  //@route POST /api/itemAnalysis/itemBank
  //@access public
  getItemBank = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankIds, table, category } = req.body;

    if (!bankIds || !category) {
      throw new HttpError(400, "Invalid request parameters!");
    }

    const query = {
      bankId: { $in: bankIds.map((id) => new ObjectId(id)) },
      "meta.interval": "YEARLY",
    };

    let sortedDocuments = await ItemAnalysisService.find(query).sort({
      "meta.label": 1,
    });

    let groupedData = {};

    sortedDocuments.forEach((doc) => {
      const { bankId, meta } = doc;
      const key = `${bankId}_${meta.label}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          bankId,
          label: meta.label,
          value: doc[table][category].value,
        };
      }
    });

    let results = Object.values(groupedData);

    const latestYear = new Date(
      results[results.length - 1].label
    ).getFullYear();

    const quarterlyData = await ItemAnalysisService.find({
      bankId: { $in: bankIds.map((id) => new ObjectId(id)) },
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(Date.UTC(Number(latestYear) + 1, 0, 1, 0, 0, 0, 0)) },
    }).sort({ "meta.label": 1 });

    results = results.concat(
      quarterlyData.map((data) => ({
        bankId: data.bankId.toString(),
        label: data.meta.label,
        value: data[table][category].value,
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

  //@desc find rank of a bank of all items(categories).
  //@route POST /api/itemAnalysis/rank
  //@access public
  getRankByCategory = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
    let data = await ItemAnalysisService.find({
      "meta.interval": "YEARLY",
    }).sort({ "meta.date": 1 });

    const { table, category } = req.body;

    const latestYear = new Date(data[data.length - 1].meta.date).getFullYear();

    const latestYearData = await ItemAnalysisService.find({
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(Date.UTC(Number(latestYear) + 1, 0, 1, 0, 0, 0, 0)) },
    }).sort({ "meta.date": 1 });

    if (latestYearData) {
      data.push(...latestYearData);
    }

    data = data.map((item) => {
      const { id, bankId, meta, balanceSheet, incomeStatement } = item;
      if (table === "balanceSheet") {
        return {
          id,
          bankId,
          meta,
          ...balanceSheet,
        };
      } else {
        return {
          id,
          bankId,
          meta,
          ...incomeStatement,
        };
      }
    });

    const bankNames = await BankService.find().select("_id name");

    const groupedData = {};
    data.forEach((entry) => {
      const rank = entry[category].rank.toString();
      if (!groupedData[rank]) {
        groupedData[rank] = {
          id: new ObjectId(),
          rank: rank,
        };
      }
      groupedData[rank][entry.meta.label] = bankNames.find(
        (bank) => bank._id.toString() === entry.bankId.toString()
      ).name;
    });

    const reorderedData = Object.values(groupedData).map((item) => {
      const { id, rank, ...values } = item;
      return {
        ...values,
        rank,
        id,
      };
    });

    Response(res).status(200).body(reorderedData).send();
  };

  //@desc find Item Analysis data of a item(category) of all banks.
  //@route POST /api/itemAnalysis/itemCategory
  //@access public
  getItemByCategory = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
    const {  startDate, endDate } = req.body;
    const startMonth = new Date(startDate).getUTCMonth();
    const endMonth = new Date(endDate).getUTCMonth();
    let query = {
      // bankId: req.body.bankId,
      "meta.interval": "YEARLY",
    }
    if(startDate){
      query ={
        // bankId: req.body.bankId,
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
    let data = await ItemAnalysisService.find(query).sort({ "meta.date": 1 });

    const { table, category } = req.body;

    const latestYear = new Date(data[data.length - 1].meta.date).getFullYear();

    const latestYearData = await ItemAnalysisService.find({
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(Date.UTC(Number(latestYear) + 1, 0, 1, 0, 0, 0, 0)) },
    }).sort({ "meta.date": 1 });

    if (latestYearData) {
      data.push(...latestYearData);
    }

    data = data.map((item) => {
      const { id, bankId, meta, balanceSheet, incomeStatement } = item;
      if (table === "balanceSheet") {
        return {
          id,
          bankId,
          meta,
          ...balanceSheet,
        };
      } else {
        return {
          id,
          bankId,
          meta,
          ...incomeStatement,
        };
      }
    });

    const groupedData = {};
    data.forEach((entry) => {
      const bankId = entry.bankId.toString();
      if (!groupedData[bankId]) {
        groupedData[bankId] = {};
      }
      groupedData[bankId][entry.meta.label] = {
        value: Number(entry[category].value).toFixed(4),
        share: Number(entry[category].share).toFixed(4),
        rank: entry[category].rank,
      };
    });

    const reorderedData = Object.entries(groupedData).map(
      ([bankId, values]) => ({
        ...values,
        bankId,
        id: new ObjectId(),
      })
    );

    Response(res).status(200).body(reorderedData).send();
  };

  //@desc find all Item Analysis data.
  //@route GET /api/itemAnalysis/
  //@access public
  getAll = async (req, res) => {
    const summary = await ItemAnalysisService.find();
    Response(res).status(200).body(summary).send();
  };

  updateDate = async (req, res) => {
    const summaries = await ItemAnalysisService.find({});

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

module.exports.ItemAnalysisController = new ItemAnalysisController();
