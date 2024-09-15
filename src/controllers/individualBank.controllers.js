const { ObjectId } = require("mongoose").Types;

const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const Logger = require("../helpers/logger.helpers");

const { BankService } = require("../services/bank.service");
const { KeyRatioService } = require("../services/keyRatio.service");
const { ItemAnalysisService } = require("../services/itemAnalysis.service");
const { BalanceSheetService } = require("../services/balanceSheet.service");
const {
  IncomeStatementService,
} = require("../services/incomeStatement.service");
const { InvestmentService } = require("../services/investment.service");
const { FinancingService } = require("../services/financing.service");
const {
  CustomerDepositService,
} = require("../services/customerDeposit.service");
const { DebitSecurityService } = require("../services/debitSecurity.service");
const { TradeFinanceService } = require("../services/tradeFinance.service");
const { OneOffIncomeService } = require("../services/oneOffIncome.service");
const { SegmentService } = require("../services/segment.service");
const {
  CapitalAdequacyService,
} = require("../services/capitalAdequacy.service");
const { ChannelService } = require("../services/channel.service");
const { BrokerageService } = require("../services/brokerage.service");
const {
  CostIncomeKeyRatioService,
} = require("../services/costIncomeKeyRatio.service");
const {
  CostRiskKeyRatioService,
} = require("../services/costRiskKeyRatio.service");
const { AllMarketShareService } = require("../services/allMarketShare.service");

class IndividualBankController {
  //@desc add individual bank data for a bank with unique meta data!
  //@route POST /api/individualBank/create
  //@access public
  create = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { data, category } = req.body;

    switch (category) {
      case "balanceSheet":
        await BalanceSheetService.create({ ...data });
        break;
      case "incomeStatement":
        await IncomeStatementService.create({ ...data });
        break;
      case "investments":
        await InvestmentService.create({ ...data });
        break;
      case "financing":
        await FinancingService.create({ ...data });
        break;
      case "customerDeposit":
        await CustomerDepositService.create({ ...data });
        break;
      case "debitSecurity":
        await DebitSecurityService.create({ ...data });
        break;
      case "tradeFinance":
        await TradeFinanceService.create({ ...data });
        break;
      case "oneOffIncome":
        await OneOffIncomeService.create({ ...data });
        break;
      case "segment":
        await SegmentService.create({ ...data });
        break;
      case "capitalAdequacy":
        await CapitalAdequacyService.create({ ...data });
        break;
      case "channel":
        await ChannelService.create({ ...data });
        break;
      case "brokerage":
        await BrokerageService.create({ ...data });
        break;
      default:
        break;
    }

    Response(res).status(201).message("Created successfully").send();
  };

  //@desc find individual bank data by table groups.
  //@route POST /api/individualBank/tables
  //@access public
  getTablesData = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankId, tableGroups } = req.body;

    let tablesData = {};

    for (const tableGroup of Object.keys(tableGroups)) {
      let data = null;
      let latestYear = null;
      let quarterlyData = null;
      let TableService = undefined;

      switch (tableGroup) {
        case "balanceSheet":
          TableService = BalanceSheetService;
          break;
        case "incomeStatement":
          TableService = IncomeStatementService;
          break;
        case "investment":
          TableService = InvestmentService;
          break;
        case "financing":
          TableService = FinancingService;
          break;
        case "customerDeposit":
          TableService = CustomerDepositService;
          break;
        case "debitSecurity":
          TableService = DebitSecurityService;
          break;
        case "tradeFinance":
          TableService = TradeFinanceService;
          break;
        case "oneOffIncome":
          TableService = OneOffIncomeService;
          break;
        case "segment":
          TableService = SegmentService;
          break;
        case "capitalAdequacy":
          TableService = CapitalAdequacyService;
          break;
        case "channel":
          TableService = ChannelService;
          break;
        case "brokerage":
          TableService = BrokerageService;
          break;
        case "costIncome":
          TableService = CostIncomeKeyRatioService;
          break;
        case "costRisk":
          TableService = CostRiskKeyRatioService;
          break;
        case "marketShare":
          TableService = AllMarketShareService;
          break;
        default:
          break;
      }

      data = await TableService.find({
        bankId,
        "meta.interval": "YEARLY",
      }).sort({ "meta.date": -1 });

      latestYear = data[0].meta.label;

      console.log(latestYear + 1)
      quarterlyData = await TableService.find({
        bankId,
        "meta.interval": "QUARTERLY",
        "meta.date": { $gte: new Date(Date.UTC((Number(latestYear) + 1), 0, 1, 0, 0, 0, 0)) },
      }).sort({ "meta.date": 1 });

      data = quarterlyData.concat(data);

      for (const table of tableGroups[tableGroup]) {
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

        const groupedData = {};
        extractedData.forEach((entry) => {
          Object.keys(entry).forEach((key) => {
            if (
              key !== "bankId" &&
              key !== "label" &&
              !isNaN(entry[key]) &&
              !key.startsWith("_") &&
              key !== "createdAt" &&
              key !== "updatedAt"
            ) {
              if (!groupedData[key]) {
                groupedData[key] = [];
              }
              const year = entry.label;
              const existingCategory = groupedData[key].find(
                (item) => item.category === key
              );
              if (!existingCategory) {
                groupedData[key].push({
                  id: String(Object.keys(groupedData).length + 1),
                  category: key,
                  [year]: entry[key],
                });
              } else {
                existingCategory[year] = entry[key];
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

        tablesData[table] = reorderedData;
      }
    }

    Response(res).status(200).body(tablesData).send();
  };

  //@desc find competition data by category.
  //@route POST /api/individualBank/competition
  //@access public
  getCompetitionData = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { year } = req.body;

    let competitionData = [];
    const categories = [
      {
        service: ItemAnalysisService,
        table: "$incomeStatement.income_before_provisions.value",
        category: "Income before Provisions",
        valueType: "currency",
      },
      {
        service: KeyRatioService,
        table: "$nim",
        category: "NIM %",
        valueType: "percentage"
      },
      {
        service: KeyRatioService,
        table: "$cor",
        category: "Cost of Risk %",
        valueType: "percentage"
      },
      {
        service: ItemAnalysisService,
        table: "$incomeStatement.operatingIncome.value",
        category: "Operating Income",
        valueType: "currency",
      },
      {
        service: ItemAnalysisService,
        table: "$incomeStatement.operatingExpenses.value",
        category: "Operating Expense",
        valueType: "currency",
      },
      {
        service: ItemAnalysisService,
        table: "$balanceSheet.investments.value",
        category: "Total Investment",
        valueType: "currency",
      },
      {
        service: KeyRatioService,
        table: "$income",
        category: "Cost of Income %",
        valueType: "percentage"
      },
      {
        service: ItemAnalysisService,
        table: "$balanceSheet.total_deposits.value",
        category: "Total Deposits",
        valueType: "currency",
      },
      {
        service: FinancingService,
        table: "$total.gross",
        category: "Total Gross Loans",
        valueType: "currency",
      },
    ];

    for (const category of categories) {
      console.log({category})
      let data = await category.service.aggregate([
        {
          $match: { "meta.label": year },
        },
        {
          $addFields:{
            value:{
              $toDouble:category.table
            }
          }
        },
        {
          $sort:{
            value:1
          }
        },
        {
          $group: {
            _id: null,
            maxValue: {
              $last:category.table
            },
            max: { $last: "$$ROOT" },
            // bankId:{$first:"$bankId"},
            // items: { $push: {bankId:"$bankId",value: {
            //   $toDouble: category.table,
            // }} },
            minValue: {
              $first:category.table
            },
            min:{ $first: "$$ROOT" },
          },
        },
      //   {
      //     $unwind:{
      //       path:"$items"
      //     }
      //   },
      
      // //  {
      // //   $group:{
      // //     _id:"$bankId",
      // //     maxValue:{$last:"$items.value"},
      // //     minValue:{$first:"$items.value"},
      // //     max:{$last:{bankId:"$items.bankId"}},
      // //     min:{$first:{bankId:"$items.bankId"}}
      // //   },
      // //  },
        {
          $project: {
            _id: 0,
            category: category.category,
            highest: {
              value:{$toDouble: "$maxValue"},
              bankId: "$max.bankId",
              valueType: category.valueType,
            },
            lowest: {
              value: {$toDouble:"$minValue"},
              bankId: "$min.bankId",
              valueType: category.valueType,
            },
          },
        },
      ]);

      competitionData.push(data[0]);
    }

    Response(res).status(200).body(competitionData).send();
  };

  //@desc find individual bank data by table groups.
  //@route POST /api/individualBank/trend
  //@access public
  getTrendTable = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankIds, categories } = req.body;

    let TableService = null;

    if (categories[0].value === "demandDeposits") {
      TableService = CustomerDepositService;
    } else {
      TableService = FinancingService;
    }

    let data = await TableService.find({
      bankId: { $in: bankIds.map((id) => new ObjectId(id)) },
      "meta.interval": "YEARLY",
    }).sort({ "meta.date": -1 });

    const latestYear = data[0].meta.label;

    const quarterlyData = await TableService.find({
      bankId: { $in: bankIds.map((id) => new ObjectId(id)) },
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(latestYear) },
    }).sort({ "meta.date": -1 });

    data = quarterlyData.concat(data);

    const bankNames = await Promise.all(
      bankIds.map(async (id) => {
        const bank = await BankService.find({ _id: id });
        return { bankId: id, name: bank[0].name };
      })
    );

    const groupedData = {};
    categories.forEach((category) => {
      const tableName = category.value === "gross" ? category.table : category.value;
      data.forEach((entry) => {
        if (!groupedData[tableName]) {
          groupedData[tableName] = [];
        }
        const year = entry.meta.label;
        const existingBank = groupedData[tableName].find(
          (item) => item.bankId.toString() === entry.bankId.toString()
        );
        if (!existingBank) {
          groupedData[tableName].push({
            id: String(Object.keys(groupedData).length + 1),
            bankId: entry.bankId,
            [year]: entry[category.table][category.value],
          });
        } else {
          existingBank[year] = entry[category.table][category.value];
        }
      });
    });

    let reorderedData = {};

    for (const category of Object.keys(groupedData)) {
      reorderedData[category] = groupedData[category].map((item) => {
        const { id, bankId, ...rest } = item;
        const bank = bankNames.find(
          (bank) => bank.bankId.toString() === bankId.toString()
        ).name;
        return {
          ...rest,
          bank,
          id,
        };
      });
    }

    Response(res).status(200).body(reorderedData).send();
  };

  //@desc find Bank data.
  //@route POST /api/individualBank/bank
  //@access public
  getBankData = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { bankId, table, category } = req.body;

    if (!bankId || !category) {
      throw new HttpError(400, "Invalid request parameters!");
    }

    let TableService = null;

    if (table === "customerDeposit") {
      TableService = CustomerDepositService;
    } else {
      TableService = FinancingService;
    }

    const query = {
      bankId: bankId,
      "meta.interval": "YEARLY",
    };

    let sortedDocuments = await TableService.find(query).sort({
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
          value: doc[table][category],
        };
      }
    });

    // console.log(groupedData)

    let results = Object.values(groupedData);

    const latestYear = new Date(
      results[results.length - 1].label
    ).getFullYear();

    const quarterlyData = await TableService.find({
      bankId: bankId,
      "meta.interval": "QUARTERLY",
      "meta.date": { $gte: new Date(Date.UTC(Number(latestYear) + 1, 0, 1, 0, 0, 0, 0)) },
    }).sort({ "meta.label": 1 });

    results = results.concat(
      quarterlyData.map((data) => ({
        bankId: data.bankId.toString(),
        label: data.meta.label,
        value: data[table][category],
      }))
    );

    const bankNames = await Promise.all(
      [bankId].map(async (id) => {
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
}

module.exports.IndividualBankController = new IndividualBankController();
