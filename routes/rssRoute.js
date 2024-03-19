import express from "express";
import { rssFeed, companiesName } from "../controllers/rssfeedController.js";

const rssRoute = express.Router();

rssRoute.get("/rss-feed" , rssFeed);
rssRoute.get("/companies-name" , companiesName);

export default rssRoute;