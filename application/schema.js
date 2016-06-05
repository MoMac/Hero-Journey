var sUtil = require('./SQLUtils.js');

exports.setDBHandlers = function (socket, connection) {

    socket.on('getQuests', function (data) {
        //TBC
        var statement = "SELECT * FROM QUESTS";   
        var select = sUtil.Select(statement, connection, function (err, data) {
            if(data.length > 0) {
                socket.emit('questsFound', data);
            }
            else {
                console.error("No Data found in table Quests");
            }
        }); 
        
    });
};