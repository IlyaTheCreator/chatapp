import path from "path"
import http from "http"
import express from "express"
import { Server } from "socket.io"


const __dirname = path.resolve(path.dirname(''));
console.log(__dirname)
const publicPath = path.join(__dirname, "/public")
const PORT = process.env.PORT || 3000;
const app = express()
const server = http.createServer(app)
const io = new Server(server)

let numberOfUsers = 0
let requiredNumberOfUsers = 0
let isAdminHere = false
let runGoing = true

io.on("connection", socket => {

    let sequenceNumberByClient = new Map();
    
    const startTheRun = () => {
        if (runGoing) {
            for (let i = 1; i <= requiredNumberOfUsers; i++) {
                setTimeout(() => {
                    io.sockets.to(i).emit("run")
                    // io.emit("run", { id: i})
        
                    if (i == requiredNumberOfUsers) {
                        startTheRun()
                    }
                }, 1000)
            }
        }
    }

    socket.on("userEntered", () => {
        numberOfUsers += 1

        if (numberOfUsers <= requiredNumberOfUsers) {
            socket.emit("userPage", {users: numberOfUsers})
            console.log("user just got in")

            if (numberOfUsers < requiredNumberOfUsers) {
                io.emit("wait", {
                    numberOfUsers: numberOfUsers,
                    requiredNumberOfUsers: requiredNumberOfUsers
                })
            } else {
                console.log("let's go!")
                io.emit("showStopRunBtn")

                startTheRun()
            }
        } else {
            socket.emit("getOut")
            console.log("get out")
        }
    })

    socket.on("adminEntered", () => {
        if (isAdminHere) {
            socket.emit("disableAdminBtn")
        } else {
            socket.emit("adminPage")
        }
    })

    socket.on("signinAdmin", (data) => {
        if (data.login == "111" && data.password == "111") {
            isAdminHere = true
            console.log("admin just got in")

            socket.emit("showAdminPage")

            socket.on("setNumberOfUsers", function(users) {
                requiredNumberOfUsers = users
                console.log(`Будет ${requiredNumberOfUsers} пользователей`)
            })
        } else {
            socket.emit("wrongAdmin")
        }
    })

    socket.on("stopTheRun", function() {
        console.log("stopped the loop")
        runGoing = false
    })

    setInterval(() => {
        for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
            client.emit("seq-num", sequenceNumber);
            sequenceNumberByClient.set(client, sequenceNumber + 1);
        }
    }, 1000);

    // console.log("A new user just connected");

    // socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app!"))
    // socket.broadcast.emit("newMessage",  generateMessage("Admin", "New user joined"))


    // // socket.emit("newMessage", {
    // //     from: "iluha",
    // //     text: "hello, I'm iluha!"
    // // })

    // socket.on("createMessage", (message, callback) => {
    //     console.log(`createMessage: ${message.text}`);

    //     // broadcasting:
    //     io.emit("newMessage", generateMessage(message.from, message.text))
    //     // broadcast to all other people and not for me
    //     // socket.broadcast.emit("newMessage", generateMessage(message.from, message.text))

    //     callback("this is the server") // this runs in the browser 
    //     // the callback from socket.emit() // 3rd argument
    // })

    // socket.on("disconnect", () => {
    //     console.log("User was disconnected");
    // })
})



app.use(express.static(publicPath))

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})