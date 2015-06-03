// server.js

// set up ======================================================================
// get all the tools we need
//var $ = require('jquery'),
//    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;



var path = require('path'),
    fs = require('fs');
var express  = require('express');
//var app      = express();
var port     = process.env.PORT || 6969;
var mongoose = require('mongodb');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static(path.join(__dirname, 'public')));//Recursos necessaris tals com imatges, css, js etc

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

////////////////////////////////////////////////////////////////////////////////
///MULTIPLAYER EVENTS, ESCOLTANT LES PETICIONS////
////////////////////////////////////////////////////////////////////////////////
var clients = 0;
var vegades_comensa = 0;
var players = new Array();
var planeta;

var nsp = io.of('/lanmode');
nsp.on('connection', function (socket) {
    clients++;
    if(clients==1){
        nsp.emit('news',clients);
        //socket.emit('esperar');
    }
    if(clients==2){
        nsp.emit('seleccio_escenari');
    }
    if(clients>=3){
        socket.emit('joc_ple');
    }
    socket.on('get_noms_finals',function(nom){
        //socket.emit('alert',nom.nom);
        players.push(nom.nom);
         if(players.length == 2){
            nsp.emit('load_bg',planeta,{primer:players[0],segon:players[1]});
        }
    });

    socket.on('seleccio_feta',function(data){
        //players.push[data.nom];
        //socket.emit('alert',data.escenari+" "+data.nom+"playerslenght: "+players.length);


        nsp.emit('get_noms');

       planeta = data.escenari; 
        //socket.emit('alert',players.length);

    });

    socket.on('comensar_ple',function(){
        vegades_comensa++;
        if(vegades_comensa==2){
            nsp.emit('torn_aleatori');
        }
    });
    /**socket.on('my other event', function (data) {
        console.log(data);
    });*/
    socket.on('disconnect', function (socket) {
        clients--;
        nsp.emit('news',clients);

    });
});



// launch ======================================================================
http.listen(port);
console.log('Visiteu la ip corresponent amb port ' + port +' per a visualitzar el projecte');

