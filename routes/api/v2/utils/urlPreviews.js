import fetch from "node-fetch";
import parser from "node-html-parser";

async function getURLPreview(url) {
  const escapeHTML = (str) =>
    str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        }[tag])
    );
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

    // create a tagmap and store updated tags to tagMap:
    let tagMap = new Map();
    if (urlTag != null) {
      if (urlTag.getAttribute("content") == undefined) {
        urlTag.setAttribute("content", url);
      }
      tagMap.set("og:url", urlTag.getAttribute("content"));
    }
    if (titleTag != null) {
      if (titleTag.getAttribute("content") == undefined) {
        let htmlTitle = htmlPage.getElementsByTagName("title")[0].textContent;
        if (htmlTitle === undefined) {
          htmlTitle = url;
        }
        titleTag.setAttribute("content", htmlTitle);
      }
      tagMap.set("og:title", titleTag.getAttribute("content"));
    }
    if (descripTag != null)
      tagMap.set("og:description", descripTag.getAttribute("content"));

    if (imgTag != null) tagMap.set("og:image", imgTag.getAttribute("content"));
    // go throw map and escapehtml for every tag contents
    const iter = tagMap.keys();
    for (let i = 0; i < tagMap.size; i++) {
      let key = iter.next().value;
      let content = tagMap.get(key);
      let updateContent = escapeHTML(content);
      tagMap.set(key, updateContent);
    }

    let results = `
    <div class='output-box'>
    <a href=
    ${tagMap.get("og:url")}
    ><br>
    <p><strong>
     ${tagMap.get("og:title")} 
    </strong></p>
    <p><strong>
    ${avgRating} 
    </strong></p>
    <img class="input-img" src=
    ${tagMap.get("og:image")}> 
    </a><p>
    ${genre}
    </p><p>
    ${tagMap.get("og:description")};
)}
    </p>`;

    return results;
  } catch (err) {
    console.log(err);
    return "Error preview:" + err;
  }
}

export default getURLPreview;
