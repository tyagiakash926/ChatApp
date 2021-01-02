let express = require('express');
let app = express();
const cors = require('cors')
app.use(cors())
app.use(express.static('public'));
let users = [];
const http = require("http").createServer(app);
const io = require('socket.io')(http,{cors:{
    origin:"*",
}});
app.get('/', (req, res) => {
  res.redirect(__dirname + '/public/index.html');
});
let profile_image_array = ["./images/pexels-anna-shvets-3771639.jpg" , "./images/pexels-ayaka-kato-2860897.jpg" , "./images/pexels-maxime-francis-2246476.jpg" , "./images/pexels-nick-bondarev-4348099.jpg", "./images/pexels-sumit-kapoor-718261.jpg","./images/pexels-wallace-chuck-4580470.jpg"];
io.on('connection', function(socket){
    console.log(`${socket.id} connected`);
    socket.on("join-chat",function(name){
        users.push({   id:socket.id ,  name , image:profile_image_array[Math.floor(Math.random()*profile_image_array.length)]});
        socket.broadcast.emit("user-joined" , {name,users});
        socket.emit("update-active-list-user",{name,users});
        
    })
    // socket.on("active-list" ,function(a){
    //     let AllNames = []
    //     let any = users.filter(function(userObj){
    //         AllNames.push(userObj.name);
    //     })
    //     console.log(AllNames)
    //     socket.broadcast.emit("get-active-list",AllNames);
    // });
    socket.on("chat-send" , function(userObj){
        let User = userObj.User;
        let selcted = users.filter( function(userObj){
            return userObj.name == User;
        });
        let image = selcted[0].image;
        socket.broadcast.emit("receive-chat" , {userObj:userObj , audio: './public/images/bloom.mp3' , image:image});
    })
    socket.on("chat-deleted" , function(d){
        console.log(d);
        socket.broadcast.emit("deleted-chat-message" , d);
    })

    socket.on("mousedown" , function(point){
        socket.broadcast.emit("md" , point);
    })
    socket.on("mousemove" , function(point){
        socket.broadcast.emit("mm" , point);
    })
    socket.on("undo" , function(points){
        socket.broadcast.emit("undoPoint" , points);
    })
    socket.on("redo" , function(lineToBeDrawn){
        socket.broadcast.emit("redoPoint" , lineToBeDrawn);
    })

    socket.on("disconnect" , function(){
        
        let user = users.filter( function(userObj){
            return userObj.id == socket.id;
        });
        console.log(user[0]);
        if(user){
            socket.broadcast.emit("leave" , user[0].name );
        }
        users = users.filter(function(userObj){
            return userObj.id != socket.id;
        })
    })
})
// let port = process.env.PORT || 3000;

http.listen(3000, () => {
  console.log('listening on *:3000');
});


