const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue) {
    return stringValue;
});

const databaseConfig = {
    'host': 'ec2-44-194-167-63.compute-1.amazonaws.com',
    'port': 5432,
    'database': 'd3f3qbbcp370ng',
    'user': 'xfbmjofzawahpj',
    'password': 'c194cca6a69cc082bc74dfff05ca8b2b72d253bc2e23443a2fb219bbe2ff860f',
    'ssl': {rejectUnauthorized: false}
};

const db = pgp(databaseConfig);

module.exports = db;