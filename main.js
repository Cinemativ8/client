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
    showCinema()
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