const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
// const cors = require('cors');
const sqlConfig = require('./sqlConfig');
const userOps = require('./userOperations');
const {parse} = require("mssql/lib/connectionstring");

const app = express();
app.use(bodyParser.json());
// app.use(cors()); // Fix the error of additional header caused the server to throw CORS exceptions

// app.use((req, res,  next) => {
//     if (req.headers["kehan-secret"] === "SECRET_CEKRET") {
//         next();
//     } else {
//         res.status(404).json({
//             error: "unauthorized",
//             message: "You're not 404."
//         })
//     }
// });

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

// This section is for user profile operations
// RESTful API for adding new user profile.
// TODO: code needs to be refined here
app.post('/profile/add', (req, res) => {

    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringCheck = `SELECT * FROM Profile WHERE email = '${req.body.email}'`; // retrieve the pwd info
        request.query(stringCheck, (err, response) => {
            if(err) {
                console.log(err);
            }
            // check if email exists in the database and then the password matches
            if(response.rowsAffected[0] === 0) {
                const stringRequest = `INSERT INTO Profile (image, name, gender, birthday, height, weight, 
                location, grade, major, personality, hobby, wechatID, hobbyDescription, selfDescription, 
                CP_gender, CP_age_min, CP_age_max, CP_height_min, CP_height_max, CP_weight_min, CP_weight_max, 
                CP_hobby, CP_personality, topMatches, email, realEmail) VALUES (
                '${req.body.image}', '${req.body.name}', '${req.body.gender}', '${req.body.birthday}', 
                '${req.body.height}', '${req.body.weight}', '${req.body.location}',  
                '${req.body.grade}', '${req.body.major}', '${req.body.personality}', '${req.body.hobby}', 
                '${req.body.wechatID}', '${req.body.hobbyDescription}','${req.body.selfDescription}', 
                '${req.body.CP_gender}', '${req.body.CP_age_min}', '${req.body.CP_age_max}', 
                '${req.body.CP_height_min}', '${req.body.CP_height_max}', '${req.body.CP_weight_min}',
                '${req.body.CP_weight_max}', '${req.body.CP_hobby}', '${req.body.CP_personality}', 
                '${req.body.topMatches}', '${req.body.email}', '${req.body.realEmail}')`;
                request.query(stringRequest, (err, response) => {
                    if (err) {
                        console.log(err);
                        res.send('fail');
                    }
                    res.send('success');
                    // } else {
                    //     const tokenRequest = `INSERT INTO Token (email, token) VALUES ('${req.body.email}', '${req.body.token}')`;
                    //     request.query(tokenRequest, (err, response) => {
                    //         if(err) {
                    //             console.log(err);
                    //         }
                    //     });
                    //     res.send('success'); // return success if the new user is added to the database
                    // }
                });
            } else {
                const updateRequest = `UPDATE Profile SET image = '${req.body.image}', name = '${req.body.name}', 
                gender = '${req.body.gender}', birthday = '${req.body.birthday}', height = '${req.body.height}', 
                weight = '${req.body.weight}', location = '${req.body.location}',      
                grade = '${req.body.grade}', major = '${req.body.major}', personality = '${req.body.personality}', 
                hobby = '${req.body.hobby}', wechatID = '${req.body.wechatID}', hobbyDescription = '${req.body.hobbyDescription}', 
                selfDescription = '${req.body.selfDescription}', CP_gender = '${req.body.CP_gender}', 
                CP_age_min = '${req.body.CP_age_min}', CP_age_max = '${req.body.CP_age_max}', 
                CP_height_min = '${req.body.CP_height_min}', CP_height_max = '${req.body.CP_height_max}', 
                CP_weight_min = '${req.body.CP_weight_min}',CP_weight_max = '${req.body.CP_weight_max}', 
                CP_hobby = '${req.body.CP_hobby}', CP_personality = '${req.body.CP_personality}', 
                topMatches = '${req.body.topMatches}' WHERE email = '${req.body.email}'`;
                request.query(updateRequest, (err, response) => {
                    if (err) {
                        console.log(err);
                        res.send('fail');
                    } else {
                        res.send('success'); // return success if the new user is added to the database
                    }
                });
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
    if(req.body.category.toLowerCase() === 'token') {
        res.send('fail');
    }
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

            // check if email exists in the database and then the password matches
            if(response.rowsAffected[0] === 1) {
                res.send('exist'); // return success if the new user is added to the database
            } else {
                res.send('not-exist');
            }
        });
    });
});

// RESTful API interface for updating one category of a user's profile.
app.post('/profile/update', (req, res) => {
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

// RESTful API interface for retrieving token with the unique email.
app.post('/profile/secretGetTokenMethod/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT token FROM Token WHERE email = '${req.body.email}'`;
        request.query(stringRequest, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset)); // Result in JSON format
        });
    });
});

// Below are the methods for message table.

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

// This section is for message operations
// RESTful API for adding new message profile.
app.post('/message/add', (req, res) => {
    const sendTo = req.body.sendTo;
    const isGlobal = req.body.isGlobal;
    const data = req.body.data;
    const type = req.body.type;
    const fromEmail = req.body.fromEmail;
    const status = req.body.status;

    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const checkExist = `SELECT * from Task where CP1_email = '${sendTo}' OR CP2_email = '${sendTo}'`;
        request.query(checkExist, (err, response) => {
            if(err) {
                console.log(err);
                res.send('fail');
            } else {
                if (response.rowsAffected[0] === 0) {
                    const stringRequest = `INSERT INTO Message (sendTo, isGlobal, data, type, fromEmail, status) VALUES (
                        '${sendTo}', '${isGlobal}', '${data}', '${type}', '${fromEmail}', '${status}')`;
                    request.query(stringRequest, (err, response) => {
                        if(err) {
                            console.log(err);
                            res.send('fail');
                        } else {
                            res.send('success');
                        }
                    });
                } else {
                    res.send('对方已经配对了哦');
                }
            }
        });
    });
});

// RESTful API interface for retrieving messages for one user with the unique email.
app.post('/message/allMessage/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT fromEmail, data, mid FROM Message WHERE ((sendTo = '${req.body.email}' AND type = 1) OR isGlobal = 1) ORDER BY mid DESC`;
        request.query(stringRequest, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            let resultSet = new Set();
            recordset.recordset.forEach(element => {
                //const elementResult = {"fromEmail": element['fromEmail'], "data": element['data']};
                resultSet.add(element);
            });
            res.send(Array.from(resultSet));
        });
    });
});

// RESTful API interface for retrieving messages for one user with the unique email.
app.post('/message/allInvitation/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT fromEmail FROM Message WHERE (sendTo = '${req.body.email}' AND type = 2 
                AND status = 0)`;
        let resultSet = new Set();
        request.query(stringRequest, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            recordset.recordset.forEach(element => {
                resultSet.add(element['fromEmail']);
            });
            if(resultSet.size === 0) {
                res.send([]);
            }

            // Retrieve profile information from Profile table where the email addresses are in the resultArray
            // We need to return image, gender, grade, major, hobby, personality
            let profileSet = new Set();
            resultSet.forEach(email => {
                const emailRequest = `SELECT name, image, gender, grade, major, hobby, personality, email, 
                    selfDescription, location, hobbyDescription FROM Profile WHERE email = '${email}'`;
                request.query(emailRequest, function (err, recordset) {
                    if (err) {
                        console.log(err);
                    }
                    recordset.recordset.forEach(element => {
                        profileSet.add(element);
                    });
                    // This step ensures that all entries in the resultSet are added to the profile set
                    // TODO: use async function later, but not our priority
                   if (resultSet.size === profileSet.size) {
                       res.send(Array.from(profileSet));
                   }
                });
            });
        });
    });
});

//RESTful API interface for accepting invitation
app.post('/message/invitation/accept', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `UPDATE Message SET status = 1
            where sendTo = '${req.body.sendTo}' and fromEmail = '${req.body.fromEmail}'`;
        request.query(stringRequest, function (err, response) {
            if (err) {
                console.log(err);
            }
            if(response.rowsAffected[0] === 0) {
                res.send('fail');
            } else {
                const checkRequest = `SELECT * FROM Task WHERE CP1_email = '${req.body.fromEmail}' OR CP2_email = '${req.body.fromEmail}'
                    OR CP1_email = '${req.body.sendTo}' OR CP2_email = '${req.body.sendTo}'`;
                request.query(checkRequest, function (err, response2) {
                    if(err) {
                        console.log(err);
                    }
                    if(response2.rowsAffected[0] === 1) {
                        res.send('对方已经配对了喔');
                    } else {
                        const updateRequest = `INSERT INTO Task (CP1_email, CP2_email) VALUES ('${req.body.fromEmail}',
                            '${req.body.sendTo}')`;
                        request.query(updateRequest, function (err, response) {
                            if (err) {
                                console.log(err);
                            }
                            if (response.rowsAffected[0] === 0) {
                                res.send('fail');
                            } else {
                                res.send('success');
                            }
                        });
                    }
                });
            }
        });
    });
});

//RESTful API interface for rejecting invitation
app.post('/message/invitation/reject', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `UPDATE Message SET status = 2
            where sendTo = '${req.body.sendTo}' and fromEmail = '${req.body.fromEmail}'`;
        request.query(stringRequest, function (err, response) {
            if (err) {
                console.log(err);
            }
            if(response.rowsAffected[0] === 0) {
                res.send('fail');
            } else {
                const nameRequest = `SELECT name from Profile where email = '${req.body.sendTo}'`;
                request.query(nameRequest, function (err, recordset) {
                    if (err) {
                        console.log(err);
                    }
                    if(response.rowsAffected[0] === 0) {
                        res.send('fail');
                    } else {
                        //console.log(recordset);
                        const name = recordset.recordset[0]["name"];
                        const updateRequest = `INSERT INTO Message (sendTo, isGlobal, data, type) VALUES (
                            '${req.body.fromEmail}', '0', '您的邀请被${name}拒绝了', '${1}')`;
                        request.query(updateRequest, function (err, response) {
                            if (err) {
                                console.log(err);
                            }
                            if (response.rowsAffected[0] === 0) {
                                res.send('fail');
                            } else {
                                res.send('success');
                            }
                        });
                    }
                }); 
            }
        });
    });
});

// Task section

// RESTful API interface for retrieving all tasks on the server.
// TODO: remove this function because this is only for testing
app.get('/task', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        request.query('SELECT * FROM Task', (err, recordset) => {
            if (err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset));
        });
    });
});

// RESTful API interface for creating a task entry for two users..
app.post('/task/add/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringCheck = `SELECT * FROM Task WHERE CP1_email = '${req.body.CP1_email}' OR CP2_email = '${req.body.CP2_email}'
                OR CP1_email = '${req.body.CP2_email}' OR CP2_email = '${req.body.CP1_email}'`;
        request.query(stringCheck, (err, response) => {
            if(err) {
                console.log(err);
            }
            if(response.rowsAffected[0] === 0) {
                const stringRequest = `INSERT INTO Task (CP1_email, CP2_email) VALUES ('${req.body.email1}', 
                '${req.body.email2}')`;
                request.query(stringRequest, function (err, recordset) {
                    if (err) {
                        console.log(err);
                        res.send('fail');
                    }
                    res.send('success');
                });
            } else {
                res.send('User already paired');
            }
        });
    });
});

// RESTful API interface for retrieving one user's tasks info with the unique email.
app.post('/task/allTask/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT * FROM Task WHERE CP1_email = '${req.body.email}' OR CP2_email = '${req.body.email}'`;
        request.query(stringRequest, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            res.send(JSON.stringify(recordset.recordset)); // Result in JSON format
        });
    });
});

// RESTful API interface for updating a task status to complete.
app.post('/task/complete/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        let stringRequest;
        setTimeout(function() {
            if(parseInt(req.body.taskIndex) === 1 || parseInt(req.body.taskIndex) === 7) {
                const indexRequest = `SELECT CP1_email FROM Task WHERE CP1_email = '${req.body.email}'`;
                request.query(indexRequest, (err, res) => {
                    if(err) {
                        console.log(err);
                    }
                    if(res.rowsAffected[0] === 1) {
                        stringRequest = `UPDATE Task SET T${req.body.taskIndex}_status1 = 1, T${req.body.taskIndex}_content1 = '${req.body.content}' 
                            WHERE CP1_email = '${req.body.email}' OR CP2_email = '${req.body.email}'`;
                    } else {
                        stringRequest = `UPDATE Task SET T${req.body.taskIndex}_status2 = 1, T${req.body.taskIndex}_content2 = '${req.body.content}' 
                            WHERE CP1_email = '${req.body.email}' OR CP2_email = '${req.body.email}'`;
                    }
                });
            } else {
                stringRequest = `UPDATE Task SET T${req.body.taskIndex}_status = 1 
                    WHERE CP1_email = '${req.body.email}' OR CP2_email = '${req.body.email}'`;
            }
        }, 0);
        setTimeout(function() {
            request.query(stringRequest, function (err, recordset) {
                if (err) {
                    console.log(err);
                    res.send('fail');
                }
                res.send('success');
            });
        }, 200);
    });
});

// RESTful API interface for checking if a user has a paired CP.
app.post('/task/lookup/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT * FROM Task WHERE CP1_email = '${req.body.email}' OR CP2_email = '${req.body.email}'`;
        request.query(stringRequest, function (err, response) {
            if (err) {
                console.log(err);
            }

            // check if email exists in the database and then the password matches
            if(response.rowsAffected[0] === 1) {
                if(response.recordsets)
                    res.send('exist'); // return success if the new user is added to the database
            } else {
                res.send('not-exist');
            }
        });
    });
});

app.get('/task/getAllPairedEmail/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT * FROM Task`;
        request.query(stringRequest, function (err, recordset) {
            if (err) {
                console.log(err);
            }
            const resultSet = new Set();
            recordset.recordset.forEach(element => {
                resultSet.add(element.CP1_email);
                resultSet.add(element.CP2_email);
            });
            res.send(Array.from(resultSet));
        });
    });
});

// RESTful API interface for counting finished number.
app.post('/task/count/', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        let stringRequest;
        setTimeout(function() {
            if(parseInt(req.body.taskIndex) === 1 || parseInt(req.body.taskIndex) === 7){
                stringRequest = `SELECT * FROM Task WHERE T${req.body.taskIndex}_status1 = 1`;
            } else {
                stringRequest = `SELECT * FROM Task WHERE T${req.body.taskIndex}_status = 1`;
            }
        }, 0);
        setTimeout(function() {
            request.query(stringRequest, function (err, response) {
                if (err) {
                    console.log(err);
                    res.send('fail');
                }
                // return the number of pairs that completed a specific tasks
                res.send(`{"count":${response.rowsAffected[0]}}`);
            });
        }, 200);
    });
});

app.get('/kehanWang/methodToClearEverything/beCareful', (req, res) => {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = 'DELETE FROM Profile; DELETE FROM Message; DELETE FROM Task';
        request.query(stringRequest, (err, response) => {
            if(err) {
                console.log(err);
            }
            res.send('Everything has been deleted (but not profile pictures)');
        })
    })
});

function tokenToEmail(tokenString) {
    sql.connect(sqlConfig, () => {
        const request = new sql.Request();
        const stringRequest = `SELECT email FROM Token WHERE token = '${tokenString}'`;
        request.query(stringRequest, (err, res) => {
            if(err) {
                console.log(err);
            }
            return res.recordset;
        })
    })
}
