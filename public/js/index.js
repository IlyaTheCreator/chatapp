const socket = io()

socket.on("connect", function () {
    console.log("Connected to server")

    // socket.emit("createMessage", {
    //     from: "iluha",
    //     text: "hello, I'm iluha!"
    // })
})

socket.on("disconnect", function () {
    console.log("Disconnected from server");
})

socket.on("newMessage", function (message) {
    document.querySelector("h1").innerText = message.text;
})