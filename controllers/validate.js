'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
// const clientModel = require('../models/m_client.model');
// const roleModel = require('../models/m_role.model');


const ValController = {
    CheckClient : (req, res, next) => {
        var nama_client = req.params.nama_client;
        console.log(req.params.nama_client);

        if(nama_client == null)
        {
            Response.send(res, 200, 'not exist');
        }
        else
        {
            global.dbo.collection('m_client').findOne({nama_client : nama_client}, (err, data)=>{
                if(data)
                {
                    console.log(data.nama_client);

                        let doc = {
                            message : "existing",
                            content : {'_id' : ObjectID(data.id), nama_client : data.nama_client}
                        }
                        Response.send(res, 200, doc);
                }
                else
                {
                Response.send(res, 200, 'not exist');
                }
            })
        }
    },
    CheckRole : (req, res, next) => {
        var role = req.params.role;
        console.log(req.params.role);

        if(role == null)
        {
            Response.send(res, 200, 'not exist');
        }
        else
        {
            global.dbo.collection('m_role').findOne({role : role}, (err, data)=>{
                if(data)
                {
                    console.log(data.role);

                        let doc = {
                            message : "existing",
                            content : {'_id' : ObjectID(data._id), role : data.role}
                        }
                        Response.send(res, 200, doc);
                }
                else
                {
                Response.send(res, 200, 'not exist');
                }
            })
        }
    },
}
module.exports = ValController;
