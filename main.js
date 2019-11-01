$(document).ready(function(){
    console.log('document is ready')
    register()
    login()
})

function register(){
    $('#register').click(function(){
        let name = $('#nameReg').val()
        let email = $('#emailReg').val()
        let password = $('#passwordReg').val()
        $('#registerForm').submit(function(event){
            event.preventDefault()
            $.ajax({
                url: 'http://localhost:3000/users',
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
                swal("Error job!", "You clicked the button!", "success");
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
                url: 'http://localhost:3000/users',
                method: 'GET',
                data:{
                    email, password
                }
            })
            .done(response=>{
                swal("Success!", "Login Success!", "success");
            })
            .fail(error=>{
                swal("Error!", "Login Failed!", "error");
            })
        })
    })
}