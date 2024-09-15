const { sendMail } = require("../helpers/mailSender.helper");
const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const Logger = require("../helpers/logger.helpers");
const mongoose = require("mongoose");

const { BankService } = require("../services/bank.service");

class BankController {
  //@desc list a bank
  //@route POST /api/bank/create
  //@access public
  create = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { name, headquarters, code, contact, iconUrl, color, dataUrl } = req.body;
    if (!name || !headquarters || !code || !contact || !iconUrl || !color || !dataUrl) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const bankAvailable = await BankService.findOne({ code });
    if (bankAvailable) {
      throw new HttpError(400, "Bank already exists!");
    }

    const bank = await BankService.create({ ...req.body });
    if (bank) {
      Response(res)
        .status(201)
        .message("Bank created successfully")
        .body(bank)
        .send();
    } else {
      throw new HttpError(400, "Bank data is not valid");
    }
  };

  //@desc get all banks
  //@route GET /api/bank/
  //@access public
  getAllBanks = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
    const bankFound = await BankService.find();

    if (!bankFound || !Array.isArray(bankFound)) {
      Logger.error("Error: Unable to fetch banks from BankService.");
    }

    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear();

    const extractionDates = [
      new Date(Date.UTC(currentYear, 9, 1, 0, 0, 0, 0)),
      new Date(Date.UTC(currentYear, 6, 1, 0, 0, 0, 0)),
      new Date(Date.UTC(currentYear, 3, 1, 0, 0, 0, 0)),
      new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0, 0)),
    ];

    await Promise.all(
      bankFound.map(async (bank) => {
        let extractionDate;
        for (const date of extractionDates) {
          if (currentDate >= date) {
            extractionDate = new Date(date);
            extractionDate.toISOString();
            if (bank.extraction?.date) {
              const utcExtractionDate = new Date(
                bank.extraction.date
              ).toISOString();
              if (extractionDate.toISOString() !== utcExtractionDate) {
                bank.extraction.disabled = false;
                await bank.save();
              }
            }
            break;
          }
        }
      })
    );

    const banks = await BankService.aggregate([
      { $match: {} },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          headquarters: 1,
          iconUrl: 1,
          contact: 1,
          code: 1,
          color: 1,
          extraction: { $ifNull: ["$extraction", null] },
        },
      },
    ]);

    console.log(banks[0]);
    Response(res).status(200).body(banks).send();
  };

  //@desc get bank by bankId
  //@route GET /api/bank/:bankId
  //@access public
  getBank = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const bankId = req.params.bankId;
    const bank = await BankService.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(bankId) } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          headquarters: 1,
          iconUrl: 1,
          contact: 1,
          dataUrl: 1,
          code: 1,
          color: 1,
        },
      },
    ]);

    const bankFound = bank[0];

    if (!bankFound) {
      throw new HttpError(404, "User not found");
    }

    Response(res).status(200).message("User found").body(bankFound).send();
  };

  removeExtraction = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const banks = await BankService.find({});

    await Promise.all(
      banks.map(async (bank) => {
        bank.extraction = undefined;
        await bank.save();
      })
    );

    Response(res).status(200).message("Done").body().send();
  };

  //@desc send mail for bank data extraction
  //@route POST /api/bank/extract
  //@access public
  requestExtraction = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const email = [
      "shivam@brihatinfotech.com",
      "manish@brihatinfotech.com",
      "sayeli@brihatinfotech.com",
    ];

    const { bank, user } = req.body;

    let bankData = await BankService.findOne({ name: bank });

    bankData.extraction.disabled = true;
    bankData.extraction.status = "Extraction requested";

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

    bankData.extraction.date = extractionDate.toISOString();

    await bankData.save();

    await sendMail(
      email[0],
      "Benchmarking : Mail for data Extraction",
      `Extract data for bank ${bank}, requested by user with Name - ${user.name.first} ${user.name.last}, Email - ${user.email} for date ${extractionDate}`
    );
    await sendMail(
      email[1],
      "Benchmarking : Mail for data Extraction",
      `Extract data for bank ${bank}, requested by user with Name - ${user.name.first} ${user.name.last}, Email - ${user.email} for date ${extractionDate}`
    );
    await sendMail(
      email[2],
      "Benchmarking : Mail for data Extraction",
      `Extract data for bank ${bank}, requested by user with Name - ${user.name.first} ${user.name.last}, Email - ${user.email} for date ${extractionDate}`
    );

    Response(res).status(200).message("Mail Sent!").body().send();
  };

  //@desc get all banks
  //@route PUT /api/bank/:bankId
  //@access public
  updateBank = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
    const bankId = req.params.bankId;

    const updates = req.body;

    console.log(updates);

    const updatedBank = await BankService.findByIdAndUpdate(
      bankId,
      { ...updates },
      { new: true }
    );

    if (!updatedBank) {
      throw new HttpError(404, "Bank not found");
    }

    Response(res).body(updatedBank).send();
  };
}

module.exports.BankController = new BankController();
