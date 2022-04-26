const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
var mysql = require('mysql2');


//mysql connection
var onlineUsers = [];
var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Luv 2 Laf',
  database : 'whatsapp2'
});

con.connect();

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected database!");
});

var users = [];
var userfields=[];

con.query("SELECT * FROM user", function (err, result, fields) {
  if (err) throw err;
  users=result;
  userfields=fields;
});
//end connection

const app = express();
const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

var messages = [];

function asyncQuery(query) {
  return new Promise((resolve, reject) => {
    con.query(query, function (err, result, fields) {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

io.on('connection', (socket) => {


  console.log("Someone connected, socket id: " + socket.id);

  //

  //

  socket.on('disconnect', () => {
    var p;
    for(var i=0;i<onlineUsers.length;i++){
      if(onlineUsers[i].id==socket.id){
        p=onlineUsers[i].p_number;
      }
    }
    console.log(p);
    if(p!=undefined){
      var query=`UPDATE whatsapp2.user_status SET OnlineStatus = 0, LastSeen = current_timestamp() WHERE USER_MobileNumber = ${p};`;
      asyncQuery(query);
      console.log('user disconnected');
    }

  });





  socket.on('chat message', message => {
    message.Message_ID=0;
    socket.broadcast.emit('chat message', message);
    console.log(message);
    messages.push(message);
  })

  
  socket.on('register',async userObject=>{
    var query=`INSERT INTO whatsapp2.user (Username, MobileNumber, Status, Display) VALUES ('${userObject.Username}' , ${userObject.MobileNumber}, '${userObject.Status}', '${userObject.Password}');`;
    await asyncQuery(query);

  });

  
  socket.on('login',async  p_number => {
    //update to online
    var query=`UPDATE whatsapp2.user_status SET OnlineStatus = 1, LastSeen = current_timestamp() WHERE USER_MobileNumber = ${p_number};`;
    await asyncQuery(query);

    // //contacts
    // var contacts;
    // //var query=`select distinct u.Username,  u.MobileNumber from sends s, user u, conversation c, user_ismember_conversation m where s.USER_MobileNumber=${p_number} and s.CONVERSATION_Conversation_ID=m.CONVERSATION_Conversation_ID and m.USER_MobileNumber=u.MobileNumber`;
    // var query=`SELECT Username, MobileNumber FROM whatsapp2.user`;
    // con.query(query, function (err, result, fields) {
    //   if (err) throw err;
    //   contacts=result;
    //   console.log(contacts);
    //   socket.emit('contacts', contacts);
    // });


    userDet={
      id : socket.id,
      p_number : p_number
    }
    console.log(userDet);
    onlineUsers.push(userDet);
    console.log(onlineUsers);

    //profile details
    var profile;
    var query=`select * from user where MobileNumber=${p_number}`;
    profile = await asyncQuery(query);
    socket.emit('profile', profile);      

    //list of conversations user is part of
    var conversations;
    var query=`SELECT CONVERSATION_Conversation_ID FROM whatsapp2.user_ismember_conversation WHERE USER_MobileNumber = ${p_number}`;
    conversations = await asyncQuery(query);
    //console.log(conversations);
    socket.emit('conversations', conversations);

    //list of messages in each conversation
    
    var query='select * from message';
    messages = await asyncQuery(query);
    //console.log(messages);
    socket.emit('m', messages);





    

  console.log("query promised")
  });



  socket.on('getGroup', async conversations=> {
    var groupData=[];
    for(let i=0;i<conversations.length;i++){
      var group;
      var query=`SELECT * FROM whatsapp2.group_ WHERE CONVERSATION_Conversation_ID = ${conversations[i].CONVERSATION_Conversation_ID};`;
      const result = await asyncQuery(query);
      group=result;
      groupData.push(group[0]);
    }
    //console.log(groupData);
    socket.emit('group', groupData);
  });

  socket.on('getMessageIDs', async mID=> {
    //console.log(mID);
   // var messageIDs=[];
    var message;
    var query=`SELECT whatsapp2.sends.MESSAGE_Message_ID FROM whatsapp2.sends INNER JOIN whatsapp2.message on message.message_ID= sends.message_Message_ID where CONVERSATION_Conversation_ID = ${mID};`;
    const result = await asyncQuery(query);
    message=result;
    //console.log(11);
    //console.log(message);
   // messageIDs.push(message);
    
    //console.log(groupData);
    socket.emit('messageIDs', message);
  });

  //Update online status
  socket.on('update profile', async (status,number) => {
    console.log(status);
    var query=`Update settings set privacystatus='${status}' where user_mobilenumber=${number};`;
    await asyncQuery(query);
  });

})



// app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, '../vanilla-frontend')));
httpServer.listen(process.env.PORT || 3001);
