import express from "express";
import session from "express-session";

var router = express.Router();

router.get("/myIdentity", (req, res, next) => {
  if (req.session.isAuthenticated) {
    res.json({
      status: "loggedin",
      userInfo: {
        name: req.session.account.name,
        username: req.session.account.username,
      },
    });
  } else {
    res.json({ status: "loggedout" });
    return;
  }
});

router.post("/userInfo", async (req, res) => {
  try {
    let currentUsername = req.session.account.username;
    let userInfo = await req.models.UserInfo.findOne({
      username: currentUsername,
    });

    if (userInfo == null) {
      // this is a first-time user, create a schema for the user and save data
      let newUserInfo = new req.models.UserInfo({
        username: req.session.account.username,
        nikename: req.body.nikename,
        diary: [
          {
            created_date: Date(),
            diary_content: req.body.diary,
          },
        ],
      });
      await newUserInfo.save();
    } else {
      if (req.body.nikename.length != 0) {
        userInfo.nikename = req.body.nikename;
      }

      if (req.body.diary.length != 0) {
        userInfo.diary.push({
          created_date: Date(),
          diary_content: req.body.diary,
        });
      }
      await userInfo.save();
    }
    res.send({ status: "success" });
  } catch (error) {
    console.log("Error saving userInfo: ", error);
    res.status(500).json({ status: "error", error: error });
  }
});

router.get("/userInfo", async (req, res) => {
  try {
    let currentUsername = req.session.account.username;
    let userInfo = await req.models.UserInfo.findOne({
      username: currentUsername,
    });
    if (userInfo == null) {
      res.json({ status: "fail", error: "I can't find your diaries because you haven't update one"})
    } else {
      res.json({status: "success", userInfo: userInfo});
    }
  } catch (err) {
    console.log("There is an error when getting userInfo: " + err);
    res.status(500).json({ status: "error", error: err });
  }
});

export default router;
