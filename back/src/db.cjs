const mysql2 = require('mysql2');

// const mysql = require('mysql')

const DB_HOST = 'localhost';
const DB_NAME = 'users';
const DB_PORT = 3306;
const DB_USER = 'root';
const DB_PASSWORD = 'Farmix<2003>';



const connection = mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});
connection.connect(function (err) {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});