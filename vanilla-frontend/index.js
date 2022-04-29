var socket = io()
const chatForm = document.getElementById('chat-form');
const chatApp = document.getElementById('chat-app');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const entryButtons = document.getElementById('entryButtons');
const loginGrid=document.getElementById('login-grid');
const input = document.getElementById('input');
const search_input = document.getElementById('search-input');
const messagesList = document.getElementById('messages');
const contactList = document.getElementById('contacts');
const profileElement = document.getElementById('prof');
const composeElement = document.getElementById('compose');
const searchbar = document.getElementById('search');

var messages = [];
var listOfContacts = [];
var userConversations=[];
var groupData=[];
var p_number;
var profile_of_user;
var currentPerson;
var currentc_number;
var privOfuser;
var list_of_online_users=[];
var currentSender=[];

async function showMessage(message) {
    const messageElement = document.createElement('li');
    await new Promise(resolve => setTimeout(() => resolve(), 800));
    //console.log(currentSender);
    //console.log(message);
    for(var i=0;i<currentSender.length;i++){
        //console.log(15);
        if(currentSender[i].MessageID==message.Message_ID){
            console.log(15)
            messageElement.textContent = currentSender[i].UserName;
        }
    }
    messageElement.textContent += `:`+message.Message_body;
    messagesList.appendChild(messageElement);
    chatApp.scrollTo(0, chatApp.scrollHeight);
}

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    //if(input.value!=''){
        const messageObject = {
            Message_ID: '-1',
            Message_body: input.value,
            Message_type: 'DOCS',
            c_number: currentc_number,
            sender: p_number,
            isForwarded: 0
        }
        socket.emit('chat message', messageObject,currentc_number);
        messages.push(messageObject);
        showMessage(messageObject);
        input.value = '';
    //}
    
})
searchbar.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(search_input.value);
    socket.emit('search',search_input.value,p_number);
    
})

socket.on('search', (data) => {
    console.log(data);
});


socket.on('chat message', (messageObject) => {
    if(messageObject.sender!=p_number){
        if(messageObject.c_number==currentc_number){

            messages.push(messageObject);
            showMessage(messageObject);
        }
    }
})

socket.on('connect', () => {
    console.log("Connected?");
})


function showLogin(event) {
    event.preventDefault();
    loginForm.style.display = 'block';
    entryButtons.style.display = 'none';
}
function showRegister(event) {
    event.preventDefault();
    registerForm.style.display = 'block';
    entryButtons.style.display = 'none';
}

function registerHandler(event){
    event.preventDefault();
    var username=event.target.username.value;
    var mobileNumber=event.target.p_number.value;
    var password=event.target.password.value;
    var status=event.target.status.value;
    var userObject={
        Username:username,
        MobileNumber:mobileNumber,
        Password:password,
        Status:status
    }
    console.log(userObject);
    socket.emit('register', userObject);
    socket.emit('login', mobileNumber);

    loginGrid.style.display = 'none';
    registerForm.style.display = 'none';
    contactList.style.display = 'block';
    chatApp.style.display = 'grid';
    chatApp.scrollTo(0, chatApp.scrollHeight);
    chatApp.style.display = 'none';

}



function loginHandler(event) {
    event.preventDefault();
    
    p_number=event.target.p_number.value;
    console.log(event.target.p_number.value);

    socket.emit('login', p_number);

    

    loginGrid.style.display = 'none';
    loginForm.style.display = 'none';
    contactList.style.display = 'block';
    chatApp.style.display = 'grid';
    chatApp.scrollTo(0, chatApp.scrollHeight);
    chatApp.style.display = 'none';
}

// //recieve contact list
// socket.on('contacts', contacts => {
//     console.log(contacts);
//     listOfContacts=contacts;
//     console.log(listOfContacts.map(x => x.Username));   
//     showContactList();       
// })

//recieve profile details

socket.on('profile', profile => {
    console.log(profile);
    profile_of_user=profile;
})

function profileHandler(event) {
    event.preventDefault();
    showProfile(profile_of_user);
}

function composeHandler(event) {
    event.preventDefault();
    //show alert
    composeElement.style.display = 'block';
    chatApp.style.display = 'none';
    composeElement.innerHTML=`<form id="compose-form" onsubmit="sendMessage(event)">
    <input type="text" name="num" placeholder="Reciever's number" > 
    <input type="text" name="mess" placeholder="Type your message here" >
    <button type="submit" onclick="messageSend(event)">Send</button>
    </form>`;
}

function messageSend(event) {
    event.preventDefault();
    composeElement.style.display = 'none';
}

function showProfile(profile) {
    socket.emit('retPrivacyStatus', profile[0].MobileNumber);
    profileElement.style.display = 'flex';
    profileElement.innerHTML = `
        <div class="profile-container">
            <div class="profile-image">
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" id="circle">
            </div>
            <div class="profile-details">
                <div class="profile-name">Name: ${profile[0].Username}</div>
                <div class="profile-number">Phone Number: ${profile[0].MobileNumber}</div>
                <div class="profile-email">Status: ${profile[0].Status}</div>
                <div class="Privacy-status">Privacy Status: ${privOfuser}</div>
                <button onclick="openSettings(event)">Settings</button>
                <br>
            </div>
            <button id="close-profile" onclick="closeProfile()">Close Profile</button>
        </div>
    `;
    chatApp.style.display='none';

    //document.getElementById('maingrid').appendChild(profileElement);
}


socket.on('privacyStatus', privacyStatus => {
    privOfuser=privacyStatus[0].PrivacyStatus;
    console.log(privOfuser);
});


function openSettings(event) {
    event.preventDefault();
    console.log('open settings');
    //profileElement.style.display = 'none';
    //chatApp.style.display = 'none';
    profileElement.innerHTML = `Update Privacy Settings
    <button onclick="updateSettings(event, ('Normal'))">Normal</button>
    <button onclick="updateSettings(event, ('Private'))">Private</button>
    <button onclick="updateSettings(event, ('Restricted'))">Restricted</button>
    <button onclick="closeProfile()">Close</button>
    `;

}

function updateSettings(event, status) {
    event.preventDefault();
    console.log('updated',status);
    socket.emit('update profile', status,p_number);
    profileElement.innerHTML = `Updated to ${status} <br> <button onclick="closeProfile()">Close</button> <button id="profile" onclick="profileHandler(event)">Back to Profile</button>`;
}

function closeProfile() {
    profileElement.style.display = 'none';
    chatApp.style.display = 'none';
}

// function showContactList() {
//     let contact;
//     console.log(11, listOfContacts);
//     for (let i=0; i<listOfContacts.length; i++) {
//         contact = document.createElement('li');
//         contact.style.cursor = 'pointer';
//         contact.addEventListener('click', function() {
//             showX(listOfContacts[i])
//         })
//         contact.innerHTML = listOfContacts[i].Username;
//         contactList.appendChild(contact);
//     }
//     //contact.innerHTML = '<button onclick="closeContactList()">Close Contact List</button>';
// }

// function closeContactList() {
//     contactList.style.display = 'none';
//     chatApp.style.display = 'grid';
// }

socket.on('conversations', conversations => {
    console.log(conversations);
    userConversations=conversations;
    getGroup();
})

function getGroup(){
    console.log(userConversations);
    socket.emit('getGroup', userConversations);

    
}

socket.on('group', group => {
    groupData=group;
    console.log(groupData);
    console.log(groupData, groupData.length);
    let contact;
    for (let i=0; i<groupData.length; i++){
        console.log(groupData[i]);
        console.log(12)
        contact = document.createElement('li');
        contact.style.cursor = 'pointer';
        contact.addEventListener('click', function() {  
            socket.emit('mm',p_number);          
            chatApp.style.display = 'grid';
            currentc_number=groupData[i].CONVERSATION_Conversation_ID;
            currentPerson=groupData[i].Name;
            showX(groupData[i]);
            console.log(list_of_online_users[i]);       //group status
        })
        contact.innerHTML = groupData[i].Name;
        
        contactList.appendChild(contact);
    }
})





function showX(arg) {
    console.log(arg);
    socket.emit('getMessageIDs', arg.CONVERSATION_Conversation_ID);
}

socket.on('m', m => {
    //console.log(m);
    messages=[];
    messages.push(...m);
    //m.forEach(showMessage);
})

socket.on('messageIDs', messageIDs => {
    //loop for messages
    messagesList.innerHTML = '';
    messageIDs.sort(function(a,b){return new Date(a.MESSAGE_Message_ID) - new Date(b.MESSAGE_Message_ID)});
    //messageIDs.sort();
    console.log(messageIDs);
    //console.log(currentSender)
    for(let i=0; i<messageIDs.length; i++){
        for(let j=0; j<messages.length; j++){
            if(messages[j].Message_ID==messageIDs[i].MESSAGE_Message_ID){
                socket.emit('getSender', messages[j].Message_ID);

               //console.log(messages[j]);
                showMessage(messages[j]);
            }
        }
    }
});

socket.on('getSender', (sender,mID) => {
    sender[0].MessageID=mID;
    currentSender.push(sender[0]);
    //console.log(currentSender);
});

socket.on('online_status', online_status => {
    list_of_online_users=online_status;
});