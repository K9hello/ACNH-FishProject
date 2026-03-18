const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('fish.db');

// Run a SQL query to create a table
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS fish (
        id INTEGER PRIMARY KEY,
        name TEXT,
        size TEXT,
        location TEXT,
        active_time TEXT,
        active_time_alt TEXT,
        active_months_NH TEXT,
        active_months_SH TEXT
        
      )
    `);
  });
  
  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Database created successfully');
    }
  });