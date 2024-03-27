import RSSParser from "rss-parser";
import fs from "fs";
import csv from "csv-parser";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import companyModel from "../models/companyModel.js";
import indianCompanyModel from "../models/indianCompanyModel.js";

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

// get the artical and send it to frontend
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


//  reading the csv file and stored the data into the database
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
        resolve(tableData);
      })
      .on("error", (error) => {
        reject(error);
      });
      
  });
};


export const setCompaniesName = async (req , res , next) => {
   try {
        const csvFilePath = join(__dirname, "../companiesData.csv");
        const csvFilePath1 = join(__dirname , "../indianStock.csv");

        
        const tableData = await readCSVFile(csvFilePath);
        
        const tableData1 = await readCSVFile(csvFilePath1);

        await indianCompanyModel.insertMany(tableData1);
        
        await companyModel.insertMany(tableData);
        
        res.status(200).json("Successfully companies data inserted in db");
        
   } catch (error) {
      console.log(error);
      return res.status(500).json("Failed to set companies data");
   }
}


export const getCompaniesName = async (req, res, next) => {
  try {
    const data = await companyModel.find();
    
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("failed to fetch data");
  }
};

export const getIndianCompaniesName = async (req , res ,next) => {
    try {
       const data = await indianCompanyModel.find();
       
       res.status(200).json(data);
    } catch (error) {
      return res.status(500).json("failed to fetch data ");
    }
}
