require("dotenv").config();
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var jsforce = require('jsforce');
var app = express();
const hash = require('crypto').createHash('md5');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

var connectionString = process.env.DATABASE_URL || 'postgresql://postgres@localhost/salesforce';
console.log(connectionString);

var client = new pg.Client(connectionString);

var accountTable = 'salesforce.account';


var conn = new jsforce.Connection({
  oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    // loginUrl : 'https://test.salesforce.com',
    loginUrl : 'https://test.salesforce.com',
    //loginUrl : 'https://dcurtin-iraonline.cs17.force.com/client',
    clientId : process.env.SFClient_Id,
    clientSecret : process.env.SFClient_Sec,
    redirectUri : process.env.SF_Redirect
  }
});

console.log(conn);


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

app.post('/account', function(req, res) {
  console.log('body :' + req.body);
  var userSessionId = req.body.userSession;
  console.log(userSessionId);
  
  checkIfAuthorized(userSessionId).then(function(error, data){
    if(error || data === undefined){
      res.status(500).send('session token invalid');
      return;
    }
    let user = data['rows'][0]
    //need to add conn and or time check to table
    console.log('test');
    client.query('SELECT * FROM ' + accountTable, function(error, data) {
      if(error){
        res.json({'error' : error.toString()})
      }
      //res.send(data.rows);
      res.json(data.rows);
    })
  });

});

function checkIfAuthorized(userSessionId){
  var userQuery = {
    text : 'SELECT * FROM salesforce.user_session WHERE hashed_session_id = $1',
    values : [userSessionId]
  }
  return client.query(userQuery);
}

app.post('/createTransaction', function(req, res){
  var responseBody = req.body;
  var userSessionId = responseBody.userSession;
  
  checkIfAuthorized(userSessionId).then(function(data){
    if(data === null){
      res.status(500).send('session token invalid');
    }
    //console.log(req);
    console.log('Account id ' + responseBody.sfid);
    const query = {
      text: 'INSERT INTO salesforce.transaction__c(paybable_to_from__c, recordtypeid, account__c, assigned_to__c) VALUES($1, $2, $3, $4)',
      values: ['test 123', '01230000000Ne2TAAS', responseBody.sfid, '0050M00000Dv1h5QAB'],
    }
    client.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
    });
  })
});

app.post('/loginServer', function(req, res){
  var data = req.body;
  console.log(data.userName + ' ' + data.passWord);
  conn.login(data.userName, data.passWord, function(err, userInfo) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return console.log('fail');
    }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    // logged in user property
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    let token = hash.update(conn.accessToken).digest('hex');
    let query = {
      text : 'SELECT * FROM salesforce.user WHERE sfid = $1',
      values : [userInfo.id]
    }
    client.query(query, function(error, data) {
      var row = data['rows'][0];
      console.log(row['sfid']);
      var query = {
        //upsert record
        text : 'INSERT INTO salesforce.user_session(access_token, hashed_session_id, name, userid, contactid, accountid)  VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT (userid) DO UPDATE SET access_token = EXCLUDED.access_token, hashed_session_id = EXCLUDED.hashed_session_id',
        values: [conn.accessToken, token, row['name'], row['sfid'], row['contactid'], row['accountid']]
      }
      client.query(query).then(function(result){
        console.log(result);
      }).catch(function(err){
        console.log(err);
      });
      let userIdentity = {
        'userId' : userInfo.id,
        'name' : row['name']
      }

      res.json({'user': userIdentity, 'token': token})
    })
    // ...
  });
})

/*app.get('/account/:id', function(req, res) {
  client.query('SELECT ' + accountTable + '.* FROM ' + accountTable + 'WHERE ' + accountTable + '.sfid = $1', [req.params.id], function(error, data) {
    res.json(data.rows[0]);
  });
});*/


var port = process.env.PORT || 8200;

app.listen(port, () => console.log(port));

