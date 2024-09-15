const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const HttpError = require("./HttpError.helpers");

async function fetchHtml(url) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching HTML:", error);
    throw error;
  }
}

function extractXlsLinks(html) {
  const $ = cheerio.load(html);
  const links = [];

  $("a").each((index, element) => {
    const href = $(element).attr("href");
    if (href && href.endsWith(".xls")) {
      links.push(href);
    }
  });

  return links;
}

function extractDateFromLink(link) {
  const regex = /(\d{4}-\d{2}-\d{2})/;
  const match = link.match(regex);
  return match ? match[0] : null;
}

function sortLinksByDate(links) {
  return links.sort((a, b) => {
    const dateA = new Date(extractDateFromLink(a));
    const dateB = new Date(extractDateFromLink(b));
    return dateB - dateA;
  });
}

async function downloadAndConvertXlsToJson(baseUrl, xlsLinks) {
  const jsonDataFolder = path.join(__dirname, "../temp");

  if (!fs.existsSync(jsonDataFolder)) {
    fs.mkdirSync(jsonDataFolder);
  }

  for (const xlsLink of xlsLinks) {
    try {
      const xlsUrl = baseUrl + xlsLink;
      const xlsFileName = path.basename(xlsLink);
      console.log(`Downloading ${xlsFileName} from ${xlsUrl}`);
      const response = await axios({
        method: "GET",
        url: xlsUrl,
        responseType: "arraybuffer",
      });

      const xlsFilePath = path.join(__dirname, xlsFileName);
      fs.writeFileSync(xlsFilePath, response.data);

      console.log(`Checking period covered for ${xlsFileName}`);
      const workbook = xlsx.readFile(xlsFilePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const periodCoveredCell = worksheet[`B20`]?.v || "";
      const bankName = worksheet[`B15`]?.v || "";

      console.log(`periodCoveredCell value: ${periodCoveredCell}`);
      console.log(`bankName value: ${bankName}`);

      const date = extractDateFromLink(xlsLink);

      console.log(`Converting ${xlsFilePath} to JSON`);
      const jsonData = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
      const formattedData = {};
      jsonData.forEach((obj) => {
        const key = obj["__EMPTY"];
        const value = obj["__EMPTY_1"];
        if (
          key &&
          key.trim() !== "" &&
          value !== undefined &&
          value.trim() !== ""
        ) {
          formattedData[key.trim()] = value.trim();
        }
      });

      const jsonObject = {
        date,
        interval: periodCoveredCell,
        bank: bankName,
        data: formattedData,
      };

      const jsonFileName = `${date}_${periodCoveredCell}_${bankName}.json`;
      const jsonFilePath = path.join(jsonDataFolder, jsonFileName);
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObject, null, 2));

      console.log(`Converted ${xlsFilePath} to ${jsonFileName}`);

      fs.unlinkSync(xlsFilePath);
    } catch (error) {
      console.error(`Error downloading and converting ${xlsLink}:`, error);
    }
  }
}

async function fetchBankMain(bank) {
  const baseUrl = "https://www.saudiexchange.sa";

  const bank1120 =
    "https://www.saudiexchange.sa/wps/portal/saudiexchange/hidden/company-profile-main/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz83d2MXA0C3SydAl1c3Q0NvE30w1EVGAQHmAIVBPga-xgEGbgbmOlHEaPfAAdwNCCsPwqvEndzdAVYnAhWgMcNXvpR6Tn5SZDwyCgpKbBSNVA1KElMSSwvzVEFujE5P7cgMa8yuDI3KR-oyNDQyEC_IDc0wiAzIDfcUVERAKT0t_w!/p0/IZ7_5A602H80O0VC4060O4GML81G57=CZ6_5A602H80OGF2E0QF9BQDEG10K4=NJstatementsTabData=/?statementType=6&reportType=0&requestLocale=en&symbol=1120";
  const bank4002 =
    "https://www.saudiexchange.sa/wps/portal/saudiexchange/hidden/company-profile-main/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz83d2MXA0C3SydAl1c3Q0NvE30w1EVGAQHmAIVBPga-xgEGbgbmOlHEaPfAAdwNCCsPwqvEndzdAVYnAhWgMcNXvpR6Tn5SZDwyCgpKbBSNVA1KElMSSwvzVEFujE5P7cgMa8yuDI3KR-oyMTAwEg_ODVPvyA3NMIgMyA3XNdREQD6aEy_/p0/IZ7_5A602H80O0VC4060O4GML81G57=CZ6_5A602H80OGF2E0QF9BQDEG10K4=NJstatementsTabData=/?statementType=6&reportType=0&requestLocale=en&symbol=4002";
  try {
    if (!bank.dataUrl) {
        throw new HttpError(404, "Data Url not found");
    }
    const html = await fetchHtml(bank.dataUrl);
    const xlsLinks = extractXlsLinks(html);
    const sortedLinks = sortLinksByDate(xlsLinks);

    if (sortedLinks.length > 0) {
      console.log("Sorted .xls links:");
      await downloadAndConvertXlsToJson(baseUrl, sortedLinks);
      console.log("Completed");
      return;
    } else {
      console.log("No .xls links found.");
    }
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

module.exports = { fetchBankMain };
