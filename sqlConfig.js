// This is the basic authentication for MSSQL database
const sqlConfig = {
    user: 'foo',
    password: 'foo', //TODO: need to be changed here
    server: 'localhost',
    database: 'Users',
    options: {
        trustedconnection: true,
        enableArithAbort : true,
        encrypt: false
    }
};

module.exports = sqlConfig;