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
function getDetail(movie){
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "GET",
            url: `http://localhost:3000/movies/detail/${movie.movie.ids.slug}`
        })
        .done(function (detail) {
            movie["rating"] = detail.rating;
            movie["overview"] = detail.overview;
            movie["trailer"] = detail.trailer;
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
        const promisesImage = [];
        const promisesDetail = [];
        for (let i = 0; i < responses.length; i++) {
            promisesImage.push(getPoster(responses[i]));
            promisesDetail.push(getDetail(responses[i]));
        }
        Promise.all(promisesImage)
        .then((images) => {
            return Promise.all(promisesDetail)
        })
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

   
        console.log(responses[i].trailer.split('watch?v=')[0] + 'embed/' + responses[i].trailer.split('watch?v=')[1]);
        
        $("#movies-row").append(
        `
    

        <div  class="inner col-2 card" style="margin-bottom:25px">
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
            <div  class="card-reveal" >
                <span   class="card-title grey-text text-darken-4">
                   ${responses[i].movie.title}
                    <i class="material-icons right">close</i>
                </span>
                <p>
                    <span>Rating : ${responses[i].rating}</span><br><br>
                    <span>${responses[i].overview}</span><br><br>

                    <span><a href="${responses[i].trailer}" target="_blank"> Go to Youtube</span>
                    
                    <span><a href="#portfolioModal1" data-toggle="modal">Trailer</a></span>


                    <a class="portfolio-link" data-toggle="modal" href="#portfolioModal${i}">


                    
                </p>
            </div>


            <div class="portfolio-modal modal fade" id="portfolioModal${i}" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="close-modal" data-dismiss="modal">
                  <div class="lr">
                    <div class="rl"></div>
                  </div>
                </div>
                <div class="container">
                  <div class="row">
                    <div class="col-lg-8 mx-auto">
                      <div class="modal-body">
                        <!-- Project Details Go Here -->
                        
                        <div class="container">
                          <iframe width="697" height="392" src="${responses[i].trailer.split('watch?v=')[0] + 'embed/' + responses[i].trailer.split('watch?v=')[1] }" frameborder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>
                        </div>
                     
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>`);
    }   
}

// https://www.youtube.com/   watch?v=     egDqXpwKwnk

