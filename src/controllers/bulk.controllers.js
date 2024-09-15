const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const excelToJson = require("convert-excel-to-json");

const { BalanceSheetService } = require("../services/balanceSheet.service");
const {
  IncomeStatementService,
} = require("../services/incomeStatement.service");
const { parse } = require("json2csv");
const { FinancingService } = require("../services/financing.service");
const {
  CustomerDepositService,
} = require("../services/customerDeposit.service");
const { DebitSecurityService } = require("../services/debitSecurity.service");
const { TradeFinanceService } = require("../services/tradeFinance.service");
const { OneOffIncomeService } = require("../services/oneOffIncome.service");
const { InvestmentService } = require("../services/investment.service");
const {
  CapitalAdequacyService,
} = require("../services/capitalAdequacy.service");
const { ChannelService } = require("../services/channel.service");
const { BrokerageService } = require("../services/brokerage.service");
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
const {
  ExecutiveSummaryService,
} = require("../services/executiveSummary.service");
const { KeyRatioService } = require("../services/keyRatio.service");
const { CommonSizeService } = require("../services/commonSize.service");
const { Bank } = require("../models/Bank.model");
const { AllMarketShare } = require("../models/AllMarketShare.model");
const { MarketShare } = require("../models/MarketShare.model");
const { ItemAnalysis } = require("../models/ItemAnalysis.model");
const { CostIncomeKeyRatio } = require("../models/CostIncomeKeyRatio.model");
const { CostRiskKeyRatio } = require("../models/CostRiskKeyRatio.model");
class BulkControllers {
  exportData = async (req, res) => {
    const { year, quarter, bankId } = req.query;
    const interval = parseInt(quarter) ? "QUARTERLY" : "YEARLY";
    const balanceSheets = await BalanceSheet.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });
    const incomeStatements = await IncomeStatement.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });
    const investmentsSheets = await Investment.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });
    const financingSheets = await Financing.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });

    const customerDepositSheets = await CustomerDeposit.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });

    const debitSecuritySheets = await DebitSequrity.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });

    const tradeFinanceSheets = await TradeFinance.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });

    const oneOffIncomeSheets = await OneOffIncome.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });
    const segmentSheets = await Segment.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });
    const capitalAdequacySheets = await CapitalAdequacy.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });
    const channelSheets = await Channel.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });
    const brokerageSheets = await Brokerage.find({
      bankId,
      "meta.interval": interval,
      // "meta.label": year,
    });
    let yearsData = await BalanceSheet.find({bankId,"meta.interval":interval}).sort({"meta.date":1}).distinct("meta.date");
    let years = yearsData.map(e => new Date(e).getFullYear());
    let jsonArray = []
    for (let year of years){
      let balanceSheet = balanceSheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let incomeStatement = incomeStatements.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let investments = investmentsSheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let financing = financingSheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let customerDeposit = customerDepositSheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let debitSecurity = debitSecuritySheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let tradeFinance = tradeFinanceSheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let oneOffIncome = oneOffIncomeSheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let segment = segmentSheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let capitalAdequacy = capitalAdequacySheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let channel = channelSheets.find(item => new Date(item?.meta?.date).getFullYear() === year)
      let brokerage = brokerageSheets.find(item => new Date(item?.meta?.date).getFullYear() === year)

      const json = {
        Year: year || 0,
        Cash: balanceSheet?.assets?.cash || 0,
        "Due from Banks & FIs":
          balanceSheet?.assets?.dueFromBanksAndOtherFinancial || 0,
        "Investments (net)": balanceSheet?.assets?.investments || 0,
        "PP&E": balanceSheet?.assets?.property || 0,
        "Invested properties (net)": balanceSheet?.assets?.investedProperty || 0,
        "Other Assets": balanceSheet?.assets?.otherAssets || 0,
        "Other Real Estate": balanceSheet?.assets?.otherRealEstate || 0,
        Derivatives: balanceSheet?.assets?.derivatives || 0,
        Goodwill: balanceSheet?.assets?.goodWill || 0,
        "Investments in Associates":
          balanceSheet?.assets?.investmentInAssociation || 0,
        "Total Assets": balanceSheet?.assets?.totalAssets || 0,
        "Due to Banks & other FIs":
          balanceSheet?.liabilities?.dueToSaudiMonetaryAutority || 0,
        "Customers' Deposits": balanceSheet?.liabilities?.customerDeposit || 0,
        "Debet Securities issued/Borrowings":
          balanceSheet?.liabilities?.debetSecurityIssued || 0,
        "Derivatives (net)": balanceSheet?.liabilities?.netDerivatives || 0,
        "Other Liabilties": balanceSheet?.liabilities?.otherLiablities || 0,
        "Total Liabilities": balanceSheet?.liabilities?.totalLiablities || 0,
        "Share Capital": balanceSheet?.shareEquityHolder?.shareCapital || 0,
        "Statutory Reserve":
          balanceSheet?.shareEquityHolder?.statutoryReserve || 0,
        "Other Reserve": balanceSheet?.shareEquityHolder?.totalOtherReserve || 0,
        "Retained Earnings":
          balanceSheet?.shareEquityHolder?.retainedEarning || 0,
        "Proposed Dividends":
          balanceSheet?.shareEquityHolder?.proposedDividends || 0,
        "Treasury Shares": balanceSheet?.shareEquityHolder?.treasuryShares || 0,
        "Employees' Related":
          balanceSheet?.shareEquityHolder?.employeeRelated || 0,
        "Foreign Currency Translation Reserve":
          balanceSheet?.shareEquityHolder?.foreignCurrenyReserve || 0,
        "Total Shareholders' Equity":
          balanceSheet?.shareEquityHolder?.totalShareHolderEquity || 0,
        "Tier I Sukuk": balanceSheet?.equity?.tier1skuku || 0,
        "Equity Holders": balanceSheet?.equity?.bankEquityHolder || 0,
        "Non-Controlling Interests":
          balanceSheet?.equity?.nonControllingIntersts || 0,
        "Total Equity": balanceSheet?.equity?.totalEquity || 0,
        "Total Liabilities & Equity":
          balanceSheet?.liabilityAndEquity?.totalLiabilityAndEquity || 0,
        "Gross Financing & Investment Income": incomeStatement?.nyi?.gross || 0,
        "CoF (Postive Value)": incomeStatement?.nyi?.cof || 0,
        NYI: incomeStatement?.nyi?.nyi || 0,
        "Fees (net)": incomeStatement?.totalOperatingEquity?.fees || 0,
        "FX (net)": incomeStatement?.totalOperatingEquity?.fx || 0,
        "Income (loss) from FVIS Invesements (net)":
          incomeStatement?.totalOperatingEquity?.fvisInvestments || 0,
        "Trading Income (net)":
          incomeStatement?.totalOperatingEquity?.tradingIncome || 0,
        "Dividends Income":
          incomeStatement?.totalOperatingEquity?.dividentIncome || 0,
        "Gains on non-trading Financial insts. (net)":
          incomeStatement?.totalOperatingEquity?.nonTradingIncome || 0,
        "Other Income (Expenses) (net)":
          incomeStatement?.totalOperatingEquity?.otherIncome || 0,
        "Total Operating Income":
          incomeStatement?.totalOperatingEquity?.totalOperatingEquity || 0,
        "Salaries & Employees-related Expenses":
          incomeStatement?.totalOperatingExpenses?.salaries || 0,
        "Rent Expenses":
          incomeStatement?.totalOperatingExpenses?.rentExpenses || 0,
        "Depreciation & Amortisation":
          incomeStatement?.totalOperatingExpenses?.depreciationExpenses || 0,
        "Amortisation Expenses":
          incomeStatement?.totalOperatingExpenses?.amortisationExpenses || 0,
        "Other General & Admin. Expenses":
          incomeStatement?.totalOperatingExpenses?.otherGeneralExpenses || 0,
        "Other Expenses":incomeStatement?.totalOperatingExpenses?.otherExpenses || 0,
          "Impairments - Financing (net)":
          incomeStatement?.totalOperatingExpenses?.financialImpairment || 0,
        "Impairments - Investments (net)":
          incomeStatement?.totalOperatingExpenses?.investmentImpairment || 0,
        "Total Operating Expenses":
          incomeStatement?.totalOperatingExpenses?.totalOperatingExpenses || 0,
        "Other Income (expenses)":
          incomeStatement?.netIncomeBeforeZakat?.otherIncome || 0,
        "Total Net Income before Zakat":
          incomeStatement?.netIncomeBeforeZakat?.netIncomeBeforeZakat || 0,
        Zakat: incomeStatement?.netIncomeAfterZakat?.zakat || 0,
        "Total Net Income after Zakat":
          incomeStatement?.netIncomeAfterZakat?.netIncomeAfterZakat || 0,
        "Equity Holders of the bank":
          incomeStatement?.equityHolder?.equityHoldersOfTheBank || 0,
        "Non-Controlling Interests(netIncome)":
          incomeStatement?.totalNetIncome?.nonControllingInterest || 0,
        "Total Net Income": incomeStatement?.totalNetIncome?.totalNetIncome || 0,
        "Total Investments": investments?.portfolio?.totalInvestments || 0,
        "Investments in associates & JVs - Total":
          investments?.portfolio?.investmentInAssociation || 0,
        "Portfolio (net)": investments?.portfolio?.Portfolio || 0,
        "Retail - Performing Loans": financing?.retail?.performingLoans || 0,
        "Retail - NPLs": financing?.retail?.npl || 0,
        "Retail - Gross": financing?.retail?.gross || 0,
        "Allowance for Retail": financing?.retail?.allowance || 0,
        "Retail - Net Loans": financing?.retail?.netLoan || 0,
        "Corporate & Others - Performing Loans":
          financing?.corporate?.performingLoans || 0,
        "Corporate & Others - NPLs": financing?.corporate?.npl || 0,
        "Corporate & Others - Gross": financing?.corporate?.gross || 0,
        "Allowance for Corporate & Others": financing?.corporate?.allowance || 0,
        "Corporate & Others - Net Loans": financing?.corporate?.netLoan || 0,
        "CC - Performing Loans": financing?.creditCard?.performingLoans || 0,
        "CC - NPLs": financing?.creditCard?.npl || 0,
        "CC - Gross": financing?.creditCard?.gross || 0,
        "Allowance for CC": financing?.creditCard?.allowance || 0,
        "CC - Net Loans": financing?.creditCard?.netLoan || 0,
        "Consumer Loans - Performing Loans":
          financing?.consumer?.performingLoans || 0,
        "Consumer Loans - NPLs": financing?.consumer?.npl || 0,
        "Consumer Loans - Gross": financing?.consumer?.gross || 0,
        "Allowance for Consumer Loans": financing?.consumer?.allowance || 0,
        "Consumer Loans - Net Loans": financing?.consumer?.netLoan || 0,
        "Total - Performing Loans": financing?.total?.performingLoans || 0,
        "Total - NPLs": financing?.total?.npl || 0,
        "Total - Gross": financing?.total?.gross || 0,
        "Allowance for Total": financing?.total?.allowance || 0,
        "Total - Net Loans": financing?.total?.netLoan || 0,
        "Demand Deposits/Current Accounts":
          customerDeposit?.customerDeposit?.demandDeposits || 0,
        "Customers' Time Investments":
          customerDeposit?.customerDeposit?.customerTimeInvestment || 0,
        "Customers' Savings":
          customerDeposit?.customerDeposit?.customerSavings || 0,
        "Other Deposits": customerDeposit?.customerDeposit?.otherDeposits || 0,
        "Total Deposits": customerDeposit?.customerDeposit?.totalDeposits || 0,
        "Total Non-Commission Deposits":
          customerDeposit?.customerDeposit?.totalNonCommissionDeposits || 0,
        "Time & Savings Deposits":
          customerDeposit?.customerDeposit?.timeSavingsDeposits || 0,
        "The Short-Term Portion Debit Securities":
          debitSecurity?.debitSecurity?.shortTermPortion || 0,
        "The Long-Term Portion Debit Securities":
          debitSecurity?.debitSecurity?.longTermPortion || 0,
        LCs: tradeFinance?.tradeFinance?.LCs || 0,
        LGs: tradeFinance?.tradeFinance?.LGs || 0,
        "Total Trade Finance": tradeFinance?.tradeFinance?.totalTradeFinance || 0,
        "Gains on non-trading Financial insts. (net)(OneOff income)":
          oneOffIncome?.oneOffIncome?.nonTradingGains || 0,
        "Other One-Offs Income/Gains (Loss)":
          oneOffIncome?.oneOffIncome?.otherGains || 0,
        "Income (Adjusted) (for C/I%)":
          oneOffIncome?.oneOffIncome?.adjustedIncome || 0,
        "Retail Segment - Assets": segment?.retailSegment?.assets || 0,
        "Retail Segment - Liabilities": segment?.retailSegment?.liabilities || 0,
        "Retail Segment - Net Revenues": segment?.retailSegment?.revenues || 0,
        "Retail Segment - Costs": segment?.retailSegment?.costs || 0,
        "Retail Segment - Impairments - Financing (net)":
          segment?.retailSegment?.financialImpairments || 0,
        "Retail Segment - Impairments - Investments/Others (net)":
          segment?.retailSegment?.investmentImpairments || 0,
        "Retail Segment - Total Provisions":
          segment?.retailSegment?.totalProvisions || 0,
        "Retail Segment - Total Expenses":
          segment?.retailSegment?.totalExpenses || 0,
        "Retail Segment - PPI": segment?.retailSegment?.ppi || 0,
        "Retail Segment - Net Income pre-zakat":
          segment?.retailSegment?.preZakat || 0,
  
        "Corporate Segment - Assets": segment?.corporateSegment?.assets || 0,
        "Corporate Segment - Liabilities":
          segment?.corporateSegment?.liabilities || 0,
        "Corporate Segment - Net Revenues":
          segment?.corporateSegment?.revenues || 0,
        "Corporate Segment - Costs": segment?.corporateSegment?.costs || 0,
        "Corporate Segment - Impairments - Financing (net)":
          segment?.corporateSegment?.financialImpairments || 0,
        "Corporate Segment - Impairments - Investments/Others (net)":
          segment?.corporateSegment?.investmentImpairments || 0,
        "Corporate Segment - Total Provisions":
          segment?.corporateSegment?.totalProvisions || 0,
        "Corporate Segment - Total Expenses":
          segment?.corporateSegment?.totalExpenses || 0,
        "Corporate Segment - PPI": segment?.corporateSegment?.ppi || 0,
        "Corporate Segment - Net Income pre-zakat":
          segment?.corporateSegment?.preZakat || 0,
  
        "Treasury Segment - Assets": segment?.treasury?.assets || 0,
        "Treasury Segment - Liabilities": segment?.treasury?.liabilities || 0,
        "Treasury Segment - Net Revenues": segment?.treasury?.revenues || 0,
        "Treasury Segment - Costs": segment?.treasury?.costs || 0,
        "Treasury Segment - Impairments - Financing (net)":
          segment?.treasury?.financialImpairments || 0,
        "Treasury Segment - Impairments - Investments/Others (net)":
          segment?.treasury?.investmentImpairments || 0,
        "Treasury Segment - Total Provisions":
          segment?.treasury?.totalProvisions || 0,
        "Treasury Segment - Total Expenses":
          segment?.treasury?.totalExpenses || 0,
        "Treasury Segment - PPI": segment?.treasury?.ppi || 0,
        "Treasury Segment - Net Income pre-zakat":
          segment?.treasury?.preZakat || 0,
        "Total Pillar I - RWA": capitalAdequacy?.capitalAdequacy?.rwa || 0,
        "Tier I": capitalAdequacy?.capitalAdequacy?.tier1 || 0,
        "Tier II": capitalAdequacy?.capitalAdequacy?.tier2 || 0,
        "Tier I+II": capitalAdequacy?.capitalAdequacy?.sumOfTier || 0,
        "CAR (Tier I)%": capitalAdequacy?.capitalAdequacy?.tier1CAR || 0,
        "CAR (Tier I + II)%": capitalAdequacy?.capitalAdequacy?.sumOfTierCAR || 0,
        Branches: channel?.channel?.branches || 0,
        ATMs: channel?.channel?.atms || 0,
        "POS Terminals": channel?.channel?.pos || 0,
        "Remittance Centers": channel?.channel?.remittance || 0,
        "Brokerage Firms (Value Traded) YTD":
          brokerage?.brokerage?.brokerageFirms || 0,
      };
      jsonArray.push(json)
    }
    

    // Set response headers for CSV download
    const csv = parse(jsonArray);

    // res.header("Content-Type", "text/csv");
    // res.attachment("data.csv");
    // res.send(csv);

    Response(res).body({ csv }).send();
  };

  importData = async (req, res) => {
    let {  quarter, bankId } = req.query;
    const interval = parseInt(quarter) ? "QUARTERLY" : "YEARLY";
   
    const result = excelToJson({
      source: req.file.buffer, // fs.readFileSync return a Buffer
      delimiter: ','
    });
    const sheetName = Object.keys(result)[0]; // Assuming there's at least one sheet

    const resultData = [];
    for (let row = 0; row < result[sheetName].length; row++) {
      if (row === 0) {
        continue;
      }
      const json = {
        year: parseInt(result[sheetName][row].A) || 0,
        cash: parseInt(result[sheetName][row].B) || 0,
        dueFromBanksAndOtherFinancial: parseInt(result[sheetName][row].C) || 0,
        investments: parseInt(result[sheetName][row].D) || 0,
        property: parseInt(result[sheetName][row].E) || 0,
        investedProperty: parseInt(result[sheetName][row].F) || 0,
        otherAssets: parseInt(result[sheetName][row].G) || 0,
        otherRealEstate: parseInt(result[sheetName][row].H) || 0,
        derivatives: parseInt(result[sheetName][row].I) || 0,
        goodWill: parseInt(result[sheetName][row].J) || 0,
        investmentInAssociation: parseInt(result[sheetName][row].K) || 0,
        totalAssets: parseInt(result[sheetName][row].L) || 0,
        dueToSaudiMonetaryAutority: parseInt(result[sheetName][row].M) || 0,
        customerDeposit: parseInt(result[sheetName][row].N) || 0,
        debetSecurityIssued: parseInt(result[sheetName][row].O) || 0,
        netDerivatives: parseInt(result[sheetName][row].P) || 0,
        otherLiablities: parseInt(result[sheetName][row].Q) || 0,
        totalLiablities: parseInt(result[sheetName][row].R) || 0,
        shareCapital: parseInt(result[sheetName][row].S) || 0,
        statutoryReserve: parseInt(result[sheetName][row].T) || 0,
        totalOtherReserve: parseInt(result[sheetName][row].U) || 0,
        retainedEarning: parseInt(result[sheetName][row].V) || 0,
        proposedDividends: parseInt(result[sheetName][row].W) || 0,
        treasuryShares: parseInt(result[sheetName][row].X) || 0,
        employeeRelated: parseInt(result[sheetName][row].Y) || 0,
        foreignCurrenyReserve: parseInt(result[sheetName][row].Z) || 0,
        totalShareHolderEquity: parseInt(result[sheetName][row].AA) || 0,
        tier1skuku: parseInt(result[sheetName][row].AB) || 0,
        bankEquityHolder: parseInt(result[sheetName][row].AC) || 0,
        nonControllingIntersts: parseInt(result[sheetName][row].AD) || 0,
        totalEquity: parseInt(result[sheetName][row].AE) || 0,
        totalLiabilityAndEquity: parseInt(result[sheetName][row].AF) || 0,
        gross: parseInt(result[sheetName][row].AG) || 0,
        cof: parseInt(result[sheetName][row].AH) || 0,
        nyi: parseInt(result[sheetName][row].AI) || 0,
        fees: parseInt(result[sheetName][row].AJ) || 0,
        fx: parseInt(result[sheetName][row].AK) || 0,
        fvisInvestments: parseInt(result[sheetName][row].AL) || 0,
        tradingIncome: parseInt(result[sheetName][row].AM) || 0,
        dividentIncome: parseInt(result[sheetName][row].AN) || 0,
        nonTradingIncome: parseInt(result[sheetName][row].AO) || 0,
        otherIncomeNet: parseInt(result[sheetName][row].AP) || 0,
        totalOperatingEquity: parseInt(result[sheetName][row].AQ) || 0,
        salaries: parseInt(result[sheetName][row].AR) || 0,
        rentExpenses: parseInt(result[sheetName][row].AS) || 0,
        depreciationExpenses: parseInt(result[sheetName][row].AT) || 0,
        amortisationExpenses: parseInt(result[sheetName][row].AU) || 0,
        otherGeneralExpenses: parseInt(result[sheetName][row].AV) || 0,
        otherExpenses:parseInt(result[sheetName][row].AW) || 0,
        financialImpairment: parseInt(result[sheetName][row].AX) || 0,
        investmentImpairment: parseInt(result[sheetName][row].AY) || 0,
        totalOperatingExpenses: parseInt(result[sheetName][row].AZ) || 0,
        otherIncome: parseInt(result[sheetName][row].BA) || 0,
        netIncomeBeforeZakat: parseInt(result[sheetName][row].BB) || 0,
        zakat: parseInt(result[sheetName][row].BC) || 0,
        netIncomeAfterZakat: parseInt(result[sheetName][row].BD) || 0,
        equityHoldersOfTheBank: parseInt(result[sheetName][row].BE) || 0,
        nonControllingInterestTotalIncome:
          parseInt(result[sheetName][row].BF) || 0,
        totalNetIncome: parseInt(result[sheetName][row].BG) || 0,
        totalInvestments: parseInt(result[sheetName][row].BH) || 0,
        investmentInAssociation: parseInt(result[sheetName][row].BI) || 0,
        Portfolio: parseInt(result[sheetName][row].BJ) || 0,
        retailPerformingLoans: parseInt(result[sheetName][row].BK) || 0,
        retailNpl: parseInt(result[sheetName][row].BL) || 0,
        retailgross: parseInt(result[sheetName][row].BM) || 0,
        retailallowance: parseInt(result[sheetName][row].BN) || 0,
        retailnetLoan: parseInt(result[sheetName][row].BO) || 0,
        corporateperformingLoans: parseInt(result[sheetName][row].BP) || 0,
        corportatenpl: parseInt(result[sheetName][row].BQ) || 0,
        corporategross: parseInt(result[sheetName][row].BR) || 0,
        corporateallowance: parseInt(result[sheetName][row].BS) || 0,
        corporatenetloan: parseInt(result[sheetName][row].BT) || 0,
        ccperformingLoans: parseInt(result[sheetName][row].BU) || 0,
        ccnpl: parseInt(result[sheetName][row].BV) || 0,
        ccgross: parseInt(result[sheetName][row].BW) || 0,
        ccallowance: parseInt(result[sheetName][row].BX) || 0,
        ccnetloan: parseInt(result[sheetName][row].BY) || 0,
        consumerperformingloan: parseInt(result[sheetName][row].BZ) || 0,
        consumernpl: parseInt(result[sheetName][row].CA) || 0,
        consumergross: parseInt(result[sheetName][row].CB) || 0,
        consumerallowance: parseInt(result[sheetName][row].CC) || 0,
        consumernetloan: parseInt(result[sheetName][row].CD) || 0,
        totalperformingLoans: parseInt(result[sheetName][row].CE) || 0,
        totalnpl: parseInt(result[sheetName][row].CF) || 0,
        totalgross: parseInt(result[sheetName][row].CG) || 0,
        totalallowance: parseInt(result[sheetName][row].CH) || 0,
        totalnetloan: parseInt(result[sheetName][row].CI) || 0,
        demandDeposits: parseInt(result[sheetName][row].CJ) || 0,
        customerTimeInvestment: parseInt(result[sheetName][row].CK) || 0,
        customerSavings: parseInt(result[sheetName][row].CL) || 0,
        otherDeposits: parseInt(result[sheetName][row].CM) || 0,
        totalDeposits: parseInt(result[sheetName][row].CN) || 0,
        totalNonCommissionDeposits: parseInt(result[sheetName][row].CO) || 0,
        timeSavingsDeposits: parseInt(result[sheetName][row].CP) || 0,
        shortTermPortion: parseInt(result[sheetName][row].CQ) || 0,
        longTermPortion: parseInt(result[sheetName][row].CR) || 0,
        LCs: parseInt(result[sheetName][row].CS) || 0,
        LGs: parseInt(result[sheetName][row].CT) || 0,
        totalTradeFinance: parseInt(result[sheetName][row].CU) || 0,
        nonTradingGains: parseInt(result[sheetName][row].CV) || 0,
        otherGains: parseInt(result[sheetName][row].CW) || 0,
        adjustedIncome: parseInt(result[sheetName][row].CX) || 0,
        retail: {
          assets: parseInt(result[sheetName][row].CY) || 0,
          liabilities: parseInt(result[sheetName][row].CZ) || 0,
          revenues: parseInt(result[sheetName][row].DA) || 0,
          costs: parseInt(result[sheetName][row].DB) || 0,
          financialImpairments: parseInt(result[sheetName][row].DC) || 0,
          investmentImpairments: parseInt(result[sheetName][row].DD) || 0,
          totalProvisions: parseInt(result[sheetName][row].DE) || 0,
          totalExpenses: parseInt(result[sheetName][row].DF) || 0,
          ppi: parseInt(result[sheetName][row].DG) || 0,
          preZakat: parseInt(result[sheetName][row].DH) || 0,
        },
        corporate: {
          assets: parseInt(result[sheetName][row].DI) || 0,
          liabilities: parseInt(result[sheetName][row].DJ) || 0,
          revenues: parseInt(result[sheetName][row].DK) || 0,
          costs: parseInt(result[sheetName][row].DL) || 0,
          financialImpairments: parseInt(result[sheetName][row].DM) || 0,
          investmentImpairments: parseInt(result[sheetName][row].DN) || 0,
          totalProvisions: parseInt(result[sheetName][row].DO) || 0,
          totalExpenses: parseInt(result[sheetName][row].DP) || 0,
          ppi: parseInt(result[sheetName][row].DQ) || 0,
          preZakat: parseInt(result[sheetName][row].DR) || 0,
        },
        treasury: {
          assets: parseInt(result[sheetName][row].DS) || 0,
          liabilities: parseInt(result[sheetName][row].DT) || 0,
          revenues: parseInt(result[sheetName][row].DU) || 0,
          costs: parseInt(result[sheetName][row].DV) || 0,
          financialImpairments: parseInt(result[sheetName][row].DW) || 0,
          investmentImpairments: parseInt(result[sheetName][row].DX) || 0,
          totalProvisions: parseInt(result[sheetName][row].DY) || 0,
          totalExpenses: parseInt(result[sheetName][row].DZ) || 0,
          ppi: parseInt(result[sheetName][row].EA) || 0,
          preZakat: parseInt(result[sheetName][row].EB) || 0,
        },
        rwa: parseInt(result[sheetName][row].EC) || 0,
        tier1: parseInt(result[sheetName][row].ED) || 0,
        tier2: parseInt(result[sheetName][row].EE) || 0,
        sumOfTier: parseInt(result[sheetName][row].EF) || 0,
        tier1CAR: parseInt(result[sheetName][row].EG) || 0,
        sumOfTierCAR: parseInt(result[sheetName][row].EH) || 0,
        branches: parseInt(result[sheetName][row].EI) || 0,
        atms: parseInt(result[sheetName][row].EJ) || 0,
        pos: parseInt(result[sheetName][row].EK) || 0,
        remittance: parseInt(result[sheetName][row].EL) || 0,
        brokrage: parseInt(result[sheetName][row].EM) || 0,
      };
      if(!json.year || isNaN(parseInt(json.year)) || parseInt(json.year) < 1974){
        continue;
      }

      let previousYear = parseInt(json.year) - 1 || 0;
      const date = new Date();
      date.setFullYear(json.year);
      date.setMonth(0);
      date.setDate(1);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      if (quarter) {
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
              otherExpenses:json.otherExpenses,
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
            otherExpenses:json.otherExpenses,
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
      let executiveSummary = await ExecutiveSummaryService.findOne({
        bankId,
        "meta.interval": interval,
        "meta.label": json.year,
      });
      if (executiveSummary) {
        await ExecutiveSummaryService.findByIdAndUpdate(executiveSummary._id, {
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
          operatingExpenses: ((parseInt(json.salaries)||0)+
            (parseInt(json.otherExpenses)||0)+
            (parseInt(json.amortisationExpenses)||0)+(parseInt(json.rentExpenses)||0)+(parseInt(json.otherGeneralExpenses)||0)+(parseInt(json.depreciationExpenses)||0)) / 1000000 || 0,
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
          zakat_and_taxes: json.zakat ? parseInt(json.zakat) / 1000000 || 0 : 0,
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
      } else {
        await ExecutiveSummaryService.create({
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
          zakat_and_taxes: json.zakat ? parseInt(json.zakat) / 1000000 || 0 : 0,
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

      await this.syncKeyRatios(
        bankId,
        interval,
        json.year,
        previousYear,
        date,
        json
      );
      await this.syncCommonSize(bankId, interval, json.year, date, json);
      const ms = await this.syncMarketShares(bankId, interval, json.year, date);
      await this.syncItemAnalysis(bankId, interval, json.year, date, json,ms);
      await this.syncRanking(interval,json.year);
    }

    Response(res).body().send();
  };
  syncItemAnalysis = async (bankId, interval, year, date,json,ms) => {
    const {MS_retailPerformingLoans=0,MS_corporate_and_other_Performing_loans=0,MS_totalNetIncome=0} = ms
    let marketShare = await AllMarketShare.findOne({
      bankId,
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    let output = {};
    output.balanceSheet = {
      demandDeposits: {
        value: json.demandDeposits / 1000000  || 0,
        share: marketShare?.marketShare?.demandDeposits,
        rank: 1,
      },
      t_and_s_deposits: {
        value: json.timeSavingsDeposits / 1000000  || 0,
        share: marketShare?.marketShare?.time_and_saving_deposits,
        rank: 2,
      },
      total_deposits: {
        value: json.totalDeposits / 1000000  || 0,
        share: marketShare?.marketShare?.totalDeposits,
        rank: 3,
      },
      investments: {
        value: json.investments / 1000000  || 0,
        share: marketShare?.marketShare?.investments_net,
        rank: 4,
      },
      assets: {
        value: json.totalAssets / 1000000  || 0,
        share: marketShare?.marketShare?.assets,
        rank: 5,
      },
      lc: {
        value: json.LCs / 1000000  || 0,
        share: marketShare?.marketShare?.lcs,
        rank: 6,
      },
      lg: {
        value: json.LGs / 1000000  || 0,
        share: marketShare?.marketShare?.lgs,
        rank: 7,
      },
      trade_finance: {
        value: json.totalTradeFinance / 1000000  || 0,
        share: marketShare?.marketShare?.totalTradeFinance,
        rank: 8,
      },
      retail_performing_loans: {
        value: json.retailPerformingLoans / 1000000  || 0,
        share: json.retailPerformingLoans / MS_retailPerformingLoans,
        rank: 9,
      },
      corporate_and_others_performing_loans: {
        value: json.corporateperformingLoans / 1000000  || 0,

        share: json.corporateperformingLoans/MS_corporate_and_other_Performing_loans,
        rank: 3,
      },
      total_loans_net: {
        value: json.totalnetloan / 1000000  || 0,
        share: marketShare?.marketShare?.totalLoansNet,
        rank: 2,
      },
    };
    output.incomeStatement = {
      grossYield: {
        value: json.gross / 1000000  || 0,
        share: marketShare?.marketShare?.grossYield,
        rank: 4,
      },
      coF: {
        value: json.cof / 1000000  || 0,
        share: marketShare?.marketShare?.coF,
        rank: 2,
      },
      nyi: {
        value: json.nyi / 1000000  || 0,
        share: marketShare?.marketShare?.nyi,
        rank: 6,
      },
      fees: {
        value: json.fees / 1000000  || 0,
        share: marketShare?.marketShare?.fees,
        rank: 9,
      },
      fx: {
        value: json.fx / 1000000  || 0,
        share: marketShare?.marketShare?.fx,
        rank: 8,
      },
      otherIncome: {
        value: json.otherIncomeNet / 1000000  || 0,
        share: marketShare?.marketShare?.otherIncome,
        rank: 3,
      },
      operatingIncome: {
        value: json.totalOperatingEquity / 1000000  || 0,
        share: marketShare?.marketShare?.operatingIncome,
        rank: 5,
      },
      salaries_and_employees_related_expenses: {
        value: json.salaries / 1000000  || 0,
        share: marketShare?.marketShare?.salaries_and_employeesrelatedExpenses,
        rank: 8,
      },
      depreciation_and_amortization_expenses: {
        value: (json.depreciationExpenses + json.amortisationExpenses) / 1000000  || 0,
        share: marketShare?.marketShare?.depreciation_and_amortisation,
        rank: 7,
      },
      other_general_and_admin_expenses: {
        value: json.otherGeneralExpenses / 1000000  || 0,
        share: marketShare?.marketShare?.other_general_and_admin_expenses,
        rank: 5,
      },
      operatingExpenses: {
        value: json.totalOperatingExpenses / 1000000  || 0,
        share: marketShare?.marketShare?.operatingExpenses_totalAssets,
        rank: 4,
      },
      provisions_loans_and_investments: {
        value: (json.financialImpairment + json.investmentImpairment) / 1000000  || 0,

        share: marketShare?.marketShare?.provision,
        rank: 8,
      },
      income_before_provisions: {
        value: (json.netIncomeBeforeZakat + json.financialImpairment + json.investmentImpairment) / 1000000  || 0,
        share: marketShare?.marketShare?.incomeBeforeZakat + marketShare?.marketShare?.provision ,
        rank: 9,
      },
      income_before_zakat_and_tax: {
        value: json.netIncomeBeforeZakat / 1000000  || 0,
        share: marketShare?.marketShare?.incomeBeforeZakat,
        rank: 8,
      },
      netIncome: {
        value: json.totalNetIncome / 1000000  || 0,
        share: MS_totalNetIncome,
        rank: 3,
      },
    };

    const obj = {
      bankId:bankId,
      meta: {
        interval,
        label:year,
        date,
      },
      ...output,
    };
    let itemAnalysis = await ItemAnalysis.findOne({
      bankId,
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    if (itemAnalysis) {
      await ItemAnalysis.findByIdAndUpdate(itemAnalysis._id, { ...obj });
    } else {
      await ItemAnalysis.create(obj);
    }


  }
  syncMarketShares = async (bankId, interval, year, date) => {
    const banks = await Bank.find();
    //balance sheet
    let balanceSheets = await BalanceSheet.find({
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    let financingSheets = await Financing.find({
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    let customerDepositSheets = await CustomerDeposit.find({
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    let tradeFinanceSheets = await TradeFinance.find({
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    //income sheet
    let incomeStatementSheets = await IncomeStatement.find({
      "meta.interval": interval,
      "meta.label": year,
    }).lean();

    let brokerageSheets = await Brokerage.find({
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    let channelSheets = await Channel.find({
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    let oneOffIncomeSheets = await OneOffIncome.find({
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    let MS_totalLoansNet = financingSheets.reduce(
      (acc, obj) => acc + obj?.retail?.netLoan + obj?.corporate?.netLoan,
      0
    );
    let MS_retailLoansGross = financingSheets.reduce(
      (acc, obj) => acc + obj?.retail?.gross,
      0
    );
    let MS_corporate_and_other_loans_gross = financingSheets.reduce(
      (acc, obj) => acc + obj?.corporate?.gross,
      0
    );
    let MS_retailPerformingLoans = financingSheets.reduce(
      (acc, obj) => acc + obj?.retail?.performingLoans,
      0
    );
    let MS_corporate_and_other_Performing_loans = financingSheets.reduce(
      (acc, obj) => acc + obj?.corporate?.performingLoans,
      0
    );
    let MS_investments_net = balanceSheets.reduce(
      (acc, obj) => acc + obj?.assets?.investments,
      0
    );
    let MS_assets = balanceSheets.reduce(
      (acc, obj) => acc + obj?.assets?.totalAssets,
      0
    );
    let MS_totalDeposits = customerDepositSheets.reduce(
      (acc, obj) => acc + obj?.customerDeposit?.totalDeposits,
      0
    );
    let MS_demandDeposits = customerDepositSheets.reduce(
      (acc, obj) => acc + obj?.customerDeposit?.demandDeposits,
      0
    );
    let MS_time_and_saving_deposits = customerDepositSheets.reduce(
      (acc, obj) => acc + obj?.customerDeposit?.timeSavingsDeposits,
      0
    );
    let MS_lcs = tradeFinanceSheets.reduce(
      (acc, obj) => acc + obj?.tradeFinance?.LCs,
      0
    );
    let MS_lgs = tradeFinanceSheets.reduce(
      (acc, obj) => acc + obj?.tradeFinance?.LGs,
      0
    );
    let MS_totalTradeFinance = tradeFinanceSheets.reduce(
      (acc, obj) => acc + obj?.tradeFinance?.totalTradeFinance,
      0
    );
    let MS_nyi = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.nyi?.nyi,
      0
    );
    let MS_fees = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingEquity?.fees,
      0
    );
    let MS_fx = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingEquity?.fx,
      0
    );
    let MS_brokerageFirms = brokerageSheets.reduce(
      (acc, obj) => acc + obj?.brokerage?.brokerageFirms,
      0
    );
    let MS_branches = channelSheets.reduce(
      (acc, obj) => acc + obj?.channel?.branches,
      0
    );
    let MS_atms = channelSheets.reduce(
      (acc, obj) => acc + obj?.channel?.atms,
      0
    );
    let MS_pos = channelSheets.reduce((acc, obj) => acc + obj?.channel?.pos, 0);
    let MS_remittance = channelSheets.reduce(
      (acc, obj) => acc + obj?.channel?.remittance,
      0
    );
    let MS_residentialMortgages = 1;
    let MS_aum = 1;
    let MS_grossYield = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.nyi?.gross,
      0
    );
    let MS_coF = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.nyi?.cof,
      0
    );
    const MS_fvis = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingEquity?.fvisInvestments,
      0
    );
    const MS_tradingIncome = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingEquity?.fvisInvestments,
      0
    );
    const MS_dividentIncome = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingEquity?.fvisInvestments,
      0
    );
    const MS_nonTradingIncome = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingEquity?.fvisInvestments,
      0
    );
    const MS_otherIncomeExp = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingEquity?.fvisInvestments,
      0
    );
    let MS_otherIncome =
      MS_fvis +
      MS_tradingIncome +
      MS_dividentIncome +
      MS_nonTradingIncome +
      MS_otherIncomeExp;
    let MS_operatingIncome = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingEquity?.totalOperatingEquity,
      0
    );
    let MS_operatingIncomeAdjusted = oneOffIncomeSheets.reduce(
      (acc, obj) => acc + obj?.oneOffIncome?.adjustedIncome,
      0
    );
    //MS_COSTS
    let MS_salaries = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingExpenses?.salaries,
      0
    );
    let MS_rentExpenses = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingExpenses?.rentExpenses,
      0
    );
    let MS_depreciationExpenses = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingExpenses?.depreciationExpenses,
      0
    );
    let MS_amortisationExpenses = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingExpenses?.amortisationExpenses,
      0
    );
    let MS_otherGeneralExpenses = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingExpenses?.otherGeneralExpenses,
      0
    );
    let MS_costs =
      MS_salaries +
      MS_rentExpenses +
      MS_depreciationExpenses +
      MS_amortisationExpenses +
      MS_otherGeneralExpenses;
    let MS_financialImpairment = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingExpenses?.financialImpairment,
      0
    );
    let MS_investmentImpairment = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingExpenses?.investmentImpairment,
      0
    );
    let MS_provision = MS_financialImpairment + MS_investmentImpairment;
    let MS_incomeBeforeZakat = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.netIncomeBeforeZakat?.netIncomeBeforeZakat,
      0
    );
    let MS_ppi = MS_provision + MS_incomeBeforeZakat;
    let MS_zakat = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.netIncomeAfterZakat?.zakat,
      0
    );
    let MS_operating_exp = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalOperatingExpenses?.totalOperatingExpenses,
      0
    );
    let MS_totalNetIncome = incomeStatementSheets.reduce(
      (acc, obj) => acc + obj?.totalNetIncome?.totalNetIncome,
      0
    );
    const result = [];
    for await (let bank of banks) {
      console.log("MARKETSHARE BANK:- ",bank,MS_assets);
      const selectedBalanceSheet = balanceSheets.find(
        (ele) => ele.bankId.toString() == bank._id.toString()
      );
      const selectedFinancingSheet = financingSheets.find(
        (ele) => ele.bankId.toString() == bank._id.toString()
      );
      const selectedcustomerDepositSheet = customerDepositSheets.find(
        (ele) => ele.bankId.toString() == bank._id.toString()
      );
      const selectedtradeFinanceSheet = tradeFinanceSheets.find(
        (ele) => ele.bankId.toString() == bank._id.toString()
      );
      const selectedincomeStatementSheet = incomeStatementSheets.find(
        (ele) => ele.bankId.toString() == bank._id.toString()
      );
      const selectedbrokerageSheet = brokerageSheets.find(
        (ele) => ele.bankId.toString() == bank._id.toString()
      );
      const selectedchannelSheet = channelSheets.find(
        (ele) => ele.bankId.toString() == bank._id.toString()
      );
      const selectedoneOffIncomeSheet = oneOffIncomeSheets.find(
        (ele) => ele.bankId.toString() == bank._id.toString()
      );

      const fvis =
        selectedincomeStatementSheet?.totalOperatingEquity?.fvisInvestments /
          MS_fvis || 0;
      const tradingIncome =
        selectedincomeStatementSheet?.totalOperatingEquity?.fvisInvestments /
          MS_tradingIncome || 0;
      const dividentIncome =
        selectedincomeStatementSheet?.totalOperatingEquity?.fvisInvestments /
          MS_dividentIncome || 0;
      const nonTradingIncome =
        selectedincomeStatementSheet?.totalOperatingEquity?.fvisInvestments /
          MS_nonTradingIncome || 0;
      const otherIncomeExp =
        selectedincomeStatementSheet?.totalOperatingEquity?.fvisInvestments /
          MS_otherIncomeExp || 0;
      const salaries =
        selectedincomeStatementSheet?.totalOperatingExpenses?.salaries /
          MS_salaries || 0;
      const rentExpenses =
        selectedincomeStatementSheet?.totalOperatingExpenses?.rentExpenses /
          MS_rentExpenses || 0;
      const depreciationExpenses =
        selectedincomeStatementSheet?.totalOperatingExpenses
          ?.depreciationExpenses / MS_depreciationExpenses || 0;
      const amortisationExpenses =
        selectedincomeStatementSheet?.totalOperatingExpenses
          ?.amortisationExpenses / MS_amortisationExpenses || 0;
      const otherGeneralExpenses =
        selectedincomeStatementSheet?.totalOperatingExpenses
          ?.otherGeneralExpenses / MS_otherGeneralExpenses || 0;
      const financialImpairment =
        selectedincomeStatementSheet?.totalOperatingExpenses
          ?.financialImpairment / MS_financialImpairment || 0;
      const investmentImpairment =
        selectedincomeStatementSheet?.totalOperatingExpenses
          ?.investmentImpairment / MS_investmentImpairment || 0;
      const incomeBeforeZakat =
        selectedincomeStatementSheet?.netIncomeBeforeZakat
          ?.netIncomeBeforeZakat / MS_incomeBeforeZakat || 0;
      const feesValue =
        selectedincomeStatementSheet?.totalOperatingEquity?.fees || 0;
      const fxValue =
        selectedincomeStatementSheet?.totalOperatingEquity?.fx || 0;
      const fvisInvestmentsValue =
        selectedincomeStatementSheet?.totalOperatingEquity?.fvisInvestments ||
        0;
      const dividentIncomeValue =
        selectedincomeStatementSheet?.totalOperatingEquity?.dividentIncome || 0;
      const tradingIncomeValue =
        selectedincomeStatementSheet?.totalOperatingEquity?.tradingIncome || 0;
      const nonTradingIncomeValue =
        selectedincomeStatementSheet?.totalOperatingEquity?.nonTradingIncome ||
        0;
      const otherIncomeValue =
        selectedincomeStatementSheet?.totalOperatingEquity?.otherIncome || 0;
      const nonYeildValue =
        feesValue +
          fxValue +
          fvisInvestmentsValue +
          dividentIncomeValue +
          tradingIncomeValue +
          nonTradingIncomeValue +
          otherIncomeValue || 0;
      const opexValue =
        selectedincomeStatementSheet?.totalOperatingExpenses?.salaries +
          selectedincomeStatementSheet?.totalOperatingExpenses?.rentExpenses +
          selectedincomeStatementSheet?.totalOperatingExpenses
            ?.depreciationExpenses +
          selectedincomeStatementSheet?.totalOperatingExpenses
            ?.amortisationExpenses +
          selectedincomeStatementSheet?.totalOperatingExpenses
            ?.otherGeneralExpenses || 0;

      const marketShare =  {
        totalLoansNet:
          ((selectedFinancingSheet?.retail?.netLoan +
            selectedFinancingSheet?.corporate?.netLoan) /
            MS_totalLoansNet) * 100 || 0,
        retailLoansGross:
          (selectedFinancingSheet?.retail?.gross / MS_retailLoansGross)*100 || 0,
        corporate_and_other_loans_gross:
          (selectedFinancingSheet?.corporate?.gross /
            MS_corporate_and_other_loans_gross)*100 || 0,
        investments_net:
          (selectedBalanceSheet?.assets?.investments / MS_investments_net)*100 || 0,
        assets: (selectedBalanceSheet?.assets?.totalAssets / MS_assets )*100|| 0,
        totalDeposits:
          (selectedcustomerDepositSheet?.customerDeposit?.totalDeposits /
            MS_totalDeposits)*100 || 0,
        demandDeposits:
          (selectedcustomerDepositSheet?.customerDeposit?.demandDeposits /
            MS_demandDeposits)*100 || 0,
        time_and_saving_deposits:
          (selectedcustomerDepositSheet?.customerDeposit?.timeSavingsDeposits /
            MS_time_and_saving_deposits)*100 || 0,
        lcs: (selectedtradeFinanceSheet?.tradeFinance?.LCs / MS_lcs)*100 || 0,
        lgs: (selectedtradeFinanceSheet?.tradeFinance?.LGs / MS_lgs)*100 || 0,
        totalTradeFinance:
          (selectedtradeFinanceSheet?.tradeFinance?.totalTradeFinance /
            MS_totalTradeFinance)*100 || 0,
        nyi: (selectedincomeStatementSheet?.nyi?.nyi / MS_nyi)*100 || 0,
        fees:
          (selectedincomeStatementSheet?.totalOperatingEquity?.fees /
            MS_fees)*100 || 0,
        fx:
          (selectedincomeStatementSheet?.totalOperatingEquity?.fx / MS_fx) *100 || 0,
        brokerageFirms:
          (selectedbrokerageSheet?.brokerage?.brokerageFirms /
            MS_brokerageFirms)*100 || 0,
        branches: (selectedchannelSheet?.channel?.branches / MS_branches)*100 || 0,
        atms: (selectedchannelSheet?.channel?.atms / MS_atms)*100 || 0,
        pos: (selectedchannelSheet?.channel?.pos / MS_pos)* 100 || 0,
        remittance:
          (selectedchannelSheet?.channel?.remittance / MS_remittance)*100 || 0,
        // residentialMortgages:0 || 0,
        // aum:0  || 0,
        grossYield:
          (selectedincomeStatementSheet?.nyi?.gross / MS_grossYield )* 100 || 0,
        coF: (selectedincomeStatementSheet?.nyi?.cof / MS_coF)*100 || 0,
        otherIncome:
          (fvis +
            tradingIncome +
            dividentIncome +
            nonTradingIncome +
            otherIncomeExp ) *100 || 0,
        operatingIncome:
          (selectedincomeStatementSheet?.totalOperatingEquity
            ?.totalOperatingEquity / MS_operatingIncome)*100 || 0,
        operatingIncomeAdjusted:
          (selectedoneOffIncomeSheet?.oneOffIncome?.adjustedIncome /
            MS_operatingIncomeAdjusted)*100 || 0,
        //MS_COSTS
        costs:
          (salaries +
            rentExpenses +
            depreciationExpenses +
            amortisationExpenses +
            otherGeneralExpenses )* 100 || 0,
        provision: (financialImpairment + investmentImpairment)*100 || 0,
        incomeBeforeZakat:incomeBeforeZakat*100 ||0,
        ppi:
         ( financialImpairment + investmentImpairment + incomeBeforeZakat )*100 || 0,
        zakat:
          (selectedincomeStatementSheet?.netIncomeAfterZakat?.zakat /
            MS_zakat)*100 || 0,
        // periodDays:0 || 0,
        // periodYearDays:0 || 0,
        salaries_and_employeesrelatedExpenses: (salaries *100) || 0,
        depreciation_and_amortisation:
          (depreciationExpenses + amortisationExpenses)*100 || 0,
        other_general_and_admin_expenses: (otherGeneralExpenses*100) || 0,
        operating_exp:
          (selectedincomeStatementSheet?.totalOperatingExpenses
            ?.totalOperatingExpenses / MS_operating_exp)*100 || 0,
        nonyield_operatingIncome:
          nonYeildValue /
            selectedincomeStatementSheet?.totalOperatingEquity
              ?.totalOperatingEquity || 0,
        nonyield_operatingExpenses:
          nonYeildValue /
            selectedincomeStatementSheet?.totalOperatingExpenses
              ?.totalOperatingExpenses || 0,
        nonyield_totalAssets:
          nonYeildValue / selectedBalanceSheet?.assets?.totalAssets || 0,
        operatingExpenses_totalAssets:
          opexValue / selectedBalanceSheet?.assets?.totalAssets || 0,
      }
      const allMarketSharePayload = {
        bankId: bank._id,
        meta: {
          interval,
          label: year,
          date,
        },
        marketShare
      };
      const marketSharePayload = {
        bankId: bank._id,
        meta: {
          interval,
          label: year,
          date,
        },
        ...marketShare
      };
      result.push(allMarketSharePayload);
      //creating All marketShare

      if(bankId.toString() == bank._id.toString()){
        let allMarketShareData = await AllMarketShare.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": year,
        }).lean();
        if (allMarketShareData) {
          await AllMarketShare.findByIdAndUpdate(allMarketShareData._id, { ...allMarketSharePayload });
        } else {
          await AllMarketShare.create(allMarketSharePayload);
        }

        //normal market share
        let marketShareData = await MarketShare.findOne({
          bankId,
          "meta.interval": interval,
          "meta.label": year,
        }).lean();
        if (marketShareData) {
          await MarketShare.findByIdAndUpdate(marketShareData._id, { ...marketSharePayload });
        } else {
          await MarketShare.create(marketSharePayload);
        }

      }else{
        let allMarketShareData = await AllMarketShare.findOne({
          bankId:bank._id,
          "meta.interval": interval,
          "meta.label": year,
        }).lean();
        if (allMarketShareData) {
          await AllMarketShare.findByIdAndUpdate(allMarketShareData._id, { ...allMarketSharePayload });
        }
          //normal market share
          let marketShareData = await MarketShare.findOne({
            bankId:bank._id,
            "meta.interval": interval,
            "meta.label": year,
          }).lean();
          if (marketShareData) {
            await MarketShare.findByIdAndUpdate(marketShareData._id, { ...marketSharePayload });
          }
      }

    }
    return {MS_retailPerformingLoans,MS_corporate_and_other_Performing_loans,MS_totalNetIncome};
  };
  syncKeyRatios = async (bankId, interval, year, previousYear, date,json) => {
    //logic

    
    let output = {};
    const totalOpex =
      json.salaries +
      json.rentExpenses +
      json.amortisationExpenses +
      json.depreciationExpenses +
      json.otherGeneralExpenses +
      json.otherIncome;
    const totalLoan =
      json.retailPerformingLoans +
      json.retailNpl +
      json.corporateperformingLoans +
      json.corportatenpl;
    const loan = json.retailnetLoan + json.corporatenetloan;
    //1st Cost/Income %
    output.year = year;
    output.cost = (totalOpex / json.totalOperatingEquity) * 100 || 0;
    output.adjustedCost =
      (totalOpex / (json.totalOperatingEquity - json.nonTradingIncome)) * 100 ||
      0;
    output.profitMargin =
      (json.equityHoldersOfTheBank / json.totalOperatingEquity) * 100 || 0;
    output.costRevenue = (totalOpex / json.totalOperatingEquity) * 100 || 0;
    output.provisions =
      ((json.financialImpairment + json.investmentImpairment) /
        json.totalOperatingEquity) *
        100 || 0;
    output.totalExpenses =
      (json.totalOperatingExpenses / json.totalOperatingEquity) * 100 || 0;
    output.nplCoverage =
      ((json.retailallowance + json.corporateallowance) /
        (json.retailNpl + json.corportatenpl)) *
        100 || 0;
    output.nplbasedOnGrossLoan =
      ((json.retailNpl + json.corportatenpl) / totalLoan) * 100 || 0;
    output.AllowancebasedOnGrossLoan =
      ((json.retailallowance + json.corporateallowance) / totalLoan) * 100 || 0;
      output.ld =
      (loan / (json.customerDeposit)) * 100 || 0;
    output.ldSama =
      (loan / (json.customerDeposit +json.longTermPortion+ json.tier1skuku)) * 100 || 0;
    output.currentAccountAndTotalDeposit = (json.demandDeposits / json.totalDeposits) * 100 || 0;
    output.nonCommisionBearingDeposit = (json.totalNonCommissionDeposits / json.totalDeposits)*100 || 0;
    output.timeAndSaving = (json.timeSavingsDeposits / json.totalDeposits)*100 || 0;
    output.nyi = (json.nyi / json.totalOperatingEquity) * 100 || 0;
    output.fee = (json.fees / json.totalOperatingEquity) * 100 || 0;
    output.fx = (json.fx / json.totalOperatingEquity) * 100 || 0;
    output.otherIncome =
      ((json.otherIncomeNet + json.fvisInvestments + json.tradingIncome + json.dividentIncome + json.nonTradingIncome )/ json.totalOperatingEquity) * 100 || 0;
    output.staffExpenses =
      (json.salaries / json.totalOperatingExpenses) * 100 || 0;
    //missing
    output.nonStaffExpenses =
      (((json?.rentExpenses || 0) +
        (json.depreciationExpenses || 0) +
        (json.amortisationExpenses || 0) +
        json.otherGeneralExpenses +
        json.otherIncomeNet) /
        json.totalOperatingExpenses) *
        100 || 0;
    output.provisionsExpenses =
      ((json.financialImpairment + json.investmentImpairment) /
        json.totalOperatingExpenses) *
        100 || 0;
    output.retailNpl = (json.retailallowance / json.retailNpl) * 100 || 0;
    output.corporateNpl =
      (json.corporateallowance / json.corportatenpl) * 100 || 0;
    output.grossRetailLoan =
      (json.retailNpl / (json.retailNpl + json.retailPerformingLoans)) * 100 ||
      0;
    output.grossCorporateLoan =
      (json.corportatenpl /
        (json.corportatenpl + json.corporateperformingLoans)) *
        100 || 0;
    output.nonYeildAndOperatingIncome =
      (json.nyi / json.totalOperatingEquity) * 100 || 0;
    output.nonYeildAndOperatingExpenses = (json.nyi / totalOpex) * 100 || 0;
    output.nonYeildAndAssets = (json.nyi / json.totalAssets) * 100 || 0;
    output.operatingExpensesAndAssets =
      (totalOpex / json.totalAssets) * 100 || 0;

    //all previous year related parameters
    if (previousYear) {
      let previous_balanceSheet = await BalanceSheet.findOne({
        bankId,
        "meta.interval": interval,
        "meta.label": previousYear,
      }).lean();
      let previous_financing = await Financing.findOne({
        bankId,
        "meta.interval": interval,
        "meta.label": previousYear,
      }).lean();
      let previous_capitalAdequacy = await CapitalAdequacy.findOne({
        bankId,
        "meta.interval": interval,
        "meta.label": previousYear,
      });

      let previous_year_dueFromBanksAndOtherFinancial =
        json.dueFromBanksAndOtherFinancial;
      let previous_year_investments = json.investments;
      let previous_year_totalAssets = json.totalAssets;
      let previous_year_customerDeposit = json.customerDeposit;
      let previous_year_debetSecurityIssued = json.debetSecurityIssued;
      let previous_year_totalShareHolderEquity = json.totalShareHolderEquity;
      let previous_year_retailLoan = json.retailPerformingLoans;
      let previous_year_retailNPL = json.retailNpl;
      let previous_year_corporateLoan = json.corporateperformingLoans;
      let previous_year_corporateNPL = json.corportatenpl;
      let previous_year_rwa = json.rwa;

      if (previous_balanceSheet) {
        previous_year_dueFromBanksAndOtherFinancial =
          previous_balanceSheet?.assets?.dueFromBanksAndOtherFinancial || 0;
        previous_year_investments =
          previous_balanceSheet?.assets?.investments || 0;
        previous_year_totalAssets =
          previous_balanceSheet?.assets?.totalAssets || 0;
        previous_year_customerDeposit =
          previous_balanceSheet?.liabilities?.customerDeposit || 0;
        previous_year_debetSecurityIssued =
          previous_balanceSheet?.liabilities?.debetSecurityIssued || 0;
        previous_year_totalShareHolderEquity =
          previous_balanceSheet?.shareEquityHolder?.totalShareHolderEquity || 0;
        
      }
      if(previous_financing){
        previous_year_retailLoan =
          previous_financing?.retail?.performingLoans || 0;
        previous_year_retailNPL = previous_financing?.retail?.npl || 0;
        previous_year_corporateLoan =
          previous_financing?.corporate?.performingLoans || 0;
        previous_year_corporateNPL = previous_financing?.corporate?.npl || 0;
      }
      if(previous_capitalAdequacy){
        previous_year_rwa = previous_capitalAdequacy?.capitalAdequacy?.rwa
      }

      const previous_year_totalLoan =
        previous_year_retailLoan +
        previous_year_retailNPL +
        previous_year_corporateLoan +
        previous_year_corporateNPL;

      output.ROA =
        (json.equityHoldersOfTheBank /
          ((previous_year_totalAssets + json.totalAssets) / 2)) *
          100 || 0;
      output.ROE =
        (json.equityHoldersOfTheBank /
          ((previous_year_totalShareHolderEquity +
            json.totalShareHolderEquity) /
            2)) *
          100 || 0;
          output.RoRwa =
          (json.equityHoldersOfTheBank /
            ((previous_year_rwa +
              json.rwa) /
              2)) *
            100 || 0;
      output.NIM =
        (json.nyi /
          ((totalLoan +
            previous_year_totalLoan +
            json.dueFromBanksAndOtherFinancial +
            previous_year_dueFromBanksAndOtherFinancial +
            json.investments +
            previous_year_investments) /
            2)) *
          100 || 0;
      output.COF =
        (json.cof /
          ((json.dueFromBanksAndOtherFinancial +
            previous_year_dueFromBanksAndOtherFinancial +
            json.customerDeposit +
            previous_year_customerDeposit +
            json.debetSecurityIssued +
            previous_year_debetSecurityIssued) /
            2)) *
          100 || 0;
      output.costRisk =
        (json.financialImpairment /
          ((totalLoan + previous_year_totalLoan) / 2)) *
          100 || 0;
    } else {
      output.ROA = (json.equityHoldersOfTheBank / json.totalAssets) * 100 || 0;
      output.ROE =
        (json.equityHoldersOfTheBank / json.totalShareHolderEquity) * 100 || 0;
        output.RoRwa =
        (json.equityHoldersOfTheBank / json.rwa) * 100 || 0;
      output.NIM =
        (json.nyi /
          (totalLoan + json.dueFromBanksAndOtherFinancial + json.investments)) *
          100 || 0;
      output.COF =
        (json.cof /
          (json.dueFromBanksAndOtherFinancial +
            json.customerDeposit +
            json.debetSecurityIssued)) *
          100 || 0;
      output.costRisk = (json.financialImpairment / totalLoan) * 100 || 0;
    }

    const costIncomePayload = {
      bankId,
      meta: {
        interval,
        label: year,
        date,
      },
      costIncome:{
        income: output.cost || 0,
        incomeAdjusted: output.adjustedCost || 0,
        roa: output.ROA || 0,
        roe: output.ROE || 0,
        roRwa:output.RoRwa || 0,
        nim: output.NIM || 0,
        cofDeposits: output.COF || 0,
        profitMarginRevenues: output.profitMargin || 0,
        costsRevenues: output.costRevenue || 0,
        provisionsRevenues: output.provisions || 0,
        totalExpensesRevenues: output.totalExpenses || 0  
      }
    };
    const costRiskPayload = {
      bankId,
      meta: {
        interval,
        label: year,
        date,
      },
      timeSaving:{
        nplCoverage: output.nplCoverage || 0,
        npl: output.nplbasedOnGrossLoan || 0,
        allowance: output.AllowancebasedOnGrossLoan || 0,
        ld:output.ld || 0,
        lSama: output.ldSama || 0,
        currentAccounts: output.currentAccountAndTotalDeposit || 0,
        nonCommissionBearingDeposits: output.nonCommisionBearingDeposit || 0,
        time_and_savings: output.timeAndSaving || 0  
      },
      otherIncomeRevenues:{
        nyiRevenues: output.nyi || 0,
        fees_of_revenues: output.fee || 0,
        fxRevenues: output.fx || 0,
        otherIncomeRevenues: output.otherIncome || 0,  
      },
      provisions:{
        staffExpenses_of_TotalExpenses: output.staffExpenses || 0,
        nonStaffExpenses: output.nonStaffExpenses || 0,
        provisions_of_totalExpenses: output.provisionsExpenses || 0  
      },
      loan:{
        retailNplCoverage: output.retailNpl || 0,
        coroprate_and_others_nplCoverage: output.corporateNpl || 0,
        retailNpl: output.grossRetailLoan || 0,
        coroprateNpl: output.grossCorporateLoan || 0  
      },
      nyiIncome_operatingIncome: output.nonYeildAndOperatingIncome || 0,
      nyiIncome_operatingExpenses: output.nonYeildAndOperatingExpenses || 0,
      nyiIncome_totalAssets: output.nonYeildAndAssets || 0,
      operatingExpenses_totalAssets: output.operatingExpensesAndAssets || 0,
    };
    const obj = {
      bankId,
      meta: {
        interval,
        label: year,
        date,
      },
      income: output.cost || 0,
      incomeAdjusted: output.adjustedCost || 0,
      roa: output.ROA || 0,
      roe: output.ROE || 0,
      nim: output.NIM || 0,
      cofDeposits: output.COF || 0,
      profitMarginRevenues: output.profitMargin || 0,
      costsRevenues: output.costRevenue || 0,
      provisionsRevenues: output.provisions || 0,
      totalExpensesRevenues: output.totalExpenses || 0,
      cor: output.costRisk || 0,
      nplCoverage: output.nplCoverage || 0,
      npl: output.nplbasedOnGrossLoan || 0,
      allowance: output.AllowancebasedOnGrossLoan || 0,
      lSama: output.ldSama || 0,
      currentAccounts: output.currentAccountAndTotalDeposit || 0,
      nonCommissionBearingDeposits: output.nonCommisionBearingDeposit || 0,
      time_and_savings: output.timeAndSaving || 0,
      nyiRevenues: output.nyi || 0,
      fees_of_revenues: output.fee || 0,
      fxRevenues: output.fx || 0,
      otherIncomeRevenues: output.otherIncome || 0,
      staffExpenses_of_TotalExpenses: output.staffExpenses || 0,
      nonStaffExpenses: output.nonStaffExpenses || 0,
      provisions_of_totalExpenses: output.provisionsExpenses || 0,
      retailNplCoverage: output.retailNpl || 0,
      coroprate_and_others_nplCoverage: output.corporateNpl || 0,
      retailNpl: output.grossRetailLoan || 0,
      coroprateNpl: output.grossCorporateLoan || 0,
      nyiIncome_operatingIncome: output.nonYeildAndOperatingIncome || 0,
      nyiIncome_operatingExpenses: output.nonYeildAndOperatingExpenses || 0,
      nyiIncome_totalAssets: output.nonYeildAndAssets || 0,
      operatingExpenses_totalAssets: output.operatingExpensesAndAssets || 0,
    };
    let keyratios = await KeyRatioService.findOne({
      bankId,
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    if (keyratios) {
      await KeyRatioService.findByIdAndUpdate(keyratios._id, { ...obj });
    } else {
      await KeyRatioService.create(obj);
    }

    //cost income
    let costIncome = await CostIncomeKeyRatio.findOne({
      bankId,
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    if (costIncome) {
      await CostIncomeKeyRatio.findByIdAndUpdate(costIncome._id, { ...costIncomePayload });
    } else {
      await CostIncomeKeyRatio.create(costIncomePayload);
    }

    //cost risk
    let costRisk = await CostRiskKeyRatio.findOne({
      bankId,
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    if (costRisk) {
      await CostRiskKeyRatio.findByIdAndUpdate(costRisk._id, { ...costRiskPayload });
    } else {
      await CostRiskKeyRatio.create(costRiskPayload);
    }
  };
  syncCommonSize = async (bankId, interval, year, date, json) => {
    let output = {};
    const totalOpex =
      json.salaries +
      json.rentExpenses +
      json.depreciationExpenses +
      json.amortisationExpenses +
      json.otherGeneralExpenses +
      json.otherIncome;
    const totalLoan =
      json.retailPerformingLoans +
      json.retailNpl +
      json.corporateperformingLoans +
      json.corportatenpl;
    //1st Cost/Income %
    output.assets = {
      cash: (json.cash / json.totalAssets) * 100 || 0,
      due_from_banks_and_fis:
        (json.dueFromBanksAndOtherFinancial / json.totalAssets) * 100 || 0,
      investments_net: (json.investments / json.totalAssets) * 100 || 0,
      financing_net:
        (((parseInt(json.retailnetLoan) || 0) +
          (parseInt(json.corporatenetloan) || 0)) /
          json.totalAssets) *
        100 || 0,
      pp_and_e: (json.property / json.totalAssets) * 100 || 0,
      invested_properties_net: (json.investedProperty / json.totalAssets) * 100 || 0,
      other_assets: (json.otherAssets / json.totalAssets) * 100 || 0,
      other_real_estate: (json.otherRealEstate / json.totalAssets) * 100 || 0,
      derivatives: (json.derivatives / json.totalAssets) * 100 || 0,
      investments_in_association:
        (json.investmentInAssociation / json.totalAssets) * 100 || 0,
      goodwill: (json.goodWill / json.totalAssets) * 100 || 0,
      totalAssets: (json.totalAssets / json.totalAssets) * 100 || 0,
    };
    output.liabilities = {
      due_to_banks_and_other_fis:
        (json.dueToSaudiMonetaryAutority / json.totalLiablities) * 100 || 0,
      customers_deposits: (json.customerDeposit / json.totalLiablities) * 100 || 0,
      borrowings: (json.debetSecurityIssued / json.totalLiablities) * 100 || 0,
      derivatives_net: (json.netDerivatives / json.totalLiablities) * 100 || 0,
      other_liabilities: (json.otherLiablities / json.totalLiablities) * 100 || 0,
      total_liabilities: (json.totalLiablities / json.totalLiablities) * 100 || 0,
    };
    output.shareholders_equity = {
      share_capital: (json.shareCapital / json.totalShareHolderEquity) * 100 || 0,
      statutory_reserve:
        (json.statutoryReserve / json.totalShareHolderEquity) * 100 || 0,
      other_reserve:
        (json.totalOtherReserve / json.totalShareHolderEquity) * 100 || 0,
      retained_earnings:
        (json.retainedEarning / json.totalShareHolderEquity) * 100 || 0,
      proposed_dividends:
        (json.proposedDividends / json.totalShareHolderEquity) * 100 || 0,
      treasury_shares:
        (json.treasuryShares / json.totalShareHolderEquity) * 100 || 0,
      employees_related:
        (json.employeeRelated / json.totalShareHolderEquity) * 100 || 0,
      foreign_currency_translation_reserve:
        (json.foreignCurrenyReserve / json.totalShareHolderEquity) * 100 || 0,
      total_shareholders_equity:
        (json.totalShareHolderEquity / json.totalShareHolderEquity) * 100 || 0,
    };
    output.operating_income = {
      gross_financing_and_investment_income:
        (json.gross / json.totalOperatingEquity) * 100 || 0,
      coF_positive_value: (json.cof / json.totalOperatingEquity) * 100 || 0,
      nyi: (json.nyi / json.totalOperatingEquity) * 100 || 0,
      fees_net: (json.fees / json.totalOperatingEquity) * 100 || 0,
      fx_net: (json.fx / json.totalOperatingEquity) * 100 || 0,
      income_loss_from_fvis_investments_net:
        (json.fvisInvestments / json.totalOperatingEquity) * 100 || 0,
      trading_income_net:
        (json.tradingIncome / json.totalOperatingEquity) * 100 || 0,
      dividend_income: (json.dividentIncome / json.totalOperatingEquity) * 100 || 0,
      gains_on_non_trading_financial_institutions_net:
        (json.nonTradingIncome / json.totalOperatingEquity) * 100 || 0,
      other_income_expenses_net:
        (json.otherIncomeNet / json.totalOperatingEquity) * 100 || 0,
      total_operating_income:
        (json.totalOperatingEquity / json.totalOperatingEquity) * 100 || 0,
    };
    output.operating_expenses = {
      salaries_and_employees_related_expenses:
        (json.salaries / json.totalOperatingExpenses) * 100 || 0,
      depreciation_and_amortisation:
        (json.depreciationExpenses / json.totalOperatingExpenses) * 100 || 0,
      other_general_and_admin_expenses:
        (json.otherGeneralExpenses / json.totalOperatingExpenses) * 100 || 0,
      impairments_financing_net:
        (json.financialImpairment / json.totalOperatingExpenses) * 100 || 0,
      impairments_investments_net:
        (json.investmentImpairment / json.totalOperatingExpenses) * 100 || 0,
      total_operating_expenses:
        (json.totalOperatingExpenses / json.totalOperatingExpenses) * 100 || 0,
      operating_income:
        (json.totalOperatingEquity / json.totalOperatingExpenses) * 100 || 0,
      zakat: (json.zakat / json.totalOperatingExpenses) * 100 || 0,
      net_income_after_zakat:
        (json.netIncomeAfterZakat / json.totalOperatingExpenses) * 100 || 0,
    };

    const obj = {
      bankId,
      meta: {
        interval,
        label: year,
        date,
      },
      ...output,
    };
    let comonsize = await CommonSizeService.findOne({
      bankId,
      "meta.interval": interval,
      "meta.label": year,
    }).lean();
    if (comonsize) {
      await CommonSizeService.findByIdAndUpdate(comonsize._id, { ...obj });
    } else {
      await CommonSizeService.create(obj);
    }
  };
  syncRanking = async (interval,year) => {
    const items = await ItemAnalysis.find({ "meta.interval":interval,"meta.label": year }).lean();
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
        (b,a) =>
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
  }
}

module.exports.BulkControllers = new BulkControllers();
