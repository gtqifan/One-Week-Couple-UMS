const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
// const cors = require('cors');
const sqlConfig = require('./sqlConfig');
const userOps = require('./userOperations');

const app = express();
app.use(bodyParser.json())
// app.use(cors()); // Fix the error of additional header caused the server to throw CORS exceptions

// Setup return header
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, cache-control, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

// The server runs on port 5000. Can be accessed with 'localhost:5000'
const server = app.listen(5000, () => {
    const port = server.address().port;

    console.log('app is listening at port %s', port);
});

// The method for connection check. Will be implemented so that an index page will be returned.
app.get('/', (req, res) => {
    sql.connect(sqlConfig, () => {
        res.send('Connection established');
    });
});

// // This section is for user account operations
// // RESTful API for adding new users.
// app.post('/users/add', (req, res) => {
//     const userName = req.body.userName;
//     const pwd = req.body.pwd;
//
//     userOps.addUser(userName, pwd).then(result => {
//         res.send(result);
//     });
// });
//
// // RESTful API for login and verification.
// app.post('/users/verify', (req, res) => {
//     const userName = req.body.userName;
//     const pwd = req.body.pwd;
//     sql.connect(sqlConfig, () => {
//         const request = new sql.Request();
//         const stringCheck = `SELECT * FROM Accounts WHERE userName = '${userName}'`; // retrieve the pwd info
//         request.query(stringCheck, (err, response) => {
//             if(err) {
//                 console.log(err);
//             }
//             // check if username exists in the database and then the password matches
//             if(response.rowsAffected[0] === 1 && response.recordsets[0][0].pwd === pwd) {
//                 if(response.recordsets)
//                 res.send('success'); // return success if the new user is added to the database
//             } else {
//                 res.send('fail');
//             }
//         });
//     });
// });
//
// // RESTful API for login and verification.
// app.post('/users/update', (req, res) => {
//     const userName = req.body.userName;
//     const pwd = req.body.pwd;
//     const newPwd = req.body.newPwd;
//     sql.connect(sqlConfig, () => {
//         const request = new sql.Request();
//         const stringCheck = `SELECT * FROM Accounts WHERE userName = '${userName}'`; // retrieve the pwd info
//         request.query(stringCheck, (err, response) => {
//             if(err) {
//                 console.log(err);
//             }
//             // check if username exists in the database and then the password matches
//             if(response.rowsAffected[0] === 1 && response.recordsets[0][0].pwd === pwd) {
//                 const stringUpdate = `UPDATE Accounts SET pwd = '${newPwd}' WHERE userName = '${userName}'`;
//                 request.query(stringUpdate, (err, response) => {
//                     if(err) {
//                         console.log(err);
//                     }
//                 });
//                 res.send('success');
//             } else {
//                 res.send('fail');
//             }
//         });
//     });
// });
//
// // RESTful API interface for retrieving all username and password on the server. Will be modified so that it will
// // only return a boolean indicating the correctness of account info.
// // TODO: remove this function because this is only for testing
// app.get('/users', (req, res) => {
//     sql.connect(sqlConfig, () => {
//         const request = new sql.Request();
//         request.query('SELECT * FROM Accounts', (err, recordset) => {
//             if(err) {
//                 console.log(err);
//             }
//             res.send(JSON.stringify(recordset.recordset));
//         });
//     });
// });
//
// // RESTful API interface for retrieving one user account info with the unique uid.
// // TODO: remove this function because this is only for testing
// app.get('/users/:uid/', (req, res) => {
//     sql.connect(sqlConfig, () => {
//         const request = new sql.Request();
//         const stringRequest = `SELECT * FROM Accounts WHERE uid = ${req.params.uid}`;
//         request.query(stringRequest, function(err, recordset) {
//             if(err) {
//                 console.log(err);
//             }
//             res.send(JSON.stringify(recordset.recordset)); // Result in JSON format
//         });
//     });
// });
//
// // RESTful API interface for retrieving CP uid that get paired.
// app.get('/users/:uid/cp/:index/', (req, res) => {
//     sql.connect(sqlConfig, () => {
//         const request = new sql.Request();
//         const stringRequest = `SELECT CP_${req.params.index} FROM
//                 (SELECT * FROM Accounts WHERE uid = '${req.params.uid}') AS result`;
//         request.query(stringRequest, function (err, recordset) {
//             if (err) {
//                 console.log(err);
//             }
//             res.send(JSON.stringify(recordset.recordset)); // Result in JSON format
//         });
//     });
// });
//
// // RESTful API for modifying CP uid that get paired.
// app.post('/users/:uid/cp/:index/', (req, res) => {
//     sql.connect(sqlConfig, () => {
//         const request = new sql.Request();
//         const stringUpdate = `UPDATE Accounts SET CP_${req.params.index} = '${req.body.userName}'
//                                 WHERE uid = '${req.params.uid}'`;
//         request.query(stringUpdate, (err, response) => {
//             if(err) {
//                 console.log(err);
//                 res.send('fail');
//             } else {
//                 res.send('success');
//             }
//         });
//     });
// });

// This section is for user profile operations
// RESTful API for adding new user profile.
// TODO: code needs to be refined here
app.post('/profile/add', (req, res) => {
    const userName = req.body.userName;
    const image = req.body.image;
    const name = req.body.name;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const height = req.body.height;
    const weight = req.body.weight;
    const location = req.body.location;
    const school = req.body.school;
    const grade = req.body.grade;
    const major = req.body.major;
    const personality = req.body.personality;
    const hobby = req.body.hobby;
    const wechatID = req.body.wechatID;
    const hobbyDescription = req.body.hobbyDescription;
    const selfDescription = req.body.selfDescription;
    const CP_gender = req.body.CP_gender;
    const CP_age_min = req.body.CP_age_min;
    const CP_age_max = req.body.CP_age_max;
    const CP_height_min = req.body.CP_height_min;
    const CP_height_max = req.body.CP_height_max;
    const CP_weight_min = req.body.CP_weight_min;
    const CP_weight_max = req.body.CP_weight_max;
    const CP_hobby = req.body.CP_hobby;
    const CP_personality = req.body.CP_personality;
    const topMatches = req.body.topMatches;
    const CP = req.body.CP;
    const email = req.body.email;

    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringCheck = `SELECT * FROM Profile WHERE email = '${email}'`; // retrieve the pwd info
        request.query(stringCheck, (err, response) => {
            if(err) {
                console.log(err);
            }
            // check if username exists in the database and then the password matches
            if(response.rowsAffected[0] === 0) {
                const stringRequest = `INSERT INTO Profile (image, name, gender, birthday, height, weight, 
                location, school, grade, major, personality, hobby, wechatID, hobbyDescription, selfDescription, 
                CP_gender, CP_age_min, CP_age_max, CP_height_min,
                CP_height_max, CP_weight_min, CP_weight_max, CP_hobby, CP_personality, topMatches, CP, email) VALUES (
                '${image}', '${name}', '${gender}', '${birthday}', '${height}', '${weight}', '${location}', 
                '${school}', '${grade}', '${major}', '${personality}', '${hobby}', '${wechatID}', '${hobbyDescription}','${selfDescription}', 
                '${CP_gender}', '${CP_age_min}', '${CP_age_max}', '${CP_height_min}', '${CP_height_max}', '${CP_weight_min}',
                 '${CP_weight_max}', '${CP_hobby}', '${CP_personality}', '${topMatches}', '${CP}', '${email}')`;
                console.log(stringRequest);
                request.query(stringRequest, (err, response) => {
                    if (err) {
                        console.log(err);
                        res.send('fail');
                    } else {
                        res.send('success'); // return success if the new user is added to the database
                    }
                });
            } else {
                res.send('fail');
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

// RESTful API interface for retrieving one user profile info with the unique email.
app.post('/profile/allInfo/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT * FROM Profile WHERE email = '${req.body.email}'`;
        request.query(stringRequest, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset)); // Result in JSON format
        });
    });
});

// RESTful API interface for retrieving one user profile info with the unique email.
app.post('/profile/category/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT ${req.body.category} FROM 
                (SELECT * FROM Profile WHERE email = '${req.body.email}') AS result`;
        request.query(stringRequest, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset)); // Result in JSON format
        });
    });
});


// RESTful API interface for checking if an email address has been registered with the unique email.
app.post('/profile/verify/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT * FROM Profile WHERE email = '${req.body.email}'`;
        request.query(stringRequest, function (err, response) {
            if (err) {
                console.log(err);
            }

            // check if username exists in the database and then the password matches
            if(response.rowsAffected[0] === 1) {
                if(response.recordsets)
                res.send('exist'); // return success if the new user is added to the database
            } else {
                res.send('not-exist');
            }
        });
    });
});

app.get('/profile/update', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `UPDATE Profile SET ${req.body.category} = '${req.body.value}'
            where email = '${req.body.email}'`;
        request.query(stringRequest, function (err, response) {
            if (err) {
                console.log(err);
            }
            if(response.rowsAffected[0] === 0) {
                res.send('fail');
            } else {
                res.send('success');
            }
        });
    });
});

// RESTful API interface for retrieving all message on the server.
// TODO: remove this function because this is only for testing
app.get('/message', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        request.query('SELECT * FROM Message', (err, recordset) => {
            if (err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset));
        });
    });
});