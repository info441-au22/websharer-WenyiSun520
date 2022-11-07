import express from "express";

var router = express.Router();

import getURLPreview from "../utils/urlPreviews.js";

//TODO: Add handlers here

router.get("/preview", async (req, res) => {
  let url = req.query.url;
  let results = await getURLPreview(url);
  res.send(results);
});

export default router;
