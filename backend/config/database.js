require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const mysqlssh = require('mysql-ssh');

// cache de conexiones
let sshConn = null;
let directPool = null;

// helper para booleanos de .env
function envBool(name, def = false) {
    const v = (process.env[name] || '').trim().toLowerCase();
    if (v === '1' || v === 'true' || v === 'yes') return true;
    if (v === '0' || v === 'false' || v === 'no') return false;
    return def;
}

const SSH_ENABLED = envBool('SSH_ENABLED', false);

// ✅ configuración MySQL directo
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
    queueLimit: 0,
};

// ✅ función general para obtener conexión
async function getConnection() {
    if (!SSH_ENABLED) {
        if (!directPool) {
            directPool = mysql.createPool(dbConfig).promise();
        }
        return directPool;
    }

    // ✅ modo SSH
    if (sshConn) return sshConn;

    const sshConfig = {
        host: process.env.SSH_HOST,
        port: Number(process.env.SSH_PORT || 22),
        username: process.env.SSH_USER,
    };

    if (process.env.SSH_AUTH_METHOD === 'password') {
        sshConfig.password = process.env.SSH_PASSWORD;
    } else {
        sshConfig.privateKey = fs.readFileSync(
            path.join(__dirname, '../ssh', process.env.SSH_KEY)
        );
    }

    const mysqlConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };

    sshConn = await mysqlssh.connect(sshConfig, mysqlConfig);
    console.log('✅ Conectado a MySQL vía túnel SSH');
    return sshConn;
}

// ✅ método unificado para queries
async function query(sql, params) {
    const conn = await getConnection();

    return new Promise((resolve, reject) => {
        conn.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve([results]);
        });
    });
}

module.exports = { query };
