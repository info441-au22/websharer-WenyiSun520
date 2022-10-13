
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    
    let htmlStr = await fetch("api/v1/urls/preview?url="+url)
                        .catch(function(err){displayPreviews(err)});
                        
    let preview = await htmlStr.text();
    
    displayPreviews(preview)
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
