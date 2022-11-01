import express from "express";

var router = express.Router();

import getURLPreview from "../utils/urlPreviews.js";

//TODO: Add handlers here
router.post("/", async (req, res) => {
  try {
    if (Object.keys(req.body.url).length === 0) {
      let error = new Error("Empty url input, please try again");
      console.log(error);
      throw error;
    }
    let newUserInput = new req.models.Post({
      url: req.body.url,
      description: req.body.description,
      isFav: req.body.isFav,
      created_date: Date(),
    });
    await newUserInput.save();

    res.send({ status: "success" });
  } catch (err) {
    console.log("There is an error when saving user input: " + err);
    res.status(500).json({ status: "error", error: err });
  }
});

router.get("/", async (req, res) => {
  let resultsArr = [];
  //find all posts:
  let allPosts = await req.models.Post.find();
  try {
    resultsArr = await Promise.all(
      allPosts.map(async (post) => {
        let obj = {
          description: "",
          htmlPreview: "",
          isFav: "false",
        };
        try {
          let preview = await getURLPreview(post.url);
          obj.htmlPreview = preview;
          obj.description = post.description;
          obj.isFav = post.isFav;
        } catch (err) {
          obj.htmlPreview = err;
        }
        return obj;
      })
    );
  } catch (err) {
    console.log("There is an error when posting all posts: " + err);
    res.status(500).json({ status: "error", error: err });
  }
  res.send(resultsArr);
});

router.get("/fav", async (req, res) => {
  let resultsArr = [];
  //find all fav posts:
  let allPosts = await req.models.Post.find({ isFav: true });

  try {
    resultsArr = await Promise.all(
      allPosts.map(async (post) => {
        let obj = {
          description: "",
          htmlPreview: "",
          isFav: "true",
        };
        try {
          let preview = await getURLPreview(post.url);
          obj.htmlPreview = preview;
          obj.description = post.description;
          obj.isFav = post.isFav;
        } catch (err) {
          obj.htmlPreview = err;
        }
        return obj;
      })
    );
  } catch (err) {
    console.log("There is an error when posting favorates posts: " + err);
    res.status(500).json({ status: "error", error: err });
  }
  res.send(resultsArr);
});

export default router;
