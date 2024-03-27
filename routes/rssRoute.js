import express from "express";
import {
  rssFeed,
  getCompaniesName,
  setCompaniesName,
  getIndianCompaniesName
} from "../controllers/rssfeedController.js";

const rssRoute = express.Router();

rssRoute.get("/rss-feed" , rssFeed);
rssRoute.get("/set-company-name" , setCompaniesName);
rssRoute.get("/get-indian-company-name", getIndianCompaniesName);
rssRoute.get("/get-us-company-name", getCompaniesName);

export default rssRoute;