const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

// Connect to the SQLite database
const db = new sqlite3.Database('fish.db');

// Define a route to fetch data from the database
app.get('/fishNames', (req, res) => {
  // Query the database to retrieve fruit data
  db.all('SELECT name FROM fish', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.get('/searchFish/:name', (req, res) => {
  const name = req.params.name;
  db.all('SELECT * FROM fish WHERE name = ?', [name], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.get('/monthFish/:hemisphere/:month', (req,res) => {
  const hemisphere = req.params.hemisphere;
  console.log(hemisphere);
  var hemispheresql = '';
  if (hemisphere == 'NH') {
    hemispheresql = 'active_months_NH';
  } else {
    hemispheresql = 'active_months_SH';
  }

  const month = [req.params.month];
  const monthsql = buildMonthsSQL(month,hemispheresql);

  const sql = 'SELECT * FROM fish WHERE ' + monthsql;
  console.log(sql); 

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });

})

app.get('/relatedFish', (req, res) => {
  const hemisphere = req.query.hemisphere;
  var hemispheresql = '';
  if (hemisphere == 'NH') {
    hemispheresql = 'active_months_NH';
  } else {
    hemispheresql = 'active_months_SH';
  }

  var location = req.query.location;
  var locationsql = `(location = '${location}' `;
  if (location.includes('(')) {
    const parts = location.split(' ');
    const baseLocation = parts.shift();
    locationsql += `OR location = '${baseLocation}' `;
  }
  locationsql += `) `;

  const months = req.query.months.split(',');
  const monthsql = buildMonthsSQL(months, hemispheresql);

  const times = [req.query.time,req.query.time2];
  const timesql = buildTimeSQL(times[0],times[1]);

  const sql = 'SELECT * FROM fish WHERE ' + locationsql + ' AND (' + monthsql + ') ' + timesql;

  console.log(sql);

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
})

function buildTimeSQL(time1, time2) {
  var result = "";
  const timeStr = ' active_time ';
  const timeStr2 = ' active_time_alt ';
  if (time1 == '5' || time2 == '5') {
    //if time = all day, no need to filter
    return result;
  }

  //add 5 to filter
  result += ' AND ( ' + timeStr + ' = 5 OR ' + timeStr2 + ' = 5 OR ';

  if (time1 == '1' || time2 == '1') {
    //get 1,2,3
    result += timeStr + ' = 1 OR ' + timeStr2 + ' = 1 OR ';
    result += timeStr + ' = 2 OR ' + timeStr2 + ' = 2 OR ';
    result += timeStr + ' = 3 OR ' + timeStr2 + ' = 3 ';
  } else if (time1 == '2' || time2 == '2') {
    //get 1,2,4
    result += timeStr + ' = 1 OR ' + timeStr2 + ' = 1 OR ';
    result += timeStr + ' = 2 OR ' + timeStr2 + ' = 2 OR ';
    result += timeStr + ' = 4 OR ' + timeStr2 + ' = 4 ';
  } else if (time1 == '3' || time2 == '3') {
    //get 1,3
    result += timeStr + ' = 1 OR ' + timeStr2 + ' = 1 OR ';
    result += timeStr + ' = 3 OR ' + timeStr2 + ' = 3 ';
  } else if (time1 == '4' || time2 == '4') {
    //get 2,4
    result += timeStr + ' = 2 OR ' + timeStr2 + ' = 2 OR ';
    result += timeStr + ' = 4 OR ' + timeStr2 + ' = 4 ';
  }

  result += ')';

  return result;

  /*
  time code overlaps
  1-123
  2-124
  3-13
  4-24
  */

}

function buildMonthsSQL(months, hemispheresql) {
  var monthsql = "";
  months.forEach(month => {
    monthsql += hemispheresql + ' LIKE '
    if (month == '1') {
      //only 1 not 11
      monthsql += '\'' + month + ',%\' OR '
    } else if (month == '2') {
      //only 2 not 12
      monthsql += '\'2,%\' OR ' + hemispheresql + ' LIKE \'%,2,%\' OR ' + hemispheresql + ' LIKE \'%,2\' OR ';
    } else {
      monthsql += '\'%' + month + '%\' OR ';
    }

  });
  monthsql = monthsql.slice(0, -3);
  return monthsql;
}

app.post('/addFish', (req, res) => {
  const newData = req.body;

  console.log(req.body);

  const sql = 'INSERT INTO fish (name,size,location,active_time,active_time_alt,active_months_NH,active_months_SH) VALUES (?,?,?,?,?,?,?)';
  const values = [newData.name, newData.size, newData.location, newData.activeTime, newData.activeTimeAlt, newData.NHmonths, newData.SHmonths];

  db.run(sql, values, function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error adding record to database');
    } else {
      console.log('${this.lastID} record ID added successfully');
      res.status(200).send('{"message": "Record added successfully"}');
    }
  })
})

// Serve your HTML file
const frontendPath = path.join(__dirname, 'frontend');
console.log(frontendPath);
app.use(express.static(frontendPath));

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
