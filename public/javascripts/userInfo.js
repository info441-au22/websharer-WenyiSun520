async function init() {
  document.getElementById("nikename-input").value = "";
  document.getElementById("diary").value = "";
  await loadIdentity();
  loadUserInfo();
}

// async function getGeoLocation() {
//   if (navigator.geolocation) {
//       document.getElementById("location-result").innerText = "Loading...";

//     navigator.geolocation.getCurrentPosition((position) => {
//       let lat = position.coords.latitude;
//       let long = position.coords.longitude;
//       saveGeoLocation(lat, long);
//       document.getElementById(
//         "location-result"
//       ).innerHTML = `<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
//   src="https://www.openstreetmap.org/export/embed.html?bbox=${long}%2C${lat}%2C${long}%2C${lat}&amp;
//   layer=mapnik&amp;marker=${lat}%2C${long}"
//   style="border: 1px solid black"></iframe><br/>`;
//     });
//   } else {
//     document.getElementById("location-result").innerHTML =
//       "Geolocation API is not supported by this browser.";
//   }
// }

async function saveUserInfo() {
  //TODO: do an ajax call to save whatever info you want about the user from the user table
  //see postComment() in the index.js file as an example of how to do this
  let nikename = document.getElementById("nikename-input").value;
  console.log("empty userame: " + nikename);
  let diary = document.getElementById("diary").value;
  await fetchJSON(`api/${apiVersion}/users/userInfo`, {
    method: "POST",
    body: { nikename: nikename, diary: diary },
  });
  init();
}

async function loadUserInfo() {
  let userinfo = await fetch(`api/${apiVersion}/users/userInfo`).then((res) =>
    res.json()
  );
  let nikename = "";
  let diary = "";
  if (userinfo.status == "fail") {
    nikename = "You";
    document.getElementById("user_info_div").innerHTML = userinfo.error;
  } else {
    nikename = userinfo.userInfo.nikename;
    diary = userinfo.userInfo.diary;
    //TODO: do an ajax call to load whatever info you want about the user from the user table
    loadUserInput(diary);
  }
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("user");
  if (username == myIdentity) {
    document.getElementById(
      "username-span"
    ).innerText = `${nikename} (${username})`;
    document.getElementById("user_info_new_div").classList.remove("d-none");
  } else {
    document.getElementById("username-span").innerText = username;
    document.getElementById("user_info_new_div").classList.add("d-none");
  }
  loadUserInfoPosts(username);
}
async function loadUserInput(diary) {
  let diary_result = "";
  for (let i = 0; i < diary.length; i++) {
    let content = diary[i];
    diary_result += `<div class="single-diary">Date: ${content.created_date}
                  <br>
                  Content: ${content.diary_content}
                  <br></div>`;
  }
  document.getElementById("user_info_div").innerHTML = diary_result;
}
async function loadUserInfoPosts(username) {
  document.getElementById("posts_box").innerText = "Loading...";
  let postsJson = await fetchJSON(
    `api/${apiVersion}/posts?username=${encodeURIComponent(username)}`
  );
  document.getElementById("posts_box").innerText = "";
  for (let i = 0; i < postsJson.length; i++) {
    let postInfo = postsJson[i];
    let result = `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(
              postInfo.username
            )}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(
      postInfo.created_date
    )}</div>
            <div class="post-interactions">
                <div>
                    <span title="${
                      postInfo.likes
                        ? escapeHTML(postInfo.likes.join(", "))
                        : ""
                    }"> ${
      postInfo.likes ? `${postInfo.likes.length}` : 0
    } likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${
      postInfo.username == myIdentity ? "" : "d-none"
    }">Delete</button></div>
            </div>
        </div>`;
    document.getElementById("posts_box").innerHTML += result;
  }

  //     let postsHtml = postsJson.map(postInfo => {
  //         return `
  //         <div class="post">
  //             ${escapeHTML(postInfo.description)}
  //             ${postInfo.htmlPreview}
  //             <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
  //             <div class="post-interactions">
  //                 <div>
  //                     <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp;
  //                 </div>
  //                 <br>
  //                 <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
  //             </div>
  //         </div>`
  //     }).join("\n");
  //     document.getElementById("posts_box").innerHTML = postsHtml;
}

async function deletePost(postID) {
  let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
    method: "DELETE",
    body: { postID: postID },
  });
  loadUserInfo();
}
