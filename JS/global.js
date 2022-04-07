jQuery.extend({
    getStatusId: function (statusName) {
        var id = -1;
        $.ajax({
            type: 'get',
            url: 'https://localhost:5001/api/Anime/GetStatusId?statusName=' + statusName,
            dataType: 'json',
            async: false,
            success: function (data) {
                id = data;
            },
            error: function (errorThrown) {
                console.log(errorThrown);
            }
        });
        return id;
    },
    getAgeRestrictionId: function (ARCode) {
        var id = -1;
        $.ajax({
            type: 'get',
            url: 'https://localhost:5001/api/Anime/GetAgeRestrictionId?ageRestrictionCode=' + ARCode,
            dataType: 'json',
            async: false,
            success: function (data) {
                id = data;
            },
            error: function (errorThrown) {
                console.log(errorThrown);
            }
        });
        return id;
    },
    getAllGenres: function () {
        var genres = Array();
        $.ajax({
            type: 'get',
            url: 'https://localhost:5001/api/Anime/GetAllGenres',
            dataType: 'json',
            async: false,
            success: function (data) {
                genres = data;
            },
            error: function (errorThrown) {
                console.log(errorThrown);
            }
        });
        return genres;
    }
    
})

function refreshToken() {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('JwtToken')
        },
        type: "post",
        url: "https://localhost:5001/api/User/RefreshToken",
        dataType: "json",
        async: false,
        success: function (token) {
            localStorage.setItem("JwtToken", token);
        },
        error: function (errorThrown) {
            console.log(errorThrown.responseJSON);
        }
    });
}

function setExpiration() {
    console.log("In setExp");
    var token = localStorage.getItem("JwtToken");
    if (token) {
        var parsedToken = JSON.parse(atob(token.split('.')[1]));
        if (Date.now() >= parsedToken['exp'] * 1000) {
            console.log(token);
            console.log("Expired in setExpiration");
            window.localStorage.removeItem("JwtToken");
            window.localStorage.removeItem("Expires");
        }
        else {
            window.localStorage.setItem("Expires", parsedToken['exp'] * 1000);
        }
    }
    else {
        window.localStorage.removeItem("Expires");
    }
}

function removeExpiration() {
    if (window.localStorage.getItem("Expires")) {
        window.localStorage.removeItem("Expires");
    }
}
function refreshExpiration() {
    var curExp = window.localStorage.getItem("Expires");
    if (curExp) {
        var newExp = curExp - Date.now();
        if (newExp < 60000 * 2) {
            refreshToken();
            setExpiration();
        }
    }
}
    