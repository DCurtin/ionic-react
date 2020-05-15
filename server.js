require("dotenv").config();
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.use(express.static(path.join(__dirname,"client", "build")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("*", function(req, res) {
  console.log('MDY114 PATH ' + path.join("client", "public", "index.html"));
  res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/dreamhouse';

if (process.env.DATABASE_URL !== undefined) {
  pg.defaults.ssl = true;
}

var client = new pg.Client(connectionString);
client.connect();

var transactionTable = 'account';

// setup the demo data if needed
client.query('SELECT * FROM salesforce.account', function(error, data) {
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
    transactionTable = schema + 'transaction__c';
  
  }
});

app.get('/transaction', function(req, res) {
  client.query('SELECT * FROM ' + transactionTable, function(error, data) {
    res.json(data.rows);
  });
});

app.get('/transaction/:id', function(req, res) {
  client.query('SELECT ' + transactionTable + '.*, ' + brokerTable + '.sfid AS broker__c_sfid, ' + brokerTable + '.name AS broker__c_name, ' + brokerTable + '.email__c AS broker__c_email__c, ' + brokerTable + '.phone__c AS broker__c_phone__c, ' + brokerTable + '.mobile_phone__c AS broker__c_mobile_phone__c, ' + brokerTable + '.title__c AS broker__c_title__c, ' + brokerTable + '.picture__c AS broker__c_picture__c FROM ' + propertyTable + ' INNER JOIN ' + brokerTable + ' ON ' + propertyTable + '.broker__c = ' + brokerTable + '.sfid WHERE ' + propertyTable + '.sfid = $1', [req.params.id], function(error, data) {
    res.json(data.rows[0]);
  });
});


var port = process.env.PORT || 8200;

app.listen(port, () => console.log(port));

