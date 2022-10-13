import express, { json } from "express";
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
  // console.log("htmlpage: " + htmlPage); // debug: get all meta tags successfully

  let jsonInfo = htmlPage.querySelector("script[type='application/ld+json']");
  // console.log(jsonInfo);
  // console.log("type of jsonInof: " + typeof jsonInfo);
  let movieRawInfo = jsonInfo.childNodes[0].parentNode.rawText;
  let movieInfoJson = JSON.parse(movieRawInfo);

  // console.log(movieRawInfo);
  // console.log(movieInfoJson);
  // console.log("type of raw info is" + typeof movieInfoJson);
  let avgRating = movieInfoJson.aggregateRating.ratingValue;
  let genre = movieInfoJson.genre;


  let metaTags = htmlPage.querySelectorAll("meta"); // select all meta tags
  // console.log("url meta tags: " + metaTags); // debug: get all meta tags successfully
  let basicMeta = metaTags.filter((tag) => {
    if (
      tag.getAttribute("property") == "og:title" ||
      tag.getAttribute("property") == "og:url" ||
      tag.getAttribute("property") == "og:description" ||
      tag.getAttribute("property") == "og:image"
    )
      return true;
  });
  // console.log("url basic tags: " + basicMeta); //debug: get tags properly

  let urlTag = basicMeta.find((tag) => tag.attributes.property == "og:url");
  if (urlTag.getAttribute("content") == undefined) {
    urlTag.setAttribute("content", query);
  }
  let titleTag = basicMeta.find((tag) => tag.attributes.property == "og:title");
  if (titleTag.getAttribute("content") == undefined) {
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
    "<p><strong>Average Rating: " +
    avgRating +
    "</strong></p>" +
    "<img src='" +
    imgTag.getAttribute("content") +
    "'style='max-height: 200px; max-width:270px;'>" +
    "</a>" +
    "<p>Genre: "+
    genre+
    "</p>"+
    "<p>" +
    descripTag.getAttribute("content") +
    "</p>";
  res.send(results);
});

export default router;
