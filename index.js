const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


var ZaloOA = require('zalo-sdk').ZaloOA;

var zaConfig = {
	oaid: '1388054469154530588',
	secretkey: 'bmoiK6pQ6Kl2VB1zvm03'
}
var ZOAClient = new ZaloOA(zaConfig);
var server = require("http").Server(app);

server.listen(3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), uploadFile);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function uploadFile(auth){
    const drive = google.drive('v3');

    var fileMetadata = {
        'name': 'photo.jpg'
      };
      var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('1.jpg')
      };
      drive.files.create({
        auth:auth,
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
            console.log('File Id: ', file.data.id);
            
            drive.permissions.create({
                auth:auth,
                fileId: file.data.id,
                resource:{
                    'role':"reader",
                    "type":"anyone"
                }}, function(err,result){
                  if(err) console.log('lỗi xảy ra') 
                  else console.log('cấp quyền thành công')
              });
        }
      });
}

app.get('/webhook/',function(req,res){

    switch(req.query.event){
        case 'sendmsg':
            let message = req.query.message
            switch(message){
                case 'hello':
                    replyMessage(req.query.fromuid)
                    break
                case ' send image':
                    replyImage(req.query.fromuid)
                    break
            }
    }
    res.sendStatus(200);
})
app.post('/webhook/',function(req,res){
    console.log('body')
    console.log(req.body)
    if(req.body.event_name =="user_send_text"){
        switch(req.body.message.text){
            case 'tung':
                var text = 0;
                replyMessage(req.body.sender.id,text)
                // replyImage(req.body.sender.id,text)
                break
            case 'dan':
                console.log('dan')
                var text1 = 1;
                // replyImage(req.body.sender.id,text1)
                replyMessage(req.body.sender.id,text1)
                break
            default:
                var text2 = 0;
                replyMessage(req.body.sender.id,text2)
                // replyImage(req.body.sender.id,text2)
        }
    }
   
    res.sendStatus(200);
});

function replyImage(uid,text){
  
    var userId = uid;
    if(text == 1){
      var fileUrl = 'https://cdn.glitch.com/5940de18-ccbd-4685-9415-2d4306d62e9f%2F1.jpg'
        ZOAClient.api('sendmessage/image', 'POST', {uid: userId, message: 'Zalo SDK Nodejs', 'imageid': fileUrl}, function(response) {
          console.log(response)
        })  
    }else{
       var fileUrl = 'https://cdn.glitch.com/5940de18-ccbd-4685-9415-2d4306d62e9f%2F1.jpg'
          ZOAClient.api('sendmessage/image', 'POST', {uid: userId, message: 'Zalo SDK Nodejs', 'imageid': fileUrl}, function(response) {
            console.log(response)
          })
    }
   
}

function replyMessage(uid,text){
    var userId = uid;
    if(text == 1){
        ZOAClient.api('sendmessage/text', 'POST', {uid: userId, message: 'https://cdn.glitch.com/5940de18-ccbd-4685-9415-2d4306d62e9f%2F1.jpg'}, function(response) {
            console.log(response);
        })
        
    }else{
        ZOAClient.api('sendmessage/text', 'POST', {uid: userId, message: 'https://drive.google.com/file/d/1vBcbItPg94FajCRXGzBh3fzl89vtRI8b/view?usp=sharing'}, function(response) {
            console.log(response);
        })
    }
   
}
