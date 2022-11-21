import express from "express";
import session from "express-session";

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
  if (username == undefined) {
    resultPosts = await req.models.Post.find();
  } else {
    resultPosts = await req.models.Post.find({ username: username });
  }

  try {
    resultsArr = await Promise.all(
      resultPosts.map(async (post) => {
        let obj = {
          description: "",
          htmlPreview: "",
          username: "",
          created_date: "",
          id: "",
          likes: [],
        };
        try {
          let preview = await getURLPreview(post.url);
          obj.htmlPreview = preview;
          obj.description = post.description;
          obj.username = post.username;
          obj.created_date = post.created_date;
          obj.id = post._id;
          obj.likes = post.likes;
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


router.post('/like',async(req,res)=>{
  try{
    if (req.session.isAuthenticated) {
        let id = req.body.postID;
        let likePosts = await req.models.Post.findById(id);
        if(!likePosts.likes.includes(req.session.account.username)){
          likePosts.likes.push(req.session.account.username);
        }
        await likePosts.save();
        res.json({"status":"success"});

    }else{
      res.status(401).json({status: "error", error: "not logged in"})
    }
  }catch(err){
    console.log("Error in like Post Route: "+err);
    res.status(500).json({status: "error", error: err})

  }
})

router.post('/unlike',async(req,res)=>{
  try{
    if (req.session.isAuthenticated) {
        let id = req.body.postID;
        let unlikePosts = await req.models.Post.findById(id);
        if (unlikePosts.likes.includes(req.session.account.username)) {
          let index = unlikePosts.likes.indexOf(req.session.account.username);
          unlikePosts.likes.splice(index, 1);
        }
        await unlikePosts.save();
        res.json({"status":"success"});

    }else{
      res.status(401).json({status: "error", error: "not logged in"})
    }
  }catch(err){
    console.log("Error in unlike Post Route: "+err);
    res.status(500).json({status: "error", error: err})

  }
})

router.delete('/',async(req,res)=>{
  try{
      if (req.session.isAuthenticated) {
        let id = req.body.postID;
        let userPosts = await req.models.Post.findById(id);
        if(userPosts.username != req.session.account.username){
                res.status(401).json({status: "error", error: "you can only delete your own posts"})
        }
        await req.models.Comment.deleteMany({post: id});
        await req.models.Post.deleteOne({_id : id})
        res.json({"status":"success"});
      }else{
        res.status(401).json({status: "error", error: "not logged in"})
      }
    }catch(err){
    console.log("Error in delete Post Route: "+err);
    res.status(500).json({status: "error", error: err})
    }

})


export default router;
