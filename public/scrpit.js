
var whiteboardTemplate = document.querySelector(".whiteboard-template");
var whiteboardTemplateBtn = document.querySelector(".whiteboard-template-btn");


// canvas:::
let closeWhiteBoard = document.getElementById("close-whiteboard");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // contex object which have functions to draw on canvas
canvas.height = 488;
canvas.width = 245;
ctx.lineWidth = 5;
ctx.fillStyle = 'black';
ctx.strokeStyle = '#bdc3c7';
let points = [];
let redoPoints = [];
let isPenDown = false;
let line = [];
//top=64
canvas.addEventListener("mousedown", function (e) {
    isPenDown = true;
    redoPoints = [];
    let { top } = canvas.getBoundingClientRect();
    let x = e.clientX-903;
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
        let x = e.clientX-903;
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
    whiteboardTemplate.classList.remove("hide");
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
    ctx.strokeStyle = "#bdc3c7";
});

eraser.addEventListener("click", function () {
    eraser.classList.add("active-tool");
    pencil.classList.remove("active-tool");
    ctx.lineWidth = "10";
    ctx.strokeStyle = "#1C1F25";
});
  



// /////////////////////////////////////////////////////////////////////////////////

function updateActiveUser(ALLUSERS){
    // console.log(ALLUSERS);
    document.getElementById("lower-section-of-profile").remove(); 
    addactive(ALLUSERS);
}

whiteboardTemplateBtn.addEventListener("click",function(){
    whiteboardTemplate.classList.add("active");
    whiteboardTemplate.classList.add("hide");
})
// let name = prompt("Enter Your Name");
// joinChat.addEventListener("click",function(){
//     User = chatUser.value;
//     if(User){
//         nameofUser.innerHTML = User;
//         ProfilePage.classList.add("active");
//         ChatBoxContent.classList.remove("main");
//         ChatBoxContent.classList.add("active");
//         whiteboardTemplateBtn.classList.remove("nosee");
//         templateProfile.classList.add("active");
//         socket.emit("join-chat" , User);
        
//         // if(users){
//         //     console.log("intial",users);
//         //     let AllNames = [];
//         //     let any = users.filter(function(userObj){
//         //         AllNames.push(userObj.name);
//         //     })
//         //     console.log(AllNames);
//         //     document.getElementById("active-user-status").remove(); 
//         //     addactive(AllNames);
//         // }
//         joinFrom.classList.add("hide");
//         chatBox.classList.remove("hide");
//         chatInputDiv.classList.remove("hide");
//     }
// })

// send.addEventListener("click",function(){
//     let chatMessage = chat.value;
//     var d = new Date(); // for now
//     var hour = d.getHours(); // => 9
//     var min = d.getMinutes(); // =>  30
//     var sec = d.getSeconds(); // => 51
//     var string = hour +":"+min+":"+sec;
//     if(chatMessage){
//         socket.emit("chat-send" , {User , chatMessage , string} );
//         addChat("right" , {User , chatMessage , string});
//         chatBox.scrollTop  =  chatBox.scrollHeight;
//         chatMessage.value = "";
//         // console.log(document.querySelector(".emojionearea-editor").textContent); 
//         document.querySelector(".emojionearea-editor").textContent = "";
//     }
// })
let profile_image_array = ["./images/pexels-anna-shvets-3771639.jpg" , "./images/pexels-ayaka-kato-2860897.jpg" , "./images/pexels-maxime-francis-2246476.jpg" , "./images/pexels-nick-bondarev-4348099.jpg", "./images/pexels-sumit-kapoor-718261.jpg","./images/pexels-wallace-chuck-4580470.jpg"];
let color = ["#1abc9c" , "#f1c40f" ,"#9b59b6" ,"#81ecec" ,"#e84393" ,"#30336b"];
function addactive(ALLUSERS){
    let activeStatus = document.createElement("div");
    activeStatus.classList.add("lower-section-of-profile");
    activeStatus.setAttribute("id","lower-section-of-profile");
    for(let i=0;i<ALLUSERS.length;i++){
        let user_name_profile = document.createElement("div");
        user_name_profile.classList.add("user-name-profile");
        user_name_profile.setAttribute("id",`${ALLUSERS[i].name}`);
        let profile_image = document.createElement("div");
        profile_image.classList.add("profile-image");
        profile_image.innerHTML = `<img src="${ALLUSERS[i].image}" alt="">`
        let user_name = document.createElement("div");
        user_name.classList.add("user-name");
        let h_1 = document.createElement("h1");
        h_1.innerHTML = ALLUSERS[i].name;
        let p = document.createElement("p");
        p.innerHTML = `no Data breach more secure`;
        user_name.append(h_1);
        user_name.append(p);
        user_name_profile.append(profile_image);
        user_name_profile.append(user_name);
        activeStatus.append(user_name_profile);
    }
    container_b_1_2.append(activeStatus);
}



/////////////////////////////////////////////////////////////////////////////////////
let join_chat_input = document.querySelector(".name-for-join-chat");
let join_chat_button = document.querySelector(".a-heading-4-2");
let container_a = document.querySelector(".container-a");
let container_b = document.querySelector(".container-b");
let chatBox = document.querySelector("#chatBox");
let chat_message = document.querySelector("#chat-input");
let chat_message_send = document.querySelector("#send");
let container_b_1_2 = document.querySelector(".container-b-1-2");
let chat = document.querySelector("#chat-input");

let User;
join_chat_button.addEventListener("click",function(){
    User = join_chat_input.value;
    if(User){
        whiteboardTemplateBtn.classList.remove("nosee");
        container_a.classList.add("hide");
        container_a.classList.add("active");
        container_b.classList.remove("hide");
        container_b.classList.add("active");
        socket.emit("join-chat" , User);
    }
})
chat_message_send.addEventListener("click",function(){
    let chatMessage = chat.value;
    // console.log(chatMessage);
    var d = new Date(); // for now
    var hour = d.getHours(); // => 9
    var min = d.getMinutes(); // =>  30
    var sec = d.getSeconds(); // => 51
    var string = hour +":"+min+":"+sec;
    if(chatMessage){
        socket.emit("chat-send" , {User, chatMessage , string} );
        let imagelink = document.getElementById(User).firstElementChild.firstChild.src
        let userObj = {User , chatMessage , string}
        addChat("right" , {userObj:userObj , image:imagelink});
        chatBox.scrollTop  =  chatBox.scrollHeight;
        chatMessage.value = "";
        // // console.log(document.querySelector(".emojionearea-editor").textContent); 
        document.querySelector(".emojionearea-editor").textContent = "";
    }
})
