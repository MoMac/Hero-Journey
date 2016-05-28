/**
    *****SQLUtils****
    Utils for connection, selects, inserts
    Database connection params:
        host: localhost
        user: root
        password: admin
        multipleStatements : true 
        
**/
exports.SQLConnect = function () {
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'admin',
      multipleStatements: true,
    });

    connection.connect(function(err) {
	
    });

    /**
        Read SQL File and run if connection is created
    */
    // fs = require('fs')
    // fs.readFile('./DB_TBL_ALL.sql', 'utf8', function (err,data) {
    // if (err) {
    //     return console.log(err);
    // }
    // connection.query(data, function (err, result) {
    //     if(err)
    //         throw err;
    //     });
    // });
    

    return connection;
    
    
}
/**
    Select Statements
**/
exports.Select= function (statement, connection, callback) {
    console.log("Statement" + statement);
    var resultState;
    console.log("Connection" + connection);
    var query = connection.query(statement, null, function (err, result) {
        if(err) {
               callback(err, null);
               console.error("error " +  err);
          }
        else {
            console.log("callback TRUE");
             callback(null, result);
        }
     });  
}
/**
    Insert Statements
**/
exports.Insert = function (statement, connection, callback) {
    var insert = connection.query(statement, null, function (err, result) {
         if(err) {
               callback(err, null);
               console.error("error " +  err);
          }
        else {
            console.log("callback TRUE" + result);
            callback(null, result);
        }
        });
}