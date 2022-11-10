import express from "express";

var router = express.Router();

router.get("/", async (req, res) => {
  try {
    let allComments = await req.models.Comment.find({post:req.query.postID});
    res.json(allComments);
  } catch (err) {
    console.log("Error when getting Post: " + err);
    res.status(500).json({ status: "error", error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    if (req.session.isAuthenticated) {
      let newComment = new req.models.Comment({
        username: req.session.account.username,
        comment: req.body.newComment,
        post: req.body.postID,
        created_date: Date(),
      });
      await newComment.save();
      res.json({status: "success" });
    } else {
      res.status(401).json({ status: "error", error: "not logged in" });
    }
  } catch (err) {
    console.log("Error when posting new comment: " + err);
    res.status(500).json({ status: "error", error: err });
  }
});
export default router;
