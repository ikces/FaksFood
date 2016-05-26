#!/bin/env node
//  OpenShift sample Node application
var path = "/Users/VidSecki/School/FERI/Mag_1_letnik/ST/projekt/OpenShift/faksfood2/";
var express = require('express'),
        fs      = require('fs'), 
        app = express(),
        ipaddress = 'localhoste';
        port      =  8080;

var db = require(path + 'db.js');
db.createDB();


var index = require(path + 'routes/index');
var restavracije = require(path + 'routes/restavracije');
var meniji = require(path + 'routes/meniji');
var uporabniki = require(path + 'routes/uporabniki');
var ocene = require(path + 'routes/ocene');
var komentarji = require(path + 'routes/komentarji');

app.use('/', index);
app.use('/restavracije', restavracije);
app.use('/meniji', meniji);
app.use('/uporabniki', uporabniki);
app.use('/ocene', ocene);
app.use('/komentarji', komentarji);

app.listen (port);
console.log("dela ");
