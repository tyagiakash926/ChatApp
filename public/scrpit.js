let chat = document.querySelector("#chat-input");
let chatUser = document.querySelector("#chat-user");
let chatInputDiv = document.querySelector(".chat-input");
let send = document.querySelector("#send");
let chatBox = document.querySelector("#chatBox");
let bChatBox = document.querySelector(".chat-box-message")
let emojiInput = document.querySelector(".emojionearea-editor");
let joinChat = document.querySelector("#join-btn");
let joinFrom = document.querySelector(".join-chat-form");


// now profile work!!! Active user
var nameofUser = document.querySelector("#name");
let activeUser = document.querySelector("#active-user-status");
let SactiveUser = document.querySelector(".active-user-no");
let BactiveUser = document.querySelector(".active-user");

// now work on profile page

var ProfilePage = document.querySelector(".profile-container");
var ChatBoxContent = document.querySelector(".chat-box-content");
var templateProfile = document.querySelector(".profile-container-template");
var whiteboardTemplate = document.querySelector(".whiteboard-template");
var whiteboardTemplateBtn = document.querySelector(".whiteboard-template-btn");


// canvas:::
let closeWhiteBoard = document.getElementById("close-whiteboard");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // contex object which have functions to draw on canvas
canvas.height = 510.56;
canvas.width = 256;
ctx.lineWidth = 5;
ctx.fillStyle = 'black';
//x-axis , y-axis , length , breadth
// ctx.fillRect(10, 10, 150, 100);
//draw a line
// ctx.strokeStyle = "red";
// ctx.lineWidth = 5;
// ctx.beginPath();
// ctx.moveTo(0,0);
// ctx.lineTo(1,10);
// ctx.lineTo(50,50);
// ctx.stroke();
let points = [];
let redoPoints = [];
let isPenDown = false;
let line = [];
//top=64
canvas.addEventListener("mousedown", function (e) {
    isPenDown = true;
    redoPoints = [];
    let { top } = canvas.getBoundingClientRect();
    let x = e.clientX-896;
    let y = e.clientY - top;
    // console.log(`X ${x} , Y ${y}`);
    ctx.beginPath();
    ctx.moveTo(x, y);
    let point = {
        id : "md",
        x : x,
        y : y,
        penColor: ctx.strokeStyle,
        penWidth : ctx.lineWidth,
    }
    line.push(point);
    socket.emit("mousedown" , point);
})
canvas.addEventListener("mousemove", function(e){
    if (isPenDown) {
        // console.log(isPenDown);
        let { top } = canvas.getBoundingClientRect();
        let x = e.clientX-896;
        let y = e.clientY - top;
        ctx.lineTo(x, y);
        ctx.stroke();
        let point = {
            id : "mm",
            x : x,
            y : y,
            penColor: ctx.strokeStyle,
            penWidth : ctx.lineWidth,
        }
        line.push(point);
        socket.emit("mousemove" , point);
    }
});

canvas.addEventListener("mouseup", function () {
    isPenDown = false;
    points.push(line);
    console.log(line);
    console.log(points);
    line = []; // new 
});


let undo = document.querySelector("#undo");
let redo = document.querySelector("#redo");
let pencil = document.querySelector("#pencil");
let eraser = document.querySelector("#eraser");
closeWhiteBoard.addEventListener("click",function(){
    whiteboardTemplate.classList.remove("active");
})
undo.addEventListener("click", function () {
    // console.log(points);
    removeLine();
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // redraw function
    redraw();
});
function removeLine() {
    if (points.length) {
      redoPoints.push(points.pop());
      socket.emit("undo" , points );
    //   let bg =  backGround;
    //   socket.emit("undo" ,{ points , bg});
    }
}
function redraw() {
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
}
redo.addEventListener("click", function () {
    // redoPoints.pop();
    if (redoPoints.length) {
      let lineToBeDrawn = redoPoints.pop();
      // line push to points
      points.push(lineToBeDrawn);
      // redraw last line in points
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
      socket.emit("redo" , lineToBeDrawn );
      
    }
});
pencil.addEventListener("click", function () {
    eraser.classList.remove("active-tool");
    pencil.classList.add("active-tool");
    ctx.lineWidth = "5";
    ctx.strokeStyle = "black";
});

eraser.addEventListener("click", function () {
    eraser.classList.add("active-tool");
    pencil.classList.remove("active-tool");
    ctx.lineWidth = "10";
    ctx.strokeStyle = "#c39aeb";
});
  



/////////////////////////////////////////////////////////////////////////////////

function updateActiveUser(ALLUSERS){
    // console.log(ALLUSERS);
    document.getElementById("active-user-status").remove(); 
    addactive(ALLUSERS);
}

whiteboardTemplateBtn.addEventListener("click",function(){
    whiteboardTemplate.classList.add("active");
})
// let name = prompt("Enter Your Name");
let User;
joinChat.addEventListener("click",function(){
    User = chatUser.value;
    if(User){
        nameofUser.innerHTML = User;
        ProfilePage.classList.add("active");
        ChatBoxContent.classList.remove("main");
        ChatBoxContent.classList.add("active");
        whiteboardTemplateBtn.classList.remove("nosee");
        templateProfile.classList.add("active");
        socket.emit("join-chat" , User);
        
        // if(users){
        //     console.log("intial",users);
        //     let AllNames = [];
        //     let any = users.filter(function(userObj){
        //         AllNames.push(userObj.name);
        //     })
        //     console.log(AllNames);
        //     document.getElementById("active-user-status").remove(); 
        //     addactive(AllNames);
        // }
        joinFrom.classList.add("hide");
        chatBox.classList.remove("hide");
        chatInputDiv.classList.remove("hide");
    }
})

send.addEventListener("click",function(){
    let chatMessage = chat.value;
    var d = new Date(); // for now
    var hour = d.getHours(); // => 9
    var min = d.getMinutes(); // =>  30
    var sec = d.getSeconds(); // => 51
    var string = hour +":"+min+":"+sec;
    if(chatMessage){
        socket.emit("chat-send" , {User , chatMessage , string} );
        addChat("right" , {User , chatMessage , string});
        chatBox.scrollTop  =  chatBox.scrollHeight;
        chatMessage.value = "";
        // console.log(document.querySelector(".emojionearea-editor").textContent); 
        document.querySelector(".emojionearea-editor").textContent = "";
    }
})

function addactive(ALLUSERS){
    let activeStatus = document.createElement("div");
    activeStatus.classList.add("active-user-status");
    activeStatus.setAttribute("id","active-user-status");
    for(let i=0;i<ALLUSERS.length;i++){
        let joinDiv = document.createElement("div");
        joinDiv.classList.add("name");
        joinDiv.setAttribute("id",ALLUSERS[i]);
        joinDiv.innerHTML = ALLUSERS[i];
        activeStatus.append(joinDiv);
    }
    BactiveUser.append(activeStatus);
}

