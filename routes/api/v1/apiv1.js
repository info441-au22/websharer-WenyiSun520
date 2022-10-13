import express from "express";
import fetch from "node-fetch";
import parser from "node-html-parser";
let router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Respond from apiv1.js");
// });

router.get("/urls/preview", async (req, res) => {
  let query = req.query.url;
  //console.log("query is : " + query); // debug: get query successfully
  let urlRawContents = await fetch(query).catch(function (err) {
    console.log("there is an error when fetching url content: " + err);
    res.send("there is an error when fetching url content: " + err); // send error msg when fetch failed
  });
  let urlTextContents = await urlRawContents.text();

  let htmlPage = parser.parse(urlTextContents); // parse responsed html
  let metaTags = htmlPage.querySelectorAll("meta"); // select all meta tags
  // console.log("url meta tags: " + metaTags); // debug: get all meta tags successfully
  let basicMeta = metaTags.filter((tag) => {
    // find the tags that have basic meta property
    if (tag.attributes.property == "og:title") {
      if (tag.attributes.content == "") {
        let titleTag = html.querySelector("title");
        if (titleTag == null) {
          tag.attributes.content = query; // title is query if title tag is missing
        } else {
          tag.attributes.content = titleTag;
        }
      }
      return true;
    }

    if (tag.attributes.property == "og:url") {
      if (tag.attributes.content == "") {
        tag.attributes.content == query;
      }
      return true;
    }
    if (
      tag.attributes.property == "og:description" ||
      tag.attributes.property == "og:image"
    )
      return true;
  });

  console.log("url basic tags: " + basicMeta); //debug: get tags properly

  let htmlStr = basicMeta.map((tagInfo) => {
      return (
        "<h3>Property " +
        tagInfo.attributes.property +
        "</h3>" +
        "<p>content: " +
        tagInfo.attributes.content +
        "</p>" +
        "<br>" +
        "<br>"
      );
    })
    .join("");
  console.log("HTML String: " + htmlStr); //debug: get tags properly
  res.send(htmlStr);
});

export default router;
