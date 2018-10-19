'use strict';

const Response = require('../config/response')
const ObjectID = require('mongodb').ObjectID;
const menuModel = require('../models/m_menu.model');
const roleModel = require('../models/m_role.model');

const valRoleMenu = {
    checkMenuRole : (req, res, next) => {
        var idrole = global.user.ID_Role;

        // if(nama_client == null){
        //     Response.send(res, 403, "You are not authorized");
        // }else{
            global.dbo.collection('m_role').aggregate([
                {
                    $lookup : 
                    {
                        from : "m_menu_access",
                        localField : "_id",
                        foreignField : "id_role",
                        as : "role_menu_access"
                    }
                },
                {
                    $unwind : "$role_menu_access"
                },
                {
                    $lookup : 
                    {
                        from : "m_menu",
                        localField : "role_menu_access.id_menu",
                        foreignField : "_id",
                        as : "menu_menu_access"
                    }
                },
                {
                    $unwind : "$menu_menu_access"
                },
                {
                    $match: {_id : ObjectID(idrole)}
                },
                {
                    $project : {
                        id_role : "$_id",
                        role : "$role",
                        id_menu : "$menu_menu_access._id",
                        menu : "$menu_menu_access.menu_name"
                    } 	
                },
                
            ]).toArray((error, data) => {
                if(data){
                    // let doc = {
                    //     message : "existing",
                    //     content : { "_id" : ObjectID(data._id), "nama" : data.nama_client }
                    // };
                    let result = data;
                    Response.send(res, 200, data);
                    next();
                    console.log(data);
                }
                else{
                    Response.send(res, 200, "role not exist");
                }
            });
        }
};
                

module.exports = valRoleMenu;