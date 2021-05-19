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

    socket.on("disconnect", () => {
        console.log("User was disconnected");
    })
})

app.use(express.static(publicPath))

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})