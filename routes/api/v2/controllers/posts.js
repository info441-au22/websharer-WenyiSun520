import express from "express";

var router = express.Router();

// import getURLPreview from "../utils/urlPreviews.js";

//TODO: Add handlers here
router.post("/", async (req, res) => {
  try {
    let newUserInput = new req.models.Post({
      url:req.body.url,
      description: req.body.description,
      date: new Date()
    })
    await newUserInput.save();
    res.send({ status: "success" });
  } catch (err) {
    console.log("There is an error when saving user input: " + err);
    res.status(500).json({ status: "error", error: error });
  }
});

export default router;
