const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
app.use(bodyParser.json());

const sqlConfig = {
    user: 'foo',
    password: 'foo', //TODO: need to be changed here
    server: 'localhost',
    database: 'Users',
    options: {
        encrypt: false
    }
};

const server = app.listen(5000, () => {
    const port = server.address().port;

    console.log("app is listening at port %s", port);
});

app.get("/", (req, res) => {
    sql.connect(sqlConfig, () => {
        res.send("Connection established");
    });
});

app.get("/users", (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        request.query('SELECT * FROM Account', (err, recordset) => {
            if(err) console.log(err);
            res.send(JSON.stringify(recordset));
        });
    });
});

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