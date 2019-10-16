const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

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
                break
            case 'dan':
                console.log('dan')
                var text1 = 1;
                replyMessage(req.body.sender.id,text1)
                break
            default:
                var text2 = 0;
                replyMessage(req.body.sender.id,text2)
        }
    }
   
    res.sendStatus(200);
});
function replyMessage(uid,text){
    var userId = uid;
    console.log(text);
    if(text == 1){
        ZOAClient.api('sendmessage/text', 'POST', {uid: userId, message: 'Ngoc bich'}, function(response) {
            console.log(response);
        })
    }else{
        ZOAClient.api('sendmessage/text', 'POST', {uid: userId, message: 'Zalo SDK Nodejs Test Message'}, function(response) {
            console.log(response);
        })
    }
   
}