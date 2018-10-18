'use strict';

// Import Restify Module
const restify = require('restify');

// Import Logger Module
var winston = require('./config/winston');
var moment = require('moment');
const DB = require('./config/db');

// Global Configuration
global.config = require('./config/app');

DB.connect((err, db) => {
    if (err != null) 
    {
        console.log(err);
        winston.error(err);
        process.exit();
    }
    else
    {
        // Create Server with Restify
        const server = restify.createServer(
            {
                name : "Donor Darah API",
                version : "1.0.0"
            }
        );

        console.log('[DATABASE] connected');
        winston.info('[DATABASE]' + config.dbconn +  ' connected');

        global.dbo = DB.getconnection();

        // Body Parser to parse form body with http method POST
        server.use(restify.plugins.bodyParser());

        //Call Route
        require('./routes/route')(server);

        // Default route
        server.get('/', restify.plugins.serveStatic(
            {
                directory : __dirname,
                default : "/index.html"
            }
        ));

        server.listen(config.port, function(){
            console.log("%s memanggil host %s pada tanggal %s", server.name, server.url, moment().format('DD/MM/YYYY, hh:mm:ss a'));
            winston.info(server.name + " memanggil host " +  server.url + " pada tanggal " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        });
    }
});