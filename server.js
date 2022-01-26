const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const sqlConfig = require('./sqlConfig');

const app = express();
app.use(bodyParser.json());

// The server runs on port 5000. Can be accessed with 'localhost:5000'
const server = app.listen(5000, () => {
    const port = server.address().port;

    console.log("app is listening at port %s", port);
});

// The method for connection check. Will be implemented so that an index page will be returned.
app.get('/', (req, res) => {
    sql.connect(sqlConfig, () => {
        res.send("Connection established");
    });
});

// This section is for user account operations
// RESTful API for adding new users.
app.post('/users/add', (req, res) => {
    const userName = req.body.userName;
    const pwd = req.body.pwd;
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
                res.send('success'); // return success if the new user is added to the database
            } else {
                res.send('fail');
            }
        });
    });
});

// RESTful API for login and verification.
app.post('/users/verify', (req, res) => {
    const userName = req.body.userName;
    const pwd = req.body.pwd;
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringCheck = `SELECT * FROM Accounts WHERE userName = '${userName}'`; // retrieve the pwd info
        request.query(stringCheck, (err, response) => {
            if(err) {
                console.log(err);
            }
            // check if username exists in the database and then the password matches
            if(response.rowsAffected[0] === 1 && response.recordsets[0][0].pwd === pwd) {
                if(response.recordsets)
                res.send('success'); // return success if the new user is added to the database
            } else {
                res.send('fail');
            }
        });
    });
});

// RESTful API for login and verification.
app.post('/users/update', (req, res) => {
    const userName = req.body.userName;
    const pwd = req.body.pwd;
    const newPwd = req.body.newPwd;
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringCheck = `SELECT * FROM Accounts WHERE userName = '${userName}'`; // retrieve the pwd info
        request.query(stringCheck, (err, response) => {
            if(err) {
                console.log(err);
            }
            // check if username exists in the database and then the password matches
            if(response.rowsAffected[0] === 1 && response.recordsets[0][0].pwd === pwd) {
                const stringUpdate = `INSERT INTO Accounts (userName, pwd) VALUES ('${userName}', '${newPwd}')`;
                request.query(stringUpdate, (err, response) => {
                    if(err) {
                        console.log(err);
                    }
                });
                res.send('success');
            } else {
                res.send('fail');
            }
        });
    });
});

// RESTful API interface for retrieving all username and password on the server. Will be modified so that it will
// only return a boolean indicating the correctness of account info.
// TODO: remove this function because this is only for testing
app.get('/users', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        request.query('SELECT * FROM Accounts', (err, recordset) => {
            if(err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset));
        });
    });
});

// RESTful API interface for retrieving one user account info with the unique uid.
app.get('/users/:uid/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT * FROM Accounts WHERE uid = ${req.params.uid}`;
        request.query(stringRequest, function(err, recordset) {
            if(err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset)); // Result in JSON format
        });
    });
});

// This section is for user profile operations

// RESTful API for adding new user profile.
// TODO: code needs to be refined here
app.post('/profile/add', (req, res) => {
    const userName = req.body.userName;
    const image = req.body.image;
    const name = req.body.name;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const age = req.body.age;
    const height = req.body.height;
    const weight = req.body.weight;
    const location = req.body.location;
    const school = req.body.school;
    const grade = req.body.grade;
    const major = req.body.major;
    const personality = req.body.personality;
    const hobby = req.body.hobby;
    const wechatID = req.body.wechatID;
    const selfDescription = req.body.selfDescription;
    const CP_gender = req.body.CP_gender;
    const CP_age = req.body.CP_age;
    const CP_height = req.body.CP_height;
    const CP_weight = req.body.CP_weight;
    const CP_hobby = req.body.CP_hobby;
    const CP_personality = req.body.CP_personality;
    const CP_major = req.body.CP_major;
    const CP_location = req.body.CP_location;

    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `INSERT INTO Profile (userName, image, name, gender, birthday, age, height, weight, 
                location, school, grade, major, personality, hobby, wechatID, selfDescription, CP_gender, CP_age,
                CP_height, CP_weight, CP_hobby, CP_personality, CP_major, CP_location) VALUES ('${userName}', 
                '${image}', '${name}', '${gender}', '${birthday}', '${age}', '${height}', '${weight}', '${location}', 
                '${school}', '${grade}', '${major}', '${personality}', '${hobby}', '${wechatID}', '${selfDescription}', 
                '${CP_gender}', '${CP_age}', '${CP_height}', '${CP_weight}', '${CP_hobby}', '${CP_personality}',
                '${CP_major}', '${CP_location}')`;
        request.query(stringRequest, (err, response) => {
            if (err) {
                console.log(err);
                res.send('fail');
            } else {
                res.send('success'); // return success if the new user is added to the database
            }
        });
    });
});

// RESTful API interface for retrieving all user profile on the server.
// TODO: remove this function because this is only for testing
app.get('/profile', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        request.query('SELECT * FROM Profile', (err, recordset) => {
            if (err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset));
        });
    });
});

// RESTful API interface for retrieving one user profile info with the unique userName.
app.get('/profile/:userName/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT * FROM Profile WHERE userName = '${req.params.userName}'`;
        request.query(stringRequest, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset)); // Result in JSON format
        });
    });
});

// RESTful API interface for retrieving one user profile info with the unique userName.
app.get('/profile/:userName/:category/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT ${req.params.category} FROM 
                (SELECT * FROM Profile WHERE userName = '${req.params.userName}') AS result`;
        request.query(stringRequest, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset)); // Result in JSON format
        });
    });
});