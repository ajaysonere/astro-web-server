import RSSParser from "rss-parser";
import fs from "fs";
import csv from "csv-parser";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import companyModel from "../models/companyModel.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const parser = new RSSParser();

let artical = [];

const feedURL = "https://rajeevprakash.com/feed/";

const parse = async (url) => {
  try {
    const feed = await parser.parseURL(url);
    artical = feed.items.map((item) => ({ ...item }));
  } catch (error) {
    console.error("Error parsing RSS feed:", error);
  }
};

parse(feedURL);

export const rssFeed = (req, res, next) => {
  try {
    if (artical.length <= 0) {
      res.status(404).json("Artical not found");
    }
    res.status(200).json(artical);
  } catch (error) {
    console.log(error);
  }
};

const readCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const tableData = [];

    const readStream = fs.createReadStream(filePath);

    readStream
      .pipe(csv())
      .on("data", (row) => {
        const extractedData = {
          Symbol: row.Symbol,
          Name: row.Name,
        };
        tableData.push(extractedData);
      })
      .on("end", () => {
        // All data has been read
        resolve(tableData);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

export const companiesName = async (req, res, next) => {
  try {
    const csvFilePath = join(__dirname, "../companiesData.csv");
    const tableData = await readCSVFile(csvFilePath);

    // Save the data to the database using companyModel.insertMany()
    await companyModel.insertMany(tableData);

    res.status(200).json(tableData); // Respond with the data if needed
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json("failed to fetch data");
  }
};
