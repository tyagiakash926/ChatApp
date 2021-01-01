socket.on("user-joined", function (nameAndUsers) {
   // <div class="chat join">steve joined the chat</div>
   let joinDiv = document.createElement("div");
   joinDiv.classList.add("chat");
   joinDiv.classList.add("join");
   joinDiv.innerHTML = `${nameAndUsers.name} joined the chat`;
   chatBox.append(joinDiv);
   chatBox.scrollTop  =  chatBox.scrollHeight;
   let AllNames = []
    let any = nameAndUsers.users.filter(function(userObj){
        AllNames.push(userObj);
    })
   updateActiveUser(AllNames);
})
socket.on("update-active-list-user", function (nameAndUsers) {
    let AllNames = []
    let any = nameAndUsers.users.filter(function(userObj){
        AllNames.push(userObj);
    })
   updateActiveUser(AllNames);
})

socket.on("receive-chat", function (userObj) {
    addChat("left", userObj);
    var myAudio = new Audio('./bloom.mp3'); 
    myAudio.play();
});

socket.on("deleted-chat-message", function (userObj) {
    console.log("socket.js" , userObj);
    var d = new Date(); // for now
    var hour = d.getHours(); // => 9
    var min = d.getMinutes(); // =>  30
    let deletedDiv = document.createElement("div");
    deletedDiv.classList.add("deleted-chat-showcase");
    deletedDiv.classList.add("left");
    deletedDiv.innerHTML = `<i class="fa fa-ban" aria-hidden="true"></i>  This message was deleted`;
    let timeDiv = document.createElement("div");
    timeDiv.innerHTML = `${hour}:${min}`;
    timeDiv.classList.add("deleted-time");

    deletedDiv.append(timeDiv);
    // chatBox.append(deletedDiv);
    // document.getElementById(userObj).remove();
    let child = document.getElementById(userObj);

    child.replaceWith(deletedDiv);
    chatBox.scrollTop  =  chatBox.scrollHeight;
});

// socket.on("get-active-list",function(allUser){
//     for(let i=0;i<allUser.length;i++){
//         addactive(allUser[i]);
//     }
// });


socket.on("leave", function (name) {
   let joinDiv = document.createElement("div");
   joinDiv.classList.add("chat");
   joinDiv.classList.add("leave");
   joinDiv.innerHTML = `${name} left the chat`;
   chatBox.append(joinDiv);
   chatBox.scrollTop  =  chatBox.scrollHeight;
   removeactive(name);
  });

// canvas=======================================>
socket.on("md" , function(point){
    ctx.strokeStyle = point.penColor;
    ctx.lineWidth = point.penWidth;
    ctx.beginPath();
    ctx.moveTo(point.x , point.y); 
})
socket.on("mm" , function(point){
    ctx.strokeStyle = point.penColor;
     ctx.lineWidth = point.penWidth;
     ctx.lineTo(point.x , point.y);
     ctx.stroke();
 })
 socket.on("undoPoint",function(points){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < points.length; i++) {
    let line = points[i];

    for (let j = 0; j < line.length; j++) {
        ctx.strokeStyle = line[j].penColor;
        ctx.lineWidth = line[j].penWidth;
        if (line[j].id == "md") {
        ctx.beginPath();
        ctx.moveTo(line[j].x, line[j].y);
        } else if (line[j].id == "mm") {
        ctx.lineTo(line[j].x, line[j].y);
        ctx.stroke();
        }
    }
    }
})
socket.on("redoPoint",function(lineToBeDrawn){
    points.push(lineToBeDrawn);
    for (let i = 0; i < lineToBeDrawn.length; i++) {
        ctx.strokeStyle = lineToBeDrawn[i].penColor;
        ctx.lineWidth = lineToBeDrawn[i].penWidth;
        if (lineToBeDrawn[i].id == "md") {
          ctx.beginPath();
          ctx.moveTo(lineToBeDrawn[i].x, lineToBeDrawn[i].y);
        } else {
          ctx.lineTo(lineToBeDrawn[i].x, lineToBeDrawn[i].y);
          ctx.stroke();
        }
      }
})

function removeactive(User){
    document.getElementById(User).remove();
 }


function addChat(sender, userObj) {
    console.log(sender);
    console.log(userObj);

    let chatDiv = document.createElement("div");
    chatDiv.classList.add("chat");
    chatDiv.classList.add(sender);
    // var d = new Date(); // for now
    chatDiv.setAttribute("id",userObj.userObj.string);
    
    let message_profile_image = document.createElement("div");
    message_profile_image.classList.add("message-profile-image");
    var elem = document.createElement("img");
    elem.src = userObj.image;
    let green_dot_for_message = document.createElement("div");
    green_dot_for_message.classList.add("green-dot-for-message");
    green_dot_for_message.innerHTML = `<i class="fas fa-dot-circle"></i>`;
    message_profile_image.append(elem);
    message_profile_image.append(green_dot_for_message);

    let chat_message_content = document.createElement("div");
    chat_message_content.classList.add("chat-message-content");

    let chat_message_content_user_name = document.createElement("div");
    chat_message_content_user_name.classList.add("chat-message-content-user-name");
    chat_message_content_user_name.innerHTML = userObj.userObj.User;
    let num = Math.floor( Math.random() * color.length );
    chat_message_content_user_name.style.color = color[num];

    let chat_message_content_user_message = document.createElement("div");
    chat_message_content_user_message.classList.add("chat-message-content-user-message");
    chat_message_content_user_message.innerHTML = userObj.userObj.chatMessage;

    let time_delete = document.createElement("div");
    time_delete.classList.add("time-delete");

    let  delete_icon= document.createElement("div");
    delete_icon.classList.add("delete-icon");
    delete_icon.classList.add(sender);
    delete_icon.innerHTML=`<i class="fa fa-trash" aria-hidden="true"></i>`

    delete_icon.addEventListener("click",function(){
        socket.emit("chat-deleted" , userObj.userObj.string );
        delete_icon.parentNode.parentNode.parentNode.remove();
    });

    let time = document.createElement("div");
    time.classList.add("time");
    time.innerHTML=userObj.userObj.string;

    time_delete.append(delete_icon);
    time_delete.append(time);

    chat_message_content.append(chat_message_content_user_name);
    chat_message_content.append(chat_message_content_user_message);
    chat_message_content.append(time_delete);

    // let chatName = document.createElement("div");
    // chatName.classList.add("chat-name");
    // chatName.innerHTML = userObj.User;

    // let chatText = document.createElement("div");
    // chatText.classList.add("chat-message");
    // chatText.innerHTML = userObj.chatMessage;
    
    // let chatTime = document.createElement("div");
    // chatTime.classList.add("time-of-text");
    // chatTime.innerHTML = userObj.string;
    // let options = document.createElement("div");
    // options.classList.add("options");
    // options.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    // options.addEventListener("click",function(){
    //     console.log(options.parentNode)
    //     socket.emit("chat-deleted" , userObj.string );
    //     options.parentNode.remove();
    // })
    chatDiv.append(message_profile_image);
    chatDiv.append(chat_message_content);
    // chatDiv.append(options);
    chatBox.append(chatDiv);
    chatBox.scrollTop  =  chatBox.scrollHeight;
}
