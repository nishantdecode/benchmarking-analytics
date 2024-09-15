const { fetchBankMain } = require("../helpers/fetchBankData.helper");
const Logger = require("../helpers/logger.helpers");
const Response = require("../helpers/Response.helpers");
const path = require("path");
const fs = require("fs");
const { BalanceSheetService } = require("../services/balanceSheet.service");
const { BalanceSheet } = require("../models/BalanceSheet.model");
const { IncomeStatement } = require("../models/IncomeStatement.model");
const { Investment } = require("../models/Investment.model");
const { Financing } = require("../models/Financing.model");
const { CustomerDeposit } = require("../models/CustomerDeposit.model");
const { DebitSequrity } = require("../models/DebitSecurity.model");
const { TradeFinance } = require("../models/TradeFinance.model");
const { OneOffIncome } = require("../models/OneOffIncome.model");
const { Segment } = require("../models/Segment.model");
const { CapitalAdequacy } = require("../models/CapitalAdequacy.model");
const { Channel } = require("../models/Channel.model");
const { Brokerage } = require("../models/Brokerage.model");
const { ExecutiveSummary } = require("../models/ExecutiveSummary.model");
const {
  ExecutiveSummaryService,
} = require("../services/executiveSummary.service");
const { BulkControllers } = require("./bulk.controllers");
const { Bank } = require("../models/Bank.model");
const HttpError = require("../helpers/HttpError.helpers");
class FetchBankDataController {
  _fetchBankAndUpdate = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
    const bankId = req.params.id;
    console.log({ bankId });

    const bank = await Bank.findById(bankId)
    if (!bank) throw new HttpError(400, "No Bank Found");
    if (!bank.dataUrl) {
      throw new HttpError(400, "Data Url not found");
  }

    await fetchBankMain(bank);

    if (!bank.extraction || typeof bank.extraction !== "object") {
      bank.extraction = {};
    }

    if (bank.extraction.disabled === undefined) {
      bank.extraction.disabled = true;
    }

    if (bank.extraction.status === undefined) {
      bank.extraction.status = "Extraction requested";
    }

    const tempFolder = path.join(__dirname, "../temp");
    let data = [];
    function convertObjectStringsToNumbers(obj) {
      let convertedObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let value = obj[key];
          if (typeof value === "string" && value.includes(",")) {
            // Remove commas and convert to number
            convertedObj[key] = parseFloat(value.replace(/,/g, ""));
          } else {
            // Keep the original value if it's not a string with commas
            convertedObj[key] = value;
          }
        }
      }
      return convertedObj;
    }
    fs.readdirSync(tempFolder).forEach(async (filename) => {
      const filePath = path.join(tempFolder, filename);
      const jsonData = require(filePath);
      // data.push(jsonData);
      const realData = await convertObjectStringsToNumbers(jsonData.data);
      //test
      // const bankId = jsonData.bankId;
      let interval = jsonData.interval.includes("Quarter")
        ? "QUARTERLY"
        : "YEARLY";
      let year = parseInt(new Date(jsonData.date).getFullYear());
      let previousYear =
        parseInt(new Date(jsonData.date).getFullYear()) - 1 || 0;
      const date = new Date();
      date.setFullYear(new Date(jsonData.date).getFullYear());
      date.setMonth(0);
      date.setDate(1);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      const latestRecord = await BalanceSheetService.findOne({
        bankId,
        "meta.label":
          interval === "YEARLY"
            ? year
            : `Q${jsonData.interval.split(" ")[1]} ${year}`,
      })
        .sort({ "meta.date": -1 })
        .lean()[0];
      if (!latestRecord) {
        const json = {
          year: new Date(jsonData.date).getFullYear(),
          cash:
            realData[
              "Cash and balances with Saudi Arabian Monetary Authority"
            ] || 0,
          dueFromBanksAndOtherFinancial:
            realData["Due from banks and other financial institutions"] || 0,
          loan: realData["Loans,financing and advances, net"] || 0,
          investments: realData["Investments, net"] || 0,
          property: realData["Property and equipment, net"] || 0,
          investedProperty: 0,
          otherAssets: realData["Other assets"] || 0,
          otherRealEstate: realData["Other real estate, net"] || 0,
          derivatives: 0,
          goodWill: 0,
          investmentInAssociation: 0,
          totalAssets: realData["Total assets"] || 0,
          dueToSaudiMonetaryAutority:
            realData["Due to Saudi Arabian Monetary Authority"] || 0,
          customerDeposit: realData["Customer's deposits"] || 0,
          debetSecurityIssued: 0,
          netDerivatives: 0,
          otherLiablities: realData["Other liabilities"] || 0,
          totalLiablities: realData["Total liabilities"] || 0,
          shareCapital: realData["Share capital"] || 0,
          statutoryReserve: realData["Statutory reserve"] || 0,
          totalOtherReserve: realData["Total other reserves"] || 0,
          retainedEarning:
            realData["Retained earnings (accumulated losses)"] || 0,
          proposedDividends: realData["Proposed dividend"] || 0,
          treasuryShares: 0,
          employeeRelated: 0,
          foreignCurrenyReserve: 0,
          totalShareHolderEquity:
            realData["Total equity attributable to equity holders of bank"] ||
            0,
          tier1skuku: 0,
          bankEquityHolder:
            realData["Total equity attributable to equity holders of bank"] ||
            0,
          nonControllingIntersts: 0,
          totalEquity: realData["Total equity"] || 0,
          totalLiabilityAndEquity:
            realData["Total liabilities and equity"] || 0,
          gross:
            realData[
              "Special commission income/ gross financing and investment income"
            ] || 0,
          cof:
            realData["Special commission expenses / return on deposits"] || 0,
          nyi:
            realData[
              "Special commission income (expense)/ financing and investment income (expense), net"
            ] || 0,
          fees: realData["Fee income (expense) from banking services"] || 0,
          fx: realData["Foreign exchange income (expense)"] || 0,
          fvisInvestments: 0,
          tradingIncome: 0,
          dividentIncome: 0,
          nonTradingIncome: 0,
          otherIncomeNet: realData["Other operating income"] || 0,
          totalOperatingEquity: realData["Total operating income"] || 0,
          salaries: realData["Salaries and employee related expenses"] || 0,
          rentExpenses: 0,
          depreciationExpenses:
            realData["Depreciation and amortisation expense"] || 0,
          amortisationExpenses: 0,
          otherGeneralExpenses:
            realData["Other general and administrative expenses"] || 0,
          otherExpenses: 0,
          financialImpairment:
            realData[
              "Impairment (reversal of impairment) charge for other financial assets"
            ] || 0,
          investmentImpairment: 0,
          totalOperatingExpenses: realData["Total operating expenses"] || 0,
          otherIncome: 0,
          netIncomeBeforeZakat:
            realData[
              "Profit (loss) from continuing operations before zakat and income tax"
            ] || 0,
          zakat:
            realData["Zakat expenses on continuing operations for period"] || 0,
          netIncomeAfterZakat:
            realData["Profit (loss) from continuing operations"] || 0,
          equityHoldersOfTheBank:
            realData[
              "Profit (loss), attributable to equity holders of parent company"
            ] || 0,
          nonControllingInterestTotalIncome: 0,
          totalNetIncome: 0,
          totalInvestments: 0,
          investmentInAssociation: 0,
          Portfolio: 0,
          retailPerformingLoans: 0,
          retailNpl: 0,
          retailgross: 0,
          retailallowance: 0,
          retailnetLoan: 0,
          corporateperformingLoans: 0,
          corportatenpl: 0,
          corporategross: 0,
          corporateallowance: 0,
          corporatenetloan: 0,
          ccperformingLoans: 0,
          ccnpl: 0,
          ccgross: 0,
          ccallowance: 0,
          ccnetloan: 0,
          consumerperformingloan: 0,
          consumernpl: 0,
          consumergross: 0,
          consumerallowance: 0,
          consumernetloan: 0,
          totalperformingLoans: 0,
          totalnpl: 0,
          totalgross: 0,
          totalallowance: 0,
          totalnetloan: 0,
          demandDeposits: 0,
          customerTimeInvestment: 0,
          customerSavings: 0,
          otherDeposits: 0,
          totalDeposits: 0,
          totalNonCommissionDeposits: 0,
          timeSavingsDeposits: 0,
          shortTermPortion: 0,
          longTermPortion: 0,
          LCs: 0,
          LGs: 0,
          totalTradeFinance: 0,
          nonTradingGains: 0,
          otherGains: 0,
          adjustedIncome: 0,
          retail: {
            assets: 0,
            liabilities: 0,
            revenues: 0,
            costs: 0,
            financialImpairments: 0,
            investmentImpairments: 0,
            totalProvisions: 0,
            totalExpenses: 0,
            ppi: 0,
            preZakat: 0,
          },
          corporate: {
            assets: 0,
            liabilities: 0,
            revenues: 0,
            costs: 0,
            financialImpairments: 0,
            investmentImpairments: 0,
            totalProvisions: 0,
            totalExpenses: 0,
            ppi: 0,
            preZakat: 0,
          },
          treasury: {
            assets: 0,
            liabilities: 0,
            revenues: 0,
            costs: 0,
            financialImpairments: 0,
            investmentImpairments: 0,
            totalProvisions: 0,
            totalExpenses: 0,
            ppi: 0,
            preZakat: 0,
          },
          rwa: 0,
          tier1: 0,
          tier2: 0,
          sumOfTier: 0,
          tier1CAR: 0,
          sumOfTierCAR: 0,
          branches: 0,
          atms: 0,
          pos: 0,
          remittance: 0,
          brokrage: 0,
        };

        if (jsonData.interval.includes("Quarter")) {
          const quarter = parseInt(jsonData.interval.split(" ")[1]);
          json.year = `Q${quarter} ${json.year}`;
          previousYear = `Q${quarter} ${previousYear}`;

          if (parseInt(quarter) === 2) {
            date.setMonth(4);
          } else if (parseInt(quarter) === 3) {
            date.setMonth(7);
          } else if (parseInt(quarter) === 4) {
            date.setMonth(10);
          }
        }
        //balance sheet
        let balanceSheet = await BalanceSheet.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (balanceSheet) {
          balanceSheet = await BalanceSheet.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              assets: {
                cash: json.cash,
                dueFromBanksAndOtherFinancial:
                  json.dueFromBanksAndOtherFinancial,
                investments: json.investments,
                property: json.property,
                investedProperty: json.investedProperty,
                otherAssets: json.otherAssets,
                otherRealEstate: json.otherRealEstate,
                derivatives: json.derivatives,
                goodWill: json.goodWill,
                investmentInAssociation: json.investmentInAssociation,
                totalAssets: json.totalAssets,
              },
              liabilities: {
                dueToSaudiMonetaryAutority: json.dueToSaudiMonetaryAutority,
                customerDeposit: json.customerDeposit,
                debetSecurityIssued: json.debetSecurityIssued,
                netDerivatives: json.netDerivatives,
                otherLiablities: json.otherLiablities,
                totalLiablities: json.totalLiablities,
              },
              shareEquityHolder: {
                shareCapital: json.shareCapital,
                statutoryReserve: json.statutoryReserve,
                totalOtherReserve: json.totalOtherReserve,
                retainedEarning: json.retainedEarning,
                proposedDividends: json.proposedDividends,
                treasuryShares: json.treasuryShares,
                employeeRelated: json.employeeRelated,
                foreignCurrenyReserve: json.foreignCurrenyReserve,
                totalShareHolderEquity: json.totalShareHolderEquity,
              },
              equity: {
                tier1skuku: json.tier1skuku,
                bankEquityHolder: json.bankEquityHolder,
                nonControllingIntersts: json.nonControllingIntersts,
                totalEquity: json.totalEquity,
              },
              liabilityAndEquity: {
                totalLiabilityAndEquity: json.totalLiabilityAndEquity,
              },
            }
          );
        } else {
          balanceSheet = await BalanceSheet.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            assets: {
              cash: json.cash,
              dueFromBanksAndOtherFinancial: json.dueFromBanksAndOtherFinancial,
              investments: json.investments,
              property: json.property,
              investedProperty: json.investedProperty,
              otherAssets: json.otherAssets,
              otherRealEstate: json.otherRealEstate,
              derivatives: json.derivatives,
              goodWill: json.goodWill,
              investmentInAssociation: json.investmentInAssociation,
              totalAssets: json.totalAssets,
            },
            liabilities: {
              dueToSaudiMonetaryAutority: json.dueToSaudiMonetaryAutority,
              customerDeposit: json.customerDeposit,
              debetSecurityIssued: json.debetSecurityIssued,
              netDerivatives: json.netDerivatives,
              otherLiablities: json.otherLiablities,
              totalLiablities: json.totalLiablities,
            },
            shareEquityHolder: {
              shareCapital: json.shareCapital,
              statutoryReserve: json.statutoryReserve,
              totalOtherReserve: json.totalOtherReserve,
              retainedEarning: json.retainedEarning,
              proposedDividends: json.proposedDividends,
              treasuryShares: json.treasuryShares,
              employeeRelated: json.employeeRelated,
              foreignCurrenyReserve: json.foreignCurrenyReserve,
              totalShareHolderEquity: json.totalShareHolderEquity,
            },
            equity: {
              tier1skuku: json.tier1skuku,
              bankEquityHolder: json.bankEquityHolder,
              nonControllingIntersts: json.nonControllingIntersts,
              totalEquity: json.totalEquity,
            },
            liabilityAndEquity: {
              totalLiabilityAndEquity: json.totalLiabilityAndEquity,
            },
          });
        }

        //income sheet
        let incomeStatement = await IncomeStatement.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (incomeStatement) {
          incomeStatement = await IncomeStatement.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              nyi: {
                gross: json.gross,
                cof: json.cof,
                nyi: json.nyi,
              },
              totalOperatingEquity: {
                fees: json.fees,
                fx: json.fx,
                fvisInvestments: json.fvisInvestments,
                tradingIncome: json.tradingIncome,
                dividentIncome: json.dividentIncome,
                nonTradingIncome: json.nonTradingIncome,
                otherIncome: json.otherIncomeNet,
                totalOperatingEquity: json.totalOperatingEquity,
              },
              totalOperatingExpenses: {
                salaries: json.salaries,
                rentExpenses: json.rentExpenses,
                depreciationExpenses: json.depreciationExpenses,
                amortisationExpenses: json.amortisationExpenses,
                otherGeneralExpenses: json.otherGeneralExpenses,
                otherExpenses: json.otherExpenses,
                financialImpairment: json.financialImpairment,
                investmentImpairment: json.investmentImpairment,
                totalOperatingExpenses: json.totalOperatingExpenses,
              },
              netIncomeBeforeZakat: {
                otherIncome: json.otherIncome,
                netIncomeBeforeZakat: json.netIncomeBeforeZakat,
              },
              netIncomeAfterZakat: {
                zakat: json.zakat,
                netIncomeAfterZakat: json.netIncomeAfterZakat,
              },
              equityHolder: {
                equityHoldersOfTheBank: json.equityHoldersOfTheBank,
              },
              totalNetIncome: {
                nonControllingInterest: json.nonControllingInterestTotalIncome,
                totalNetIncome: json.totalNetIncome,
              },
              overall: {
                income_before_provsions_zakat_taxes:
                  json.financialImpairment +
                  json.investmentImpairment +
                  json.netIncomeBeforeZakat,
                cost:
                  json.salaries +
                  json.depreciationExpenses +
                  json.otherGeneralExpenses,
                income: json.totalOperatingEquity,
                totalProvisions:
                  json.financialImpairment + json.investmentImpairment,
                fxAndOtherIncome:
                  json.fvisInvestments +
                  json.tradingIncome +
                  json.dividentIncome +
                  json.nonTradingGains +
                  json.otherIncomeNet +
                  json.fx,
                otherIncome:
                  json.fvisInvestments +
                  json.tradingIncome +
                  json.dividentIncome +
                  json.nonTradingGains +
                  json.otherIncomeNet,
                nyi: json.totalOperatingEquity - json.nyi,
                staffExpenses: json.salaries,
                nonStaffExpenses:
                  json.otherGeneralExpenses + json.depreciationExpenses,
              },
            }
          );
        } else {
          incomeStatement = await IncomeStatement.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            nyi: {
              gross: json.gross,
              cof: json.cof,
              nyi: json.nyi,
            },
            totalOperatingEquity: {
              fees: json.fees,
              fx: json.fx,
              fvisInvestments: json.fvisInvestments,
              tradingIncome: json.tradingIncome,
              dividentIncome: json.dividentIncome,
              nonTradingIncome: json.nonTradingIncome,
              otherIncome: json.otherIncomeNet,
              totalOperatingEquity: json.totalOperatingEquity,
            },
            totalOperatingExpenses: {
              salaries: json.salaries,
              rentExpenses: json.rentExpenses,
              depreciationExpenses: json.depreciationExpenses,
              amortisationExpenses: json.amortisationExpenses,
              otherGeneralExpenses: json.otherGeneralExpenses,
              otherExpenses: json.otherExpenses,
              financialImpairment: json.financialImpairment,
              investmentImpairment: json.investmentImpairment,
              totalOperatingExpenses: json.totalOperatingExpenses,
            },
            netIncomeBeforeZakat: {
              otherIncome: json.otherIncome,
              netIncomeBeforeZakat: json.netIncomeBeforeZakat,
            },
            netIncomeAfterZakat: {
              zakat: json.zakat,
              netIncomeAfterZakat: json.netIncomeAfterZakat,
            },
            equityHolder: {
              equityHoldersOfTheBank: json.equityHoldersOfTheBank,
            },
            totalNetIncome: {
              nonControllingInterest: json.nonControllingInterestTotalIncome,
              totalNetIncome: json.totalNetIncome,
            },
            overall: {
              income_before_provsions_zakat_taxes:
                json.financialImpairment +
                json.investmentImpairment +
                json.netIncomeBeforeZakat,
              cost:
                json.salaries +
                json.depreciationExpenses +
                json.otherGeneralExpenses,
              income: json.totalOperatingEquity,
              totalProvisions:
                json.financialImpairment + json.investmentImpairment,
              fxAndOtherIncome:
                json.fvisInvestments +
                json.tradingIncome +
                json.dividentIncome +
                json.nonTradingGains +
                json.otherIncomeNet +
                json.fx,
              otherIncome:
                json.fvisInvestments +
                json.tradingIncome +
                json.dividentIncome +
                json.nonTradingGains +
                json.otherIncomeNet,
              nyi: json.totalOperatingEquity - json.nyi,
              staffExpenses: json.salaries,
              nonStaffExpenses:
                json.otherGeneralExpenses + json.depreciationExpenses,
            },
          });
        }

        //Investments sheet
        let investments = await Investment.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (investments) {
          investments = await Investment.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              portfolio: {
                totalInvestments: json.totalInvestments,
                investmentInAssociation: json.investmentInAssociation,
                Portfolio: json.Portfolio,
              },
            }
          );
        } else {
          investments = await Investment.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            portfolio: {
              totalInvestments: json.totalInvestments,
              investmentInAssociation: json.investmentInAssociation,
              Portfolio: json.Portfolio,
            },
          });
        }

        //Investments sheet
        let financing = await Financing.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (financing) {
          financing = await Financing.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              retail: {
                performingLoans: json.retailPerformingLoans,
                npl: json.retailNpl,
                gross: json.retailgross,
                allowance: json.retailallowance,
                netLoan: json.retailnetLoan,
              },
              corporate: {
                performingLoans: json.corporateperformingLoans,
                npl: json.corportatenpl,
                gross: json.corporategross,
                allowance: json.corporateallowance,
                netLoan: json.corporatenetloan,
              },
              consumer: {
                performingLoans: json.consumerperformingloan,
                npl: json.consumernpl,
                gross: json.consumergross,
                allowance: json.consumerallowance,
                netLoan: json.consumernetloan,
              },
              total: {
                performingLoans: json.totalperformingLoans,
                npl: json.totalnpl,
                gross: json.totalgross,
                allowance: json.totalallowance,
                netLoan: json.totalnetloan,
              },
              creditCard: {
                performingLoans: json.ccperformingLoans,
                npl: json.ccnpl,
                gross: json.ccgross,
                allowance: json.ccallowance,
                netLoan: json.ccnetloan,
              },
            }
          );
        } else {
          financing = await Financing.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            retail: {
              performingLoans: json.retailPerformingLoans,
              npl: json.retailNpl,
              gross: json.retailgross,
              allowance: json.retailallowance,
              netLoan: json.retailnetLoan,
            },
            corporate: {
              performingLoans: json.corporateperformingLoans,
              npl: json.corportatenpl,
              gross: json.corporategross,
              allowance: json.corporateallowance,
              netLoan: json.corporatenetloan,
            },
            consumer: {
              performingLoans: json.consumerperformingloan,
              npl: json.consumernpl,
              gross: json.consumergross,
              allowance: json.consumerallowance,
              netLoan: json.consumernetloan,
            },
            total: {
              performingLoans: json.totalperformingLoans,
              npl: json.totalnpl,
              gross: json.totalgross,
              allowance: json.totalallowance,
              netLoan: json.totalnetloan,
            },
            creditCard: {
              performingLoans: json.ccperformingLoans,
              npl: json.ccnpl,
              gross: json.ccgross,
              allowance: json.ccallowance,
              netLoan: json.ccnetloan,
            },
          });
        }

        let customerDeposit = await CustomerDeposit.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (customerDeposit) {
          customerDeposit = await CustomerDeposit.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              customerDeposit: {
                demandDeposits: json.demandDeposits,
                customerTimeInvestment: json.customerTimeInvestment,
                customerSavings: json.customerSavings,
                otherDeposits: json.otherDeposits,
                totalDeposits: json.totalDeposits,
                totalNonCommissionDeposits: json.totalNonCommissionDeposits,
                timeSavingsDeposits: json.timeSavingsDeposits,
              },
            }
          );
        } else {
          customerDeposit = await CustomerDeposit.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            customerDeposit: {
              demandDeposits: json.demandDeposits,
              customerTimeInvestment: json.customerTimeInvestment,
              customerSavings: json.customerSavings,
              otherDeposits: json.otherDeposits,
              totalDeposits: json.totalDeposits,
              totalNonCommissionDeposits: json.totalNonCommissionDeposits,
              timeSavingsDeposits: json.timeSavingsDeposits,
            },
          });
        }

        let debitSecurity = await DebitSequrity.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (debitSecurity) {
          debitSecurity = await DebitSequrity.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              debitSecurity: {
                shortTermPortion: json.shortTermPortion,
                longTermPortion: json.longTermPortion,
              },
            }
          );
        } else {
          debitSecurity = await DebitSequrity.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            debitSecurity: {
              shortTermPortion: json.shortTermPortion,
              longTermPortion: json.longTermPortion,
            },
          });
        }

        let tradeFinance = await TradeFinance.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (tradeFinance) {
          tradeFinance = await TradeFinance.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              tradeFinance: {
                LCs: json.LCs,
                LGs: json.LGs,
                totalTradeFinance: json.totalTradeFinance,
              },
            }
          );
        } else {
          tradeFinance = await TradeFinance.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            tradeFinance: {
              LCs: json.LCs,
              LGs: json.LGs,
              totalTradeFinance: json.totalTradeFinance,
            },
          });
        }

        let oneOffIncome = await OneOffIncome.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (oneOffIncome) {
          oneOffIncome = await OneOffIncome.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              oneOffIncome: {
                nonTradingGains: json.nonTradingGains,
                otherGains: json.otherGains,
                adjustedIncome: json.adjustedIncome,
              },
            }
          );
        } else {
          oneOffIncome = await OneOffIncome.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            oneOffIncome: {
              nonTradingGains: json.nonTradingGains,
              otherGains: json.otherGains,
              adjustedIncome: json.adjustedIncome,
            },
          });
        }

        let segment = await Segment.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (segment) {
          segment = await Segment.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              retailSegment: {
                assets: json.retail.assets,
                liabilities: json.retail.liabilities,
                revenues: json.retail.revenues,
                costs: json.retail.costs,
                financialImpairments: json.retail.financialImpairments,
                investmentImpairments: json.retail.investmentImpairments,
                totalProvisions: json.retail.totalProvisions,
                totalExpenses: json.retail.totalExpenses,
                ppi: json.retail.ppi,
                preZakat: json.retail.preZakat,
              },
              corporateSegment: {
                assets: json.corporate.assets,
                liabilities: json.corporate.liabilities,
                revenues: json.corporate.revenues,
                costs: json.corporate.costs,
                financialImpairments: json.corporate.financialImpairments,
                investmentImpairments: json.corporate.investmentImpairments,
                totalProvisions: json.corporate.totalProvisions,
                totalExpenses: json.corporate.totalExpenses,
                ppi: json.corporate.ppi,
                preZakat: json.corporate.preZakat,
              },
              treasury: {
                assets: json.treasury.assets,
                liabilities: json.treasury.liabilities,
                revenues: json.treasury.revenues,
                costs: json.treasury.costs,
                financialImpairments: json.treasury.financialImpairments,
                investmentImpairments: json.treasury.investmentImpairments,
                totalProvisions: json.treasury.totalProvisions,
                totalExpenses: json.treasury.totalExpenses,
                ppi: json.treasury.ppi,
                preZakat: json.treasury.preZakat,
              },
            }
          );
        } else {
          segment = await Segment.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            retailSegment: {
              assets: json.retail.assets,
              liabilities: json.retail.liabilities,
              revenues: json.retail.revenues,
              costs: json.retail.costs,
              financialImpairments: json.retail.financialImpairments,
              investmentImpairments: json.retail.investmentImpairments,
              totalProvisions: json.retail.totalProvisions,
              totalExpenses: json.retail.totalExpenses,
              ppi: json.retail.ppi,
              preZakat: json.retail.preZakat,
            },
            corporateSegment: {
              assets: json.corporate.assets,
              liabilities: json.corporate.liabilities,
              revenues: json.corporate.revenues,
              costs: json.corporate.costs,
              financialImpairments: json.corporate.financialImpairments,
              investmentImpairments: json.corporate.investmentImpairments,
              totalProvisions: json.corporate.totalProvisions,
              totalExpenses: json.corporate.totalExpenses,
              ppi: json.corporate.ppi,
              preZakat: json.corporate.preZakat,
            },
            treasury: {
              assets: json.treasury.assets,
              liabilities: json.treasury.liabilities,
              revenues: json.treasury.revenues,
              costs: json.treasury.costs,
              financialImpairments: json.treasury.financialImpairments,
              investmentImpairments: json.treasury.investmentImpairments,
              totalProvisions: json.treasury.totalProvisions,
              totalExpenses: json.treasury.totalExpenses,
              ppi: json.treasury.ppi,
              preZakat: json.treasury.preZakat,
            },
          });
        }

        let capitalAdequacy = await CapitalAdequacy.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (capitalAdequacy) {
          capitalAdequacy = await CapitalAdequacy.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              capitalAdequacy: {
                rwa: json.rwa,
                tier1: json.tier1,
                tier2: json.tier2,
                sumOfTier: json.sumOfTier,
                tier1CAR: json.tier1CAR,
                sumOfTierCAR: json.sumOfTierCAR,
              },
            }
          );
        } else {
          capitalAdequacy = await CapitalAdequacy.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            capitalAdequacy: {
              rwa: json.rwa,
              tier1: json.tier1,
              tier2: json.tier2,
              sumOfTier: json.sumOfTier,
              tier1CAR: json.tier1CAR,
              sumOfTierCAR: json.sumOfTierCAR,
            },
          });
        }

        let channel = await Channel.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (channel) {
          channel = await Channel.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              channel: {
                branches: json.branches,
                atms: json.atms,
                pos: json.pos,
                remittance: json.remittance,
              },
            }
          );
        } else {
          channel = await Channel.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            channel: {
              branches: json.branches,
              atms: json.atms,
              pos: json.pos,
              remittance: json.remittance,
            },
          });
        }

        let brokerage = await Brokerage.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });

        if (brokerage) {
          brokerage = await Brokerage.findOneAndUpdate(
            {
              bankId,
              "meta.interval": interval,
              "meta.label": json.year,
            },
            {
              brokerage: {
                brokerageFirms: json.brokrage,
              },
            }
          );
        } else {
          brokerage = await Brokerage.create({
            bankId: bankId,
            meta: {
              date,
              label: json.year,
              interval,
            },
            brokerage: {
              brokerageFirms: json.brokrage,
            },
          });
        }
        let executiveSummary = await ExecutiveSummary.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": json.year,
        });
        if (executiveSummary) {
          await ExecutiveSummaryService.findByIdAndUpdate(
            executiveSummary._id,
            {
              meta: {
                interval: interval,
                label: json.year,
                date: date,
              },
              grossYield: json.gross ? parseInt(json.gross) / 1000000 : 0,
              coF: json.cof ? parseInt(json.cof) / 1000000 : 0,
              nyi: json.nyi ? parseInt(json.nyi) / 1000000 : 0,
              fees: json.fees ? parseInt(json.fees) / 1000000 : 0,
              fx: json.fx ? parseInt(json.fx) / 1000000 : 0,
              otherIncome: json.otherIncomeNet
                ? ((parseInt(json.fvisInvestments) || 0) +
                    (parseInt(json.tradingIncome) || 0) +
                    (parseInt(json.dividentIncome) || 0) +
                    (parseInt(json.nonTradingGains) || 0) +
                    (parseInt(json.otherIncomeNet) || 0)) /
                  1000000
                : 0,
              operatingIncome: json.totalOperatingEquity
                ? parseInt(json.totalOperatingEquity) / 1000000
                : 0,
              operatingExpenses:
                ((parseInt(json.salaries) || 0) +
                  (parseInt(json.otherExpenses) || 0) +
                  (parseInt(json.amortisationExpenses) || 0) +
                  (parseInt(json.rentExpenses) || 0) +
                  (parseInt(json.otherGeneralExpenses) || 0) +
                  (parseInt(json.depreciationExpenses) || 0)) /
                  1000000 || 0,
              income_before_provision_zakat_and_taxes: json.netIncomeBeforeZakat
                ? (parseInt(json.netIncomeBeforeZakat) +
                    (parseInt(json.financialImpairment) || 0) +
                    (parseInt(json.investmentImpairment) || 0)) /
                  1000000
                : 0,
              provisionExpenses: json.financialImpairment
                ? ((parseInt(json.financialImpairment) || 0) +
                    (parseInt(json.investmentImpairment) || 0)) /
                  1000000
                : 0,
              income_before_zakat_and_taxes: json.netIncomeBeforeZakat
                ? parseInt(json.netIncomeBeforeZakat) / 1000000
                : 0,
              zakat_and_taxes: json.zakat
                ? parseInt(json.zakat) / 1000000 || 0
                : 0,
              netIncome: json.equityHoldersOfTheBank
                ? parseInt(json.equityHoldersOfTheBank) / 1000000
                : 0,
              coreEarnings:
                ((parseInt(json.nyi) || 0) +
                  (parseInt(json.fees) || 0) +
                  parseInt(json.fx || 0)) /
                1000000,
              totalLoans:
                ((parseInt(json.retailnetLoan) || 0) +
                  (parseInt(json.corporatenetloan) || 0)) /
                1000000,
              retailLoans:
                (parseInt(json.retailPerformingLoans) || 0) / 1000000,
              corporateLoans:
                (parseInt(json.corporateperformingLoans) || 0) / 1000000,
              consumerLoans:
                ((parseInt(json.retailPerformingLoans) || 0) -
                  (parseInt(json.ccperformingLoans) || 0)) /
                1000000,
              creditCards: (parseInt(json.ccperformingLoans) || 0) / 1000000,
            }
          );
        } else {
          await ExecutiveSummary.create({
            bankId: bankId,
            meta: {
              interval: interval,
              label: json.year,
              date: date,
            },
            grossYield: json.gross ? parseInt(json.gross) / 1000000 : 0,
            coF: json.cof ? parseInt(json.cof) / 1000000 : 0,
            nyi: json.nyi ? parseInt(json.nyi) / 1000000 : 0,
            fees: json.fees ? parseInt(json.fees) / 1000000 : 0,
            fx: json.fx ? parseInt(json.fx) / 1000000 : 0,
            otherIncome: json.otherIncome
              ? parseInt(json.otherIncome) / 1000000
              : 0,
            operatingIncome: json.totalOperatingEquity
              ? parseInt(json.totalOperatingEquity) / 1000000
              : 0,
            operatingExpenses: json.totalOperatingExpenses
              ? parseInt(json.totalOperatingExpenses) / 1000000
              : 0,
            income_before_provision_zakat_and_taxes: json.netIncomeBeforeZakat
              ? (parseInt(json.netIncomeBeforeZakat) +
                  (parseInt(json.financialImpairment) || 0) +
                  (parseInt(json.investmentImpairment) || 0)) /
                1000000
              : 0,
            provisionExpenses: json.financialImpairment
              ? ((parseInt(json.financialImpairment) || 0) +
                  (parseInt(json.investmentImpairment) || 0)) /
                1000000
              : 0,
            income_before_zakat_and_taxes: json.netIncomeBeforeZakat
              ? parseInt(json.netIncomeBeforeZakat) / 1000000
              : 0,
            zakat_and_taxes: json.zakat
              ? parseInt(json.zakat) / 1000000 || 0
              : 0,
            netIncome: json.equityHoldersOfTheBank
              ? parseInt(json.equityHoldersOfTheBank) / 1000000
              : 0,
            coreEarnings:
              ((parseInt(json.nyi) || 0) +
                (parseInt(json.fees) || 0) +
                parseInt(json.fx || 0)) /
              1000000,
            totalLoans:
              ((parseInt(json.retailnetLoan) || 0) +
                (parseInt(json.corporatenetloan) || 0)) /
              1000000,
            retailLoans: (parseInt(json.retailPerformingLoans) || 0) / 1000000,
            corporateLoans:
              (parseInt(json.corporateperformingLoans) || 0) / 1000000,
            consumerLoans:
              ((parseInt(json.retailPerformingLoans) || 0) -
                (parseInt(json.ccperformingLoans) || 0)) /
              1000000,
            creditCards: (parseInt(json.ccperformingLoans) || 0) / 1000000,
          });
        }

        await BulkControllers.syncKeyRatios(
          bankId,
          interval,
          json.year,
          previousYear,
          date,
          json
        );
        await BulkControllers.syncCommonSize(
          bankId,
          interval,
          json.year,
          date,
          json
        );
        const ms = await BulkControllers.syncMarketShares(
          bankId,
          interval,
          json.year,
          date
        );
        await BulkControllers.syncItemAnalysis(
          bankId,
          interval,
          json.year,
          date,
          json,
          ms
        );
        await BulkControllers.syncRanking(interval, json.year);
        fs.unlinkSync(filePath);
      } else {
        fs.unlinkSync(filePath);
      }

      // await Bank.findByIdAndUpdae(bankId, updateData);
    });

    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear();

    const extractionDates = [
      new Date(Date.UTC(currentYear, 9, 1, 0, 0, 0, 0)),
      new Date(Date.UTC(currentYear, 6, 1, 0, 0, 0, 0)),
      new Date(Date.UTC(currentYear, 3, 1, 0, 0, 0, 0)),
      new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0, 0)),
    ];

    let extractionDate;
    for (const date of extractionDates) {
      if (currentDate >= date) {
        extractionDate = new Date(date);
        break;
      }
    }

    bank.extraction.date = extractionDate.toISOString();

    bank.extraction.status = "Data extracted";

    await bank.save();

    Response(res)
      .status(200)
      .message("Bank Data Fetched successfully")
      .body(data)
      .send();
  };
  get fetchBankAndUpdate() {
    return this._fetchBankAndUpdate;
  }
  set fetchBankAndUpdate(value) {
    this._fetchBankAndUpdate = value;
  }
}

module.exports.FetchBankDataController = new FetchBankDataController();
