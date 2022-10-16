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
  if (query.includes("imdb.com/title/")) {
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
    let propertyOfTag = tag.getAttribute("property");
    if (
      propertyOfTag == "og:title" ||
      propertyOfTag == "og:url" ||
      propertyOfTag == "og:description" ||
      propertyOfTag == "og:image"
    )
      return true;
    else return false;
  });
  // console.log("basic meta tags: " + basicMeta); // debug

  let urlTag = basicMeta.find(
    (tag) => tag.getAttribute("property") == "og:url"
  );
  if (urlTag != undefined && urlTag.getAttribute("content")=="") {
    urlTag.setAttribute("content", query);
  }

  let titleTag = basicMeta.find(
    (tag) => tag.getAttribute("property") == "og:title"
  );
  let htmlTitle = htmlPage.getElementsByTagName("title")[0].textContent;
  if(htmlTitle == undefined){
    htmlTitle = query;
  }
  let imgTag = basicMeta.find((tag) => tag.attributes.property == "og:image");
  let descripTag = basicMeta.find(
    (tag) => tag.attributes.property == "og:description"
  );

  let results = `
    <div class='output-box'>
    <a href=
    ${urlTag == undefined ? query : urlTag.getAttribute("content")}
    ><br>
    <p><strong>
     ${titleTag == undefined ? htmlTitle : titleTag.getAttribute("content")} 
    </strong></p>
    <p><strong>
    ${avgRating} 
    </strong></p>
    <img class="input-img" src=
    ${imgTag == undefined ? "" : imgTag.getAttribute("content")}> 
    </a><p>
    ${genre}
    </p><p>
    ${descripTag == undefined ? "" : descripTag.getAttribute("content")}
    </p>`;
  res.send(results);
});

export default router;
