'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');
const userModel = require('../models/m_user.model');
var now = new Date();


//JSON Web Tokens
const jwt = require('jsonwebtoken');
const secret = require('../config/token');

const UserController = {
    Login : (req, res, next) => {
        var usernm = req.body.username;
        var password = req.body.password;

        if(usernm == null || password == null)
        {
            Response.send(res, 404, 'User tidak ditemukan');
        }
        else
        {
            global.dbo.collection('m_user').findOne({username : usernm}, (err, data)=>{
                if(data)
                {
                    console.log(data.username);
                    console.log(data.password);
                    console.log(data)

                    if(bcrypt.compareSync(password, data.password))
                    {
                        global.dbo.collection('m_role').findOne({'_id' : ObjectID(data.id_role)}, (err, role)=>{   
                        if(role)
                        {
                            data.rolename = role.role;


                            //Generate JWT Tokens
                            let token = jwt.sign(data, secret.secretkey,{
                                expiresIn: 86400    //akan expired dalam waktu 24 jam
                            });
                            delete data.password;
                            let doc = {
                                userdata : data,
                                token : token
                            }

                            Response.send(res, 200, doc);
                        }
                        else
                        {
                            Response.send(res, 404, 'Role tidak ditemukan');  
                        }
                    });
                }
                        else
                        {
                            Response.send(res, 404, 'Password yang Anda inputkan SALAH');
                        }
                    }
                    else
                    {
                    Response.send(res, 404, 'User tidak ditemukan');
                    }
            });
        }
    },
    Logout : (req, res, next) => {
        let doc = {
            status : "Logout Berhasil",
            userdata : null,
            token : null
    };
        Response.send(res, 200, doc);
    },
    CreateHandler : (req, res, next) => {
        let body = req.body;
        var data = {};

        data.nama_lengkap = body.nama_lengkap;
        data.email = body.email;
        data.username = body.username;
        data.password = bcrypt.hashSync(body.password, 8);
        data.id_role = ObjectID(body.id_role);
        data.created_date = now;
        data.created_by = global.user.username;
        data.updated_date = null;
        data.updated_by = null;
        data.status = false;

        var model = new userModel(data);

        global.dbo.collection('m_user').insertOne(model, function(err, data){
            if(err)
            {
                return next(new Error());
            }

            Response.send(res, 200, data);
        });
    },
    GetAll : (req, res, next) => {

        global.dbo.collection('m_user').find({status : false}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            Response.send(res, 200, data);
        });
    },
    GetDetailByID : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('m_user').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
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
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('m_user').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new userModel(entity);
            });

            updatemodel._id = ObjectID(id);

            if(reqdata.nama_lengkap == null || reqdata.nama_lengkap == undefined || reqdata.nama_lengkap == "")
            {
                updatemodel.nama_lengkap = oldmodel[0].nama_lengkap;
            }
            else
            {
                updatemodel.nama_lengkap = reqdata.nama_lengkap;
            }

            if(reqdata.email == null || reqdata.email == undefined || reqdata.email == "")
            {
                updatemodel.email = oldmodel[0].email;
            }
            else
            {
                updatemodel.email = reqdata.email;
            }

            if(reqdata.username == null || reqdata.username == undefined || reqdata.username == "")
            {
                updatemodel.username = oldmodel[0].username;
            }
            else
            {
                updatemodel.username = reqdata.username;
            }

            if(reqdata.password == null || reqdata.password == undefined || reqdata.password == "")
            {
                updatemodel.password = oldmodel[0].password;
            }
            else
            {
                updatemodel.password = bcrypt.hashSync(reqdata.password, 8);
            }

            updatemodel.id_role = ObjectID(reqdata.id_role);
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.updated_by = now;
            updatemodel.updated_by = global.user.username;
            updatemodel.status = false;

            var model = new userModel(updatemodel);

            global.dbo.collection('m_user').findOneAndUpdate
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
        });
    },
    DeleteHandler : (req, res, next) => {
        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('m_user').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new userModel(entity);
            });

            deletemodel._id = ObjectID(id);
            deletemodel.nama_lengkap = oldmodel[0].nama_lengkap;
            deletemodel.email = oldmodel[0].email;
            deletemodel.username = oldmodel[0].username;
            deletemodel.password = oldmodel[0].password;
            deletemodel.id_role = ObjectID(oldmodel[0].id_role);
            deletemodel.created_date = oldmodel[0].created_date;
            deletemodel.created_by = oldmodel[0].created_by;
            deletemodel.updated_by = now;
            deletemodel.updated_by = global.user.username;
            deletemodel.status = true;

            var model = new userModel(deletemodel);

            global.dbo.collection('m_user').findOneAndUpdate
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
        });
    }
       
};

module.exports = UserController