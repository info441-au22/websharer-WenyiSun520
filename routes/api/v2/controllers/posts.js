import express from "express";

var router = express.Router();

import getURLPreview from "../utils/urlPreviews.js";

//TODO: Add handlers here
router.post("/", async (req, res) => {
  try {
    let newUserInput = new req.models.Post({
      url: req.body.url,
      description: req.body.description,
      created_date: Date(),
    });
    await newUserInput.save();
    res.send({ status: "success" });
  } catch (err) {
    console.log("There is an error when saving user input: " + err);
    res.status(500).json({ status: "error", error: error });
  }
});

router.get("/", async (req, res) => {
  let resultsArr = [];
  //find all posts:
  let allPosts = await req.models.Post.find();
  //debug:
  // console.log("Find all posts: " + allPosts);
  try{
  resultsArr = await Promise.all(
    allPosts.map(async (post) => {
      let obj = {
        description: "",
        htmlPreview: "",
      };
      try {
        let preview = await getURLPreview(post.url);
        obj.htmlPreview = preview;
        obj.description = post.description;
      } catch (err) {
         obj.htmlPreview = err;
      }
      return obj;
    })
  );
  }catch(err){
       console.log("There is an error when posting all posts: " + err);
       res.status(500).json({ status: "error", error: error });
  }
  // console.log(previewboxes);
  res.send(resultsArr);
});

export default router;
