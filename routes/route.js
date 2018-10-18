'use strict';

module.exports = exports = function(server){
// Import Logger Module
var winston = require('../config/winston');
var morgan = require('morgan');

var client = require('../controllers/m_client');
var role = require('../controllers/m_role');
var user = require('../controllers/m_user');
var goldarah = require('../controllers/m_goldarah');
var pendonor = require('../controllers/t_pendonor');
var middleware = require('../middleware/checktoken');
var validate = require('../controllers/validate');


    //CORS
    var corsMiddleware = require('restify-cors-middleware');
    var cors = corsMiddleware({
        origins : ['*'],
        allowHeaders : ['authorization']
    });

    server.pre(cors.preflight);
    server.use(cors.actual);

    // Client Route
    server.get('/api/client/', middleware.checkToken, client.GetAll);
    server.get('/api/client/:id', middleware.checkToken, client.GetDetailByID);
    server.post('/api/client/', middleware.checkToken, client.CreateHandler);
    server.put('/api/client/:id', middleware.checkToken, client.UpdateHandler);
    server.del('/api/client/:id', middleware.checkToken, client.DeleteHandler);

    //Role Route
    server.get('/api/role/', role.GetAll);
    server.get('/api/role/:id', role.GetDetailByID);
    server.post('/api/role/', middleware.checkToken, role.CreateHandler);
    server.put('/api/role/:id', middleware.checkToken, role.UpdateHandler);
    server.del('/api/role/:id', middleware.checkToken, role.DeleteHandler);

    //Golongan Darah Route
    server.get('/api/goldarah/', goldarah.GetAll);
    server.get('/api/goldarah/:id', goldarah.GetDetailByID);
    server.post('/api/goldarah/', middleware.checkToken, goldarah.CreateHandler);
    server.put('/api/goldarah/:id', middleware.checkToken, goldarah.UpdateHandler);
    server.del('/api/goldarah/:id', middleware.checkToken, goldarah.DeleteHandler);

    //User Route
    server.post('/api/user/login', user.Login);
    server.get('/api/user/logout', middleware.checkToken, user.Logout);
    server.post('/api/user/', middleware.checkTokenAndRole, user.CreateHandler);
    server.get('/api/user/', middleware.checkToken, user.GetAll);
    server.get('/api/user/:id', middleware.checkToken, user.GetDetailByID);
    server.put('/api/user/:id', middleware.checkToken, user.UpdateHandler);
    server.del('/api/user/:id', middleware.checkToken, user.DeleteHandler);

    //Pendonor Route
    server.get('/api/pendonor/', middleware.checkToken, pendonor.GetAll);
    server.get('/api/pendonor/:id', middleware.checkToken, pendonor.GetDetailByID);
    server.post('/api/pendonor/', middleware.checkTokenAndRole, pendonor.CreateHandler);
    server.put('/api/pendonor/:id', middleware.checkToken, pendonor.UpdateHandler);
    server.del('/api/pendonor/:id', middleware.checkToken, pendonor.DeleteHandler);

    //Validate Route
    server.get('/api/validate/checkclient/:nama_client', validate.CheckClient);
    server.get('/api/validate/checkrole/:role', validate.CheckRole);


    // error handler
    server.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        if (err.name === 'UnauthorizedError') {
            res.status(401).json({ status: 0, code: 401, type: "unauthorised", message: err.name + ": " + err.message });
        } else {
            res.status(404).json({ status: 0, code: 404, type: "ENOENT", message: "file not found" });
        }

        res.status(err.status || 500);
        res.render('error');
    });

    server.use(morgan('combined', { stream: winston.stream }));
}