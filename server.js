const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
app.use(bodyParser.json());

// This is the basic authentication for MSSQL database
const sqlConfig = {
    user: 'foo',
    password: 'foo', //TODO: need to be changed here
    server: 'localhost',
    database: 'Users',
    options: {
        encrypt: false
    }
};

// The server runs on port 5000. Can be accessed with 'localhost:5000'
const server = app.listen(5000, () => {
    const port = server.address().port;

    console.log("app is listening at port %s", port);
});

// The method for connection check. Will be implemented so that an index page will be returned.
app.get("/", (req, res) => {
    sql.connect(sqlConfig, () => {
        res.send("Connection established");
    });
});

// RESTful API interface for retrieving all username and password on the server. Will be modified so that it will
// only return a boolean indicating the correctness of account info.
app.get("/users", (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        request.query('SELECT * FROM Account', (err, recordset) => {
            if(err) console.log(err);
            res.send(JSON.stringify(recordset));
        });
    });
});

// RESTful API interface for retrieving one user account info with the unique uid.
app.get('/users/:uid/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = 'SELECT * FROM Account WHERE uid = ' + req.params.uid;
        request.query(stringRequest, function(err, recordset) {
            if(err) console.log(err);
            res.send(JSON.stringify(recordset)); // Result in JSON format
        });
    });
});

// RESTful API for adding new users.
// app.post("/users/add", (req, res) => {
//     const userName = req.body.userName;
//     const pwd = req.body.pwd;
//     const request = new sql.Request();
//     request.query(`INSERT Account (userName, pwd) VALUES (${userName}, ${pwd})`, (err, res) => {
//         if(err) {
//             console.log(err);
//         }
//     });
// });