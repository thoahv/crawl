var mysql = require('mysql')

var state = {
    pool: null,
    mode: null,
}

exports.connect = function (mode, done) {

    state.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'powergate'
    })

    state.mode = mode
    done()
}

exports.get = function () {
    return state.pool
}

exports.query = function (sql, params) {
    var pool = state.pool
    if (!pool) return done(new Error('Missing database connection.'))

    return new Promise(function (resolve, reject) {
        pool.query(sql, function (error, results, fields) {
            if (error)
                reject(error);
            else
                resolve(results);
        });
    })
}

exports.insert = function (data) {
    var pool = state.pool
    if (!pool) return done(new Error('Missing database connection.'))
    return new Promise(function (resolve, reject) {
        pool.query('INSERT INTO BOOKS SET ?',data, function (error, results, fields) {
            if (error){
                if(error.code == 'ER_DUP_ENTRY'){
                    console.log('Record da ton tai')
                }
                reject(error.code);
            }
            else
                resolve(results[0]);
        });
    })
}



