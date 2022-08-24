$(".btn-search").click(function () { fetchGiphs(); });
$(".btn-show").click(function () { GetFromDataBase() });

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

function fetchGiphs() {
    const searchTerm = $(".input-for-giphy").val();
    const limit = 10;
    //my key from giphy dev-mod
    const key = "t8FZGHkgkH0CuZSmOv1RLK2NxGzbjgH0";

    fetch(`https://api.giphy.com/v1/gifs/search?&q=${searchTerm}&limit=${limit}&api_key=${key}`)
        .then((response) => { return response.json(); })
        .then((resp => {
            console.log(resp);
            let dataArray = resp.data;

            PostToDataBase(searchTerm, dataArray);

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

function showGiphsHistory(data) {
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

function PostToDataBase(searchTerm, dataArray) {
    var obj = { Key: searchTerm, Links: dataArray.map(t => t.bitly_gif_url) };
    postData("/Home/AddSearchHistory", obj)
        .then((data) => {
            console.log(data);
            return data;
        });
}

function GetFromDataBase() {
    getData("/Home/GetAllSearchHistory")
        .then((data) => {
            showGiphsHistory(data);
            return data;
        });

}


