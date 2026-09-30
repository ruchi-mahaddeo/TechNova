require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    user: process.env.DB_USER || process.env.MYSQLUSER || "root",
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || "tech_event"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("MySQL database connected!");
    }
});

module.exports = db;