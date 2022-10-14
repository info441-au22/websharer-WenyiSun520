import express, { json } from "express";
import fetch from "node-fetch";
import parser from "node-html-parser";
let router = express.Router();

router.get("/urls/preview", async (req, res) => {
  let query = req.query.url;
  let urlRawContents = await fetch(query).catch(function (err) {
    console.log("there is an error when fetching url content: " + err);
    res.send("there is an error when fetching url content: " + err); // send error msg when fetch failed
  });
  let urlTextContents = await urlRawContents.text();
  let htmlPage = parser.parse(urlTextContents); // parse responsed html

  // Creative Component: if query is from imdb.com, get the average score and genre:
  let avgRating = "";
  let genre = "";
  if (query.includes("imdb.com")) {
    let movieInfoScript = htmlPage.querySelector(
      "script[type='application/ld+json']"
    );
    let movieRawText = movieInfoScript.childNodes[0].parentNode.rawText;
    let movieInfoJson = JSON.parse(movieRawText);
    // add below two variables to results text:
    avgRating = "Average Rating: " + movieInfoJson.aggregateRating.ratingValue;
    genre = "Genre: " + movieInfoJson.genre;
  }

  let metaTags = htmlPage.querySelectorAll("meta"); // select all meta tags
  let basicMeta = metaTags.filter((tag) => {
    if (
      tag.getAttribute("property") == "og:title" ||
      tag.getAttribute("property") == "og:url" ||
      tag.getAttribute("property") == "og:description" ||
      tag.getAttribute("property") == "og:image"
    )return true;
    else return false;
  });
  console.log("basic meta tags: " + basicMeta); // debug
  let urlTag = basicMeta.find(
    (tag) => tag.getAttribute("property") == "og:url"
  );
  if (urlTag == undefined) {
    urlTag = document.createElement("meta");
    urlTag.setAttribute("content", query);
  }
  let titleTag = basicMeta.find(
    (tag) => tag.getAttribute("property") == "og:title"
  );
  if (titleTag== undefined) {
    titleTag = document.createElement("meta");
    let htmlTitle = htmlPage.querySelector("title");
    if (htmlTitle == null) {
      titleTag.setAttribute("content", htmlTitle);
    } else {
      titleTag.setAttribute("content", query);
    }
  }
  let imgTag = basicMeta.find((tag) => tag.attributes.property == "og:image");
  let descripTag = basicMeta.find(
    (tag) => tag.attributes.property == "og:description"
  );
  // debug: finding basic tags:
  // console.log("finding tags:");
  // console.log("urltag: "+ urlTag);
  // console.log("titleTag: "+titleTag);
  // console.log("imgTag: "+ imgTag);
  // console.log("descripTag: "+ descripTag);

  let results =
    " <div class='output-box'> " +
    "<a href='" +
    urlTag.getAttribute("content") +
    "'>" +
    "<br>" +
    "<p><strong>" +
    titleTag.getAttribute("content") +
    "</strong></p>" +
    "<p><strong>" +
    avgRating +
    "</strong></p>" +
    "<img src='" +
    imgTag.getAttribute("content") +
    "'style='max-height: 200px; max-width:270px;'>" +
    "</a>" +
    "<p>" +
    genre +
    "</p>" +
    "<p>" +
    descripTag.getAttribute("content") +
    "</p>";
  res.send(results);
});

export default router;
