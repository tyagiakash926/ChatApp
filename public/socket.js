socket.on("user-joined", function (nameAndUsers) {
   // <div class="chat join">steve joined the chat</div>
   let joinDiv = document.createElement("div");
   joinDiv.classList.add("chat");
   joinDiv.classList.add("join");
   joinDiv.innerHTML = `${nameAndUsers.name} joined the chat`;
   chatBox.append(joinDiv);
   let AllNames = []
    let any = nameAndUsers.users.filter(function(userObj){
        AllNames.push(userObj.name);
    })
   updateActiveUser(AllNames);
})
socket.on("update-active-list-user", function (nameAndUsers) {
    let AllNames = []
    let any = nameAndUsers.users.filter(function(userObj){
        AllNames.push(userObj.name);
    })
   updateActiveUser(AllNames);
})

socket.on("receive-chat", function (userObj) {
    addChat("left", userObj);
});

socket.on("deleted-chat-message", function (userObj) {
    console.log(userObj);
    document.getElementById(userObj).remove();
    var d = new Date(); // for now
    var hour = d.getHours(); // => 9
    var min = d.getMinutes(); // =>  30
    var sec = d.getSeconds(); // => 51
    let deletedDiv = document.createElement("div");
    deletedDiv.classList.add("deleted-chat-showcase");
    deletedDiv.classList.add("left");
    deletedDiv.innerHTML = `<i class="fa fa-ban" aria-hidden="true"></i>  This message was deleted`;
    let timeDiv = document.createElement("div");
    timeDiv.innerHTML = `${hour}:${min}`;
    timeDiv.classList.add("deleted-time");

    deletedDiv.append(timeDiv);
    chatBox.append(deletedDiv);
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

    let chatDiv = document.createElement("div");
    chatDiv.classList.add("chat");
    chatDiv.classList.add(sender);
    // var d = new Date(); // for now
    chatDiv.setAttribute("id",userObj.string);

    let chatName = document.createElement("div");
    chatName.classList.add("chat-name");
    chatName.innerHTML = userObj.User;

    let chatText = document.createElement("div");
    chatText.classList.add("chat-message");
    chatText.innerHTML = userObj.chatMessage;
    
    let chatTime = document.createElement("div");
    chatTime.classList.add("time-of-text");
    chatTime.innerHTML = userObj.string;
    let options = document.createElement("div");
    options.classList.add("options");
    options.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    options.addEventListener("click",function(){
        console.log(options.parentNode)
        socket.emit("chat-deleted" , userObj.string );
        options.parentNode.remove();
    })
    chatDiv.append(chatName);
    chatDiv.append(chatText);
    chatDiv.append(chatTime);
    
    chatDiv.append(options);
    
    
    
    // console.log("HIII");
    // console.log(chatMessage);

    chatBox.append(chatDiv);
    chatBox.scrollTop  =  chatBox.scrollHeight;
}
