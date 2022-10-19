import fetch from "node-fetch";
import parser from "node-html-parser";

async function getURLPreview(url) {
  try {
    let urlRawContents = await fetch(url);
    let urlTextContents = await urlRawContents.text();
    let htmlPage = parser.parse(urlTextContents); // parse responsed html
    // Copy & Paste from a2:
    let avgRating = "";
    let genre = "";
    if (url.includes("imdb.com/title/")) {
      let movieInfoScript = htmlPage.querySelector(
        "script[type='application/ld+json']"
      );
      let movieRawText = movieInfoScript.childNodes[0].parentNode.rawText;
      let movieInfoJson = JSON.parse(movieRawText);
      avgRating =
        "Average Rating: " + movieInfoJson.aggregateRating.ratingValue;
      genre = "Genre: " + movieInfoJson.genre;
    }
    let urlTag = htmlPage.querySelector('meta[property="og:url"]');
    let titleTag = htmlPage.querySelector('meta[property="og:title"]');
    let descripTag = htmlPage.querySelector('meta[property="og:description"]');
    let imgTag = htmlPage.querySelector('meta[property="og:image"]');

    if (urlTag != undefined && urlTag.getAttribute("content") == "") {
      urlTag.setAttribute("content", url);
    }
    let htmlTitle = htmlPage.getElementsByTagName("title")[0].textContent;
    if (htmlTitle == undefined) {
      htmlTitle = url;
    }
    let results = `
    <div class='output-box'>
    <a href=
    ${urlTag == undefined ? url : urlTag.getAttribute("content")}
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

    return results;
  } catch (err) {
    console.log(err);
    return "Error preview:" + err;
  }
}

export default getURLPreview;
