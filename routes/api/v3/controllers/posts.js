import express from "express";
import session from 'express-session';

var router = express.Router();

import getURLPreview from "../utils/urlPreviews.js";

//TODO: Add handlers here
router.post("/", async (req, res) => {
  if (req.session.isAuthenticated) {
    try {
      if (Object.keys(req.body.url).length === 0) {
        let error = new Error("Empty url input, please try again");
        console.log(error);
        throw error;
      }
      let newUserInput = new req.models.Post({
        url: req.body.url,
        description: req.body.description,
        created_date: Date(),
        username: req.session.account.username,
      });
      await newUserInput.save();

      res.send({ status: "success" });
    } catch (err) {
      console.log("There is an error when saving user input: " + err);
      res.status(500).json({ status: "error", error: err });
    }
  } else {
    res.status(401).json({ status: "error", error: "not logged in" });
  }
});

router.get("/:username?", async (req, res) => {
  let username = req.query.username;
  let resultsArr = [];
  let resultPosts = "";
  console.log("username: "+username)
  if (username == "undefined"){
        resultPosts = await req.models.Post.find();

  }else{
        resultPosts = await req.models.Post.find({ username: username });

  }
  
  try {
    resultsArr = await Promise.all(
      resultPosts.map(async (post) => {
        let obj = {
          description: "",
          htmlPreview: "",
          username:""
        };
        try {
          let preview = await getURLPreview(post.url);
          obj.htmlPreview = preview;
          obj.description = post.description;
          obj.username = post.username;
        } catch (err) {
          obj.htmlPreview = err;
        }
        return obj;
      })
    );
  } catch (err) {
    console.log("There is an error when posting result posts: " + err);
    res.status(500).json({ status: "error", error: err });
  }
  res.send(resultsArr);
});


export default router;
