$(document).ready(function(){
    if(localStorage.getItem('token')){
        $('#home-page').hide()
        $('#main-page').show()
    }else{
        $('#home-page').show()
        $('#main-page').hide() 
    }
    register()
    login()
    showTrending()
    showPopular()
    showMostPlayed()
    showBoxOffice()
    searchMovie()
})

function register(){
    $('#register').click(function(){
        let name = $('#nameReg').val()
        let email = $('#emailReg').val()
        let password = $('#passwordReg').val()
        $('#registerForm').submit(function(event){
            event.preventDefault()
            $.ajax({
                url: 'http://localhost:3000/users/register',
                method: 'POST',
                data: {
                    name, email, password
                }
            })
            .done(response=>{
                swal("Success!", "Register Successfull!", "success");
                $('#exampleModal').hide()
                $('.modal-backdrop').hide()
                $("#login-page").hide()
                $("#home-page").show()
            })
            .fail(error=>{
                swal("Error job!", "You clicked the button!", "error");
            })
        })
    })
}

function login(){
    $('#login').click(function(){
        let email = $('#emailLog').val()
        let password = $('#passwordLog').val()
        $('#loginForm').submit(function(event){
            event.preventDefault()
            $.ajax({
                url: 'http://localhost:3000/users/login',
                method: 'POST',
                data:{
                    email, password
                }
            })
            .done(response=>{
                localStorage.setItem('token', response)
                swal("Success!", "Login Success!", "success");
                $('#home-page').hide()
                $('#main-page').show()
            })
            .fail(error=>{
                swal("Error!", "Login Failed!", "error");
            })
        })
    })
}


function showCinema(){
    $('#btncinema').click(function(){
        $.ajax({
            url: 'http://localhost:3000/cinemas',
            method: 'GET'
        })
        .done(response=>{
            let mapData = {
                address: response.json.candidates[0].formatted_adress,
                lat: response.json.candidates[0].geometry.location.lat,
                lng: response.json.candidates[0].geometry.location.lng
            }
            let place = {lat: mapData.lat, lng: mapData.lng}
            let map = new google.maps.Map(
                document.getElementById('map'), {zoom: 12, center: place})
            let marker = new google.maps.Marker({position : place, map : map})
        })
        .fail(error=>{
            console.log(error)
        })
    })
}
function getPoster(movie){
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "POST",
            url: `http://localhost:3000/omdb/search/`,
            data: {
                imdb: movie.movie.ids.imdb
            }
        })
        .done(function (image) {
            movie["Poster"] = image.Poster;
            resolve(movie);
        })
    });
}

function showTrending() {
    let movies = [];
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/movies/trending`,
        headers: {
            "token": localStorage.getItem("token")
        }
    })
    .done(function(responses){
        movies = responses;
        const promises = [];
        for (let i = 0; i < responses.length; i++) {
            promises.push(getPoster(responses[i]));
        }
        Promise.all(promises)
        .then((results) => {
            showGrid(results);
        });
    })
    .fail(function(err){
        console.log(err);
    });
}


function showPopular() {
    $('#show-popular').click(function (event) {
        event.preventDefault();
        let movies = [];
        $.ajax({
            method: "GET",
            url: `http://localhost:3000/movies/popular`,
            headers: {
                "token": localStorage.getItem("token")
            }
        })
        .done(function(responses){
            movies = responses;
            const promises = [];
            for (let i = 0; i < responses.length; i++) {
                promises.push(getPoster(responses[i]));
            }
            Promise.all(promises)
            .then((results) => {
                showGrid(results);
            });
        })
        .fail(function(err){
            console.log(err);
        });
    });
}

function showMostPlayed() {
    $('#show-most-played').click(function (event) {
        event.preventDefault();
        let movies = [];
        $.ajax({
            method: "GET",
            url: `http://localhost:3000/movies/most-played`,
            headers: {
                "token": localStorage.getItem("token")
            }
        })
        .done(function(responses){
            movies = responses;
            const promises = [];
            for (let i = 0; i < responses.length; i++) {
                promises.push(getPoster(responses[i]));
            }
            Promise.all(promises)
            .then((results) => {
                showGrid(results);
            });
        })
        .fail(function(err){
            console.log(err);
        });
    });
}

function showBoxOffice() {
    $('#show-boxoffice').click(function (event) {
        event.preventDefault();
        let movies = [];
        $.ajax({
            method: "GET",
            url: `http://localhost:3000/movies/boxoffice`,
            headers: {
                "token": localStorage.getItem("token")
            }
        })
        .done(function(responses){
            movies = responses;
            const promises = [];
            for (let i = 0; i < responses.length; i++) {
                promises.push(getPoster(responses[i]));
            }
            Promise.all(promises)
            .then((results) => {
                showGrid(results);
            });
        })
        .fail(function(err){
            console.log(err);
        });
    });
}

function searchMovie() {
    $('#search-btn').click(function (event) {
        event.preventDefault();
        let movies = [];
        $.ajax({
            method: "POST",
            url: `http://localhost:3000/movies/search`,
            headers: {
                "token": localStorage.getItem("token")
            },
            data: {
                "search": $("#search-box").val()
            }
        })
        .done(function(responses){
            movies = responses;
            const promises = [];
            for (let i = 0; i < responses.length; i++) {
                promises.push(getPoster(responses[i]));
            }
            Promise.all(promises)
            .then((results) => {
                showGrid(results);
            });
        })
        .fail(function(err){
            console.log(err);
        });
    });
}

function showGrid (responses) {
    $("#movies-row").empty();
    for (let i = 0; i < responses.length; i++) {
        let watchers = "";
        if (responses[i].watchers !== undefined) {
            watchers = responses[i].watchers;
        }
        else if (responses[i].score !== undefined) {
            watchers = responses[i].score
        }
        $("#movies-row").append(
        `<div class="inner col-2 card" style="margin-bottom:25px">
            <div class="card-image waves-effect waves-block waves-light">
                <img class="activator" src="${responses[i].Poster}">
            </div>
            <div class="card-content">
                <span class="card-title activator grey-text text-darken-4">
                    ${responses[i].movie.title}
                </span>
                <p>
                    <span>${watchers} watchers</span>
                </p>
            </div>
            <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">
                    ${responses[i].movie.title}
                    <i class="material-icons right">close</i>
                </span>
                <p>
                    Produced Year : ${responses[i].movie.year}
                    IMDB Code : ${responses[i].movie.ids.imdb}
                </p>
            </div>
        </div>`);
    }   
}
