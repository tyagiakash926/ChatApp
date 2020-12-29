let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static('public'));
let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    console.log(`${socket.id} connected`);
    socket.on("join-chat",function(name){
        users.push({   id:socket.id ,  name});
        // console.log(users);
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
        socket.broadcast.emit("receive-chat" , userObj);
    })

    socket.on("chat-deleted" , function(d){
        console.log("app.js",d);
        socket.broadcast.emit("deleted-chat-message" , d);
    })

    socket.on("mousedown" , function(point){
        // console.log("")
        socket.broadcast.emit("md" , point);
    })
    socket.on("mousemove" , function(point){
        // console.log("")
        socket.broadcast.emit("mm" , point);
    })
    socket.on("undo" , function(points){
        // console.log(points);
        socket.broadcast.emit("undoPoint" , points);
    })
    socket.on("redo" , function(lineToBeDrawn){
        // console.log("")
        socket.broadcast.emit("redoPoint" , lineToBeDrawn);
    })

    socket.on("disconnect" , function(){
        
        let user = users.filter( function(userObj){
            return userObj.id == socket.id;
        });
        
        // [ {id:1234124124 , name:"asidhfaus"} ]
        console.log(user[0]);

        if(user){
            socket.broadcast.emit("leave" , user[0].name );
        }

        users = users.filter(function(userObj){
            return userObj.id != socket.id;
        })
    })
})

http.listen(3000, () => {
  console.log('listening on *:3000');
});


