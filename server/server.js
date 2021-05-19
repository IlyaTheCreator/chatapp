const path = require("path")
const http = require("http")
const express = require("express")
const socketIO = require("socket.io")

const publicPath = path.join(__dirname, "/../public")
const PORT = process.env.PORT || 3000;
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

io.on("connection", socket => {
    console.log("A new user just connected");

    // socket.emit("newMessage", {
    //     from: "iluha",
    //     text: "hello, I'm iluha!"
    // })

    socket.on("createMessage", message => {
        console.log(`createMessage: ${message.text}`);

        // broadcasting:
        io.emit("newMessage", {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    })

    socket.on("disconnect", () => {
        console.log("User was disconnected");
    })
})

app.use(express.static(publicPath))

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})