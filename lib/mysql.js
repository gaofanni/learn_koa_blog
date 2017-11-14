const mysql = require('mysql')
const config = require('../config/default')

const pool = mysql.createPool({
    host:config.database.HOST,
    user:config.database.USERNAME,
    password:config.database.PASSWORD,
    database:config.database.DATABASE
})
//查询
let query = function(sql,values){
    return new Promise((resolve,reject)=>{
        pool.getConnection(function(err,connection){
            if(err){
                resolve(err)
            }else{
                connection.query(sql,values,(err,rows)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}
//创建表,sql定义
users=
`
    create table if not exists users(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        pass VARCHAR(40) NOT NULL,
        PRIMARY KEY(id)
    )
`

posts=
`
    create table if not exists posts(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        title VARCHAR(40) NOT NULL,
        content VARCHAR(40) NOT NULL,
        uid VARCHAR(40) NOT NULL,
        moment VARCHAR(40) NOT NULL,
        comments VARCHAR(40) NOT NULL DEFAULT '0',
        pv VARCHAR(40) NOT NULL DEFAULT '0',
        PRIMARY KEY(id)
    )
`

comment=
`
    create table if not exists comment(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        content VARCHAR(40) NOT NULL,
        postid VARCHAR(40) NOT NULL,
        PRIMARY KEY(id)
    )
`

let createTable = function(sql){
    return query(sql,[])
}

//建表
createTable(users)
createTable(posts)
createTable(comment)

module.exports={
    query,
    createTable
}