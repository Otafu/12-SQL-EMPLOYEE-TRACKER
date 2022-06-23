var getOptions = require("./options");
const mysql = require("mysql2");

(async () => {
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "office",
    password: "2smGcCJxb3n363aF",
  });
  const connection = pool.promise();

  return getOptions(connection).then(() => {
    connection.end();
  });
})();
