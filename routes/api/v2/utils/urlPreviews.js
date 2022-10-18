import fetch from "node-fetch";
import parser from "node-html-parser";

async function getURLPreview(url) {
  // TODO: Copy from your code for making url previews in A2 to make this
  // a function that takes a url and returns an html string with a preview of that html
  let urlRawContents = await fetch(url).catch(function (err) {
    console.log("there is an error when fetching url content: " + err);
    // res.send("there is an error when fetching url content: " + err); // send error msg when fetch failed
  });
  let urlTextContents = await urlRawContents.text();
  let htmlPage = parser.parse(urlTextContents); // parse responsed html

  return htmlPage;
}

export default getURLPreview;
