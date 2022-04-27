var socket = io()
const chatForm = document.getElementById('chat-form');
const chatApp = document.getElementById('chat-app');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const entryButtons = document.getElementById('entryButtons');
const loginGrid=document.getElementById('login-grid');
const input = document.getElementById('input');
const messagesList = document.getElementById('messages');
const contactList = document.getElementById('contacts');
const profileElement = document.getElementById('prof');

var messages = [];
var listOfContacts = [];
var userConversations=[];
var groupData=[];
var p_number;
var profile_of_user;
var currentPerson;
var currentc_number;

function showMessage(message) {
    const messageElement = document.createElement('li');
    
    if(message.Message_ID==-1)
        messageElement.textContent = message.Message_body;
    else{
        messageElement.textContent = message.Message_body;
        messageElement.style='text-align:left';
    }
    messagesList.appendChild(messageElement);
    chatApp.scrollTo(0, chatApp.scrollHeight);
}

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if(input.vali!=''){
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
    }
    
})


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

function showProfile(profile) {
    
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
                <button onclick="openSettings(event)">Settings</button>
                <br>
            </div>
            <button id="close-profile" onclick="closeProfile()">Close Profile</button>
        </div>
    `;
    chatApp.style.display='none';

    //document.getElementById('maingrid').appendChild(profileElement);
}

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
    chatApp.style.display = 'grid';
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
            showX(groupData[i])
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
    console.log(m);
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
    for(let i=0; i<messageIDs.length; i++){
        for(let j=0; j<messages.length; j++){
            if(messages[j].Message_ID==messageIDs[i].MESSAGE_Message_ID){
                console.log(messages[j]);
                showMessage(messages[j]);
            }
        }
    }
});