import * as React from 'react';
import * as ReactDOM from 'react-dom';

// 'bootstrap/dist/css/bootstrap.css';
//import { Grid, Navbar, Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';

import { Router } from './Router';
import { FaceBook } from './FaceBook';

// var potato = require("./Potato.js");

// Init the SocketIO layer
import * as SocketIO from 'socket.io-client';
var Socket = SocketIO.connect();

// Handle FB login dispatching
/*global FB*/
var reload = function(){
    console.log("Reloading page!");
    console.log(route); 
    window.location.reload();
}

var route = "login";
var user = {authToken:"", ID:"", url:"", name:""};
var posts = [];
window.fbAsyncInit = function() {
    FB.init({
      appId      : '1415349178527947',
      xfbml      : true,
      status     : true,
      oauth      : true,
      version    : 'v2.8'
    });
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            console.log("Logged in.");
            route = "app";
            console.log(response);
            user.authToken = response.authResponse.accessToken;
            user.ID = response.authResponse.userID;
            console.log("User:");
            console.log(user);
            Socket.emit("user auth", {ID:user.ID, authToken:user.authToken});
        }
        else {
            console.log("Not logged in.");
            route = "login";
        }
        rend();
    });
    FB.Event.subscribe('auth.login', function(response){
        reload();
    });
    FB.Event.subscribe('auth.logout', function(response){ 
        reload();
    });
};
            
(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Function to dispatch new message when "Send" is clicked in React
var upload = function(data){
    console.log("  --> UPLOAD STARTED");
    console.log(data);
    Socket.emit("post", {img:data.base64,plantname:data.name,location:data.location,authToken:user.authToken});
};

// Function to dispatch new search query when "Search" button is clicked in react
var search = function(search){
    console.log("  --> SEARCH STARTED");
    console.log(search);
    Socket.emit("search", {name:search.name, date:search.date, location:search.location, distance:search.distance, authToken:user.authToken});
};

// Render the React components - call after state change
var rend = function(){
   // Output React Application with current state
    ReactDOM.render(<Router route={route} user={user} posts={posts} upload={upload} search={search}/>, document.getElementById('app')); 
};

// Render the FB button separately "because"
ReactDOM.render(<FaceBook />, document.getElementById('fb-root-btn')); 

// When the user connects to the server, let the console know
Socket.on('connect', function(){
    console.log("Client Connected!");
    console.log("SocketIO:");
    console.log(Socket);
    console.log("Incoming startchy vegetable...");
    // potato.print();
});

// When the user gets a hello message, print it to console
Socket.on('hello', function(data){
    console.log(data["message"]);
});

// When the user gets a hello message, print it to console
Socket.on('oAuth', function(data){
    console.log("oAuth response from server:");
    console.log(data);
    user.name = data['userName'];
    user.url = data['userImgURL'];
    rend();
});

Socket.on('results', function(data){
    posts = [];
    console.log("Search Results from server:")
    console.log(data);
    for(var i in data){
        console.log("Post:");
        console.log(data[i]);
        posts[posts.length]=data[i];
    }
    rend();
});
