function getAnimesByFilter(filters) {
    var animes = null;
    var request = $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: "https://localhost:5001/api/Anime/GetByFilter",
        type: "post",
        dataType: "json",
        async: false,
        data: JSON.stringify({ "pageArguments": null, "filters": filters })
    });
    request.done(function (response, textStatus, jqXHR) {
        animes = response;
    });

    request.fail(function (responce, textStatus, errorThrown) {
        console.error(
            "The following error occurred: " +
            responce.responseText
        );
    });

    return animes;
}

function postImage(formData) {
    $.ajax({
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('JwtToken') },
        url: "https://localhost:5001/api/FileUpload",
        data: formData,
        processData: false,
        contentType: false,
        async: false,
        type: "post",
        success: function (data) {
            console.log("Posting");
        }
    });
}
    