var sUtil = require('./SQLUtils.js');

exports.getQuests = function (socket, connection) {

    socket.on('getQuests', function (data) {
       
        var statement = "SELECT * FROM QUESTS";   
         var select = sUtil.Select(statement, connection, function (err, data) {
            if(err) {
                console.log("ERROR" + err);
            }
            else {
                 if(data.length > 0) {
                     socket.emit('questsFound', data);
                 }
                 else {
                     console.error("No Data found in table Quests");
                 }
            }
         }); 
        
    });
};