'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
var now = new Date();

const golonganController = {
    GetAll : (req, res, next) => {

        global.dbo.collection('m_goldarah').find({status : false}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            Response.send(res, 200, data);
        });
    },
    GetDetailByID : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('m_goldarah').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            Response.send(res, 200, data);
        });
    },
    CreateHandler : (req, res, next) => {
        let reqdata = req.body;

        let model = {
            "golongan" : reqdata.golongan,
            "created_date" : now,
            "created_by" : global.user.username,
            "updated_date" : null,
            "updated_by" : null,
            "status" : false
        };

        global.dbo.collection('m_goldarah').insertOne(model, function(err, data){
            if(err)
            {
                return next(new Error());
            }

            Response.send(res, 200, data);
        });
    },
    UpdateHandler : (req, res, next) => {
        let id = req.params.id;
        let reqdata = req.body;

        let model = {
            "golongan" : reqdata.golongan,
            "updated_date" : now,
            "updated_by" : global.user.username
        };

        global.dbo.collection('m_goldarah').findOneAndUpdate
        (
            {'_id' : ObjectID(id)},
            {$set: model},
            function(err, data){
                if(err)
                {
                    return next(new Error());
                }

                Response.send(res, 200, data);
            }
        );
    },
    DeleteHandler : (req, res, next) => {
        let id = req.params.id;

        let model = {
            "status" : true,
            "updated_date" : now,
            "updated_by" : global.user.username
        };

        global.dbo.collection('m_goldarah').findOneAndUpdate
        (
            {'_id' : ObjectID(id)},
            {$set: model},
            function(err, data){
                if(err)
                {
                    return next(new Error());
                }

                Response.send(res, 200, data);
            }
        );
    }
};

module.exports = golonganController;