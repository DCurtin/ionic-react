require("dotenv").config();
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var jsforce = require('jsforce');
var app = express();
var cachedConnections = {};
const loginUrl = 'https://test.salesforce.com';


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

var connectionString = process.env.DATABASE_URL || 'postgresql://postgres@localhost/salesforce';

var client = new pg.Client(connectionString);

var accountTable = 'salesforce.account';


//client.connect();

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
  var userSessionId = req.body.userSession;
  
  checkIfAuthorized(userSessionId).then(function(userData){
    if(userData === undefined || userData.rows.length === 0){
      res.status(500).send('session token invalid');
      return;
    }
    let user = userData['rows'][0]
    //need to add conn and or time check to table
    
    client.query('SELECT * FROM ' + accountTable).then(function(data) {
        //res.send(data.rows);
        res.json(data['rows']);
      }).catch(function(error){
      if(error){
        console.log('error in account query')
        console.log(error);
        res.json({'error' : error.toString()})
        return;
      }
    })
  }).catch(function(error){
    console.log('109 exception on query');
    console.log(error);
    res.status(500).send('session token invalid');
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
  
  checkIfAuthorized(userSessionId).then(function(userData){
    if(userData === undefined || userData.rows.length === 0){
      res.status(500).send('session token invalid');
      return;
    }

    const query = {
      text: 'INSERT INTO salesforce.transaction__c(paybable_to_from__c, recordtypeid, account__c, assigned_to__c) VALUES($1, $2, $3, $4)',
      values: ['test 123', '01230000000Ne2TAAS', responseBody.sfid, '0050M00000Dv1h5QAB'],
    }
    client.query(query, (err, response) => {
      if (err) {
        console.log(err)
        res.status(500).json(err)
      } else {
        res.json('ok');
      }
    });
  }).catch(function(error){
    res.status(500).send('session token invalid');
  })
});

app.post('/logoutServer', function(req, res){
  var userSessionId = req.body.userSession;
  var connection = cachedConnections[userSessionId];

  if(connection === undefined || connection === null)
  {
    console.log('connection does not exist');
    res.json('connection did not exist');
    return;
  }

  connection.logout(function(err){
    if(err){
      console.log(err);
      res.status(500).json(err);
    }
  });
})

app.post('/loginServer', function(req, res){
  var data = req.body;
  const hash = require('crypto').createHash('md5');
  var conn = new jsforce.Connection({
    oauth2 : {
      // you can change loginUrl to connect to sandbox or prerelease env.
      // loginUrl : 'https://test.salesforce.com',
      loginUrl : loginUrl,
      //loginUrl : 'https://dcurtin-iraonline.cs17.force.com/client',
      clientId : process.env.SFClient_Id,
      clientSecret : process.env.SFClient_Sec,
      redirectUri : process.env.SF_Redirect
    }
  });

  conn.login(data.userName, data.passWord, function(err, userInfo) {
    var token = hash.update(conn.accessToken).digest('hex');
    var query = {
        text : 'SELECT * FROM salesforce.user WHERE sfid = $1',
        values : [userInfo.id]
    }
    
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return console.log('fail');
    }
    
    if(cachedConnections[token] === undefined)
    {
      var second = 1000;
      var minutes = 60 * second;
      cachedConnections[token] = conn;
      setTimeout(function(conn){
        console.log('logging out user')
      }, minutes);
    }
    //console.log(userInfo);
    console.log('-----------------')
    //console.log(conn);
    
    client.query(query).then(function(data) {
      console.log('user query');
      console.log(data);
      var row = data['rows'][0];
      var query = {

        //upsert record
        text : 'INSERT INTO salesforce.user_session(access_token, hashed_session_id, name, userid, contactid, accountid)  VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT (userid) DO UPDATE SET access_token = EXCLUDED.access_token, hashed_session_id = EXCLUDED.hashed_session_id',
        values: [conn.accessToken, token, row['name'], row['sfid'], row['contactid'], row['accountid']]
      }
      client.query(query).then(function(result){
        res.json({'user': userIdentity, 'token': token})
      }).catch(function(err){
        console.log(err);
      });
      let userIdentity = {
        'userId' : userInfo.id,
        'name' : row['name']
      }
    }).catch(function(error){
      res.status(500).send('error finding user');
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

