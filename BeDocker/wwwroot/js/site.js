$(".app-giphy").click(function () { fetchGiphs(); });
$(".btn-show").click(function () { GetFromDataBase() });
$(".app-images").click(function () { fetchPhotos() });
$(".app-videos").click(function () { fetchVideos() });
$(".app-chat").click(function () { fetchText() }); 

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
//1
function fetchGiphs() {
    const searchTerm = $(".input-for-giphy").val();
    const count = $(".input-count").val();
    if (count <0 ) {
        alert("Count must be higher than 0!");
        count = 1;
    }

    if (searchTerm == '') {
        return;
    }
    //my key from giphy dev-mod
    const key = "t8FZGHkgkH0CuZSmOv1RLK2NxGzbjgH0";

    fetch(`https://api.giphy.com/v1/gifs/search?&q=${searchTerm}&limit=${count}&api_key=${key}`)
        .then((response) => { return response.json(); })
        .then((resp => {
            let dataArray = resp.data;
            PostGiphsToDataBase(searchTerm, dataArray);

            showGiphs(dataArray);
        }))
        .catch(err => console.log(err));
}

function showGiphs(dataArray) {
    let output = '<div class="container">';

    dataArray.forEach((imgData) => {
        output += `
        <div class="img_element">
            <img src="${imgData.images.fixed_width.url}"/>
        </div>
    `;
    });

    document.querySelector('.main-table').innerHTML = output;
}

function PostGiphsToDataBase(searchTerm, dataArray) {
    var obj = { Key: searchTerm, Links: dataArray.map(t => t.bitly_gif_url) };
    postData("/Home/AddSearchHistory", obj)
        .then((data) => {
            console.log(data);
            return data;
        });
}

//2
function fetchPhotos() {
    const searchTerm = $(".input-for-giphy").val();
    const count = $(".input-count").val();
    if (count <= 0) {
        alert("Count must be higher than 0!");
        count = 1;
    }

    if (searchTerm == '') {
        return;
    }
    
    const url = `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=${count}&client_id=yoLuxVKikO3J_03bLNOxA-Llbhv4P7G0kG4hKgg3YQ0`;

    fetch(url, {
        headers: {
            "content-type": "application/json",
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'application/json',
        },
        auth: {
            "auth_header_name": "Authorization"
        },
    }).then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
    })
    .then(resp => {
        let dataArray = resp.results;
        PostPhotosToDataBase(searchTerm, dataArray);
        showPhotos(dataArray);
    })
    .catch(error => console.log(error));  
}    

function showPhotos(dataArray) {
    let output = '<div class="container">';

    dataArray.forEach((imgData) => {
        output += `
        <div class="img_element">
            <a>${imgData.links.html}</a>
        </div>
    `;
    });

    document.querySelector('.main-table').innerHTML = output;
}

function PostPhotosToDataBase(searchTerm, dataArray) {
   
    var obj = { Key: searchTerm, Links: dataArray.map(t => t.links.html) };
    
    postData("/Home/AddSearchHistory", obj)
        .then((data) => {
            console.log(data);
            return data;
        });
}
//3
function fetchVideos() {
    const searchTerm = $(".input-for-giphy").val();
    const count = $(".input-count").val();
    if (count <= 0) {
        alert("Count must be higher than 0!");
        count = 1;
    }

    if (searchTerm == '') {
        return;
    }

    const key = "563492ad6f91700001000001613b614ca4774644baa22795c9cb1c49";
    const url = `https://api.pexels.com/videos/search?query=${searchTerm}&per_page=${count}`;

    fetch(url, {
        headers: {
            Authorization: key,
        }
    }).then(response => {
        if (!response.ok) throw Error(response.statusText);
        console.log(response.statusText);
        return response.json();
    })
    .then(resp => {
        let dataArray = resp.videos;
        console.log(resp);
        PostVideosToDataBase(searchTerm, dataArray);
        showVideos(dataArray);
    })
    .catch(error => console.log(error));
}

function showVideos(dataArray) {
    let output = '<div class="container">';

    dataArray.forEach((Data) => {
        output += `
        <div class="img_element">
            <a src="">${Data.url}</a>
        </div>
    `;
        console.log(Data.url);
    });

    document.querySelector('.main-table').innerHTML = output;
}

function PostVideosToDataBase(searchTerm, dataArray) {
    var obj = { Key: searchTerm, Links: dataArray.map(t => t.url) };
    postData("/Home/AddSearchHistory", obj)
        .then((data) => {
            console.log(data);
            return data;
        });
}
//4
function fetchText() {
    const searchTerm = $(".input-for-text").val();
    const count = $(".input-count").val();
    const key = "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";

    if (count <= 0) {
        alert("Count must be higher than 0!");
        count = 1;
    }

    if (searchTerm == '') {
        return;
    }

    try {
        const aiResponse = fetch("https://chat.openai.com/backend-api/conversation", {
            "headers": {
                "authority": "chat.openai.com",
                authorization: key,
            },
            "body": JSON.stringify({
                "messages": [{
                    "id": "ffa75905-d80e-4c74-bbd1-7adfe6ba523e",
                    "role": "user",
                    "content": { "content_type": "text", "parts": searchTerm }
                }],
                "conversation_id": "ab21dc8c-39d4-4589-90b6-ff5c5af364e3",
                "parent_message_id": "577372cf-a7f5-425e-8723-5d46bb98b7b0",
                "model": "text-davinci-002-render"
            }),
            auth: {
                "auth_header_name": "Authorization"
            },
            "method": "POST",
            mode:"no-cors"
        });

        if (aiResponse.status === 200) {
            let dataArray = aiResponse.messages;
            console.log(resp);
            PostTextToDataBase(searchTerm, dataArray);
            showText(dataArray);
        }
    } catch (exception) {
        console.log(`Exception Occurred`);
        console.error(exception);
    }
}

function showText(dataArray) {
    let output = '<div class="container">';

    dataArray.forEach((Data) => {
        output += `
        <div class="img_element">
            <source src="${Data.url}" type="video/mp4"/>
        </div>
    `;
        console.log(Data.url);
    });

    document.querySelector('.main-table').innerHTML = output;
}

function PostTextToDataBase(searchTerm, dataArray) {
    var obj = { Key: searchTerm, Links: dataArray.map(t => t.url) };
    postData("/Home/AddSearchHistory", obj)
        .then((data) => {
            console.log(data);
            return data;
        });
}

//---
function showHistory(data) {
    var table = $("#SearchHistoryTable");
    table.html("");

    data.forEach((item) => {
        var tr = $(`
            <tr class="tr-table">
                <td>${item.id}</td>
                <td>-</td>
                <td>${item.searchKey}</td>
            </tr>`);
        var linksTd = $(`<td class="td-elements"></td>`);
        tr.append(linksTd);

        if (item.links && item.links.length) {
            item.links.forEach(t => {
                linksTd.append(`<a class="link-result" href="${t}">${t}</a>`)
            })
        }

        table.append(tr);
    });
}

function GetFromDataBase() {
    getData("/Home/GetAllSearchHistory")
        .then((data) => {
            showHistory(data);
            return data;
        });
}