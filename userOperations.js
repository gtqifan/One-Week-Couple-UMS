const sql = require("mssql");
const sqlConfig = require("./sqlConfig");

async function addUser(userName, pwd) {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringCheck = `SELECT * FROM Accounts WHERE userName = '${userName}'`; // check if the username is used
        request.query(stringCheck, (err, response) => {
            if(err) {
                console.log(err);
            }
            if(response.rowsAffected[0] === 0) { // check username and count the number of queries in the database
                const stringRequest = `INSERT INTO Accounts (userName, pwd) VALUES ('${userName}', '${pwd}')`;
                request.query(stringRequest, (err, response) => {
                    if(err) {
                        console.log(err);
                    }
                });
                return('success'); // return success if the new user is added to the database
            } else {
                return('fail');
            }
        });
    });
}

module.exports = {
    addUser : addUser
}