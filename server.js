require("dotenv").config();
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

var connectionString = process.env.DATABASE_URL;

var client = new pg.Client(connectionString);

var accountTable = 'salesforce.account';


client.connect();

app.use(express.static(path.join(__dirname,"client", "build")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*app.get("*", function(req, res) {
  console.log('MDY114 PATH ' + path.join("client", "public", "index.html"));
  //res.sendFile(path.join(__dirname, "client", "public", "index.html"));
  res.json(JSON.stringify(req.url + ' ' + req.path))
});*/

if (process.env.DATABASE_URL !== undefined) {
  pg.defaults.ssl = true;
}


// setup the demo data if needed
/*client.query('SELECT * FROM salesforce.account', function(error, data) {
  if (error !== null) {
    client.query('SELECT * FROM account', function(error, data) {
      if (error !== null) {
        console.log('Loading Demo Data...');
        require('./db/demo.js')(client);
        console.log('Done Loading Demo Data!');
      }
    });
  }
  else {
    var schema = 'salesforce.';
    accountTable = schema + 'account';
  
  }
});*/

app.use('/googleplex', function(req, res){
  console.log('googleplex');
  res.json('googleplex')
})

app.use('/account', function(req, res) {
  console.log('test');
  client.query('SELECT * FROM ' + accountTable, function(error, data) {
    console.log(` MDY114 ACCOUNTS ${data.rows}`)
    //res.send(data.rows);
    res.json(data.rows);
  })
});

/*app.get('/account/:id', function(req, res) {
  client.query('SELECT ' + accountTable + '.* FROM ' + accountTable + 'WHERE ' + accountTable + '.sfid = $1', [req.params.id], function(error, data) {
    res.json(data.rows[0]);
  });
});*/


var port = process.env.PORT || 8200;

app.listen(port, () => console.log(port));

