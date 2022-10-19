import fetch from "node-fetch";
import parser from "node-html-parser";

async function getURLPreview(url) {
  // TODO: Copy from your code for making url previews in A2 to make this
  // a function that takes a url and returns an html string with a preview of that html
  let urlRawContents = await fetch(url).catch(function (err) {
    console.log("there is an error when fetching url content: " + err);
  });
  let urlTextContents = await urlRawContents.text();
  let htmlPage = parser.parse(urlTextContents); // parse responsed html
  // Copy & Paste from a2:
  // Creative Component: if url is from imdb.com, get the average score and genre:
  let avgRating = "";
  let genre = "";
  if (url.includes("imdb.com/title/")) {
    let movieInfoScript = htmlPage.querySelector(
      "script[type='application/ld+json']"
    );
    let movieRawText = movieInfoScript.childNodes[0].parentNode.rawText;
    let movieInfoJson = JSON.parse(movieRawText);
    // add below two variables to results text:
    avgRating = "Average Rating: " + movieInfoJson.aggregateRating.ratingValue;
    genre = "Genre: " + movieInfoJson.genre;
  }
  let urlTag = htmlPage.querySelector('meta[property="og:url"]');
  let titleTag = htmlPage.querySelector('meta[property="og:title"]');
  let descripTag = htmlPage.querySelector('meta[property="og:description"]');
  let imgTag = htmlPage.querySelector('meta[property="og:image"]');
  let quoteTag = urlTag.getAttribute("content") + "quotes/?ref_=tt_trv_qu";
  

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
    ${urlTag == undefined ? url: urlTag.getAttribute("content")}
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
}

export default getURLPreview;
