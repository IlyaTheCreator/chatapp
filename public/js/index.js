const socket = io()
let myNumber = 0
let isAdmin = false

const title = document.getElementById("title")
const content = document.getElementById("content")

function displayAdminPageLogin() {
    isAdmin = true
    title.innerText = "Admin's page"
    content.innerHTML = ""

    const wrapper = document.createElement("div")
    wrapper.classList.add("admin-form-wrapper")

    const login = document.createElement("input")
    login.type = "text"
    login.placeholder = "Логин"

    const password = document.createElement("input")
    password.type = "password"
    password.placeholder = "Пароль"

    const btn = document.createElement("button")
    btn.innerText = "Войти"

    btn.addEventListener("click", () => {
        socket.emit("signinAdmin", {
            login: login.value,
            password: password.value
        })
    })

    wrapper.appendChild(login)
    wrapper.appendChild(password)
    wrapper.appendChild(btn)

    content.appendChild(wrapper)
}

function selectWhoYouAre() {
    title.innerText = "Выбери, кто ты:"

    const btn1 = document.createElement("button")
    const btn2 = document.createElement("button")

    btn1.innerText = "админ"
    btn2.innerText = "шрек"

    btn1.addEventListener("click", () => {
        socket.emit("adminEntered")
    })

    btn2.addEventListener("click", () => {
        socket.emit("userEntered")
    })

    content.appendChild(btn1)
    content.appendChild(btn2)
}

socket.on("connect", function() {
    selectWhoYouAre()

    socket.on("disableAdminBtn", function() {
        // it disables the button somehow
        console.log(content.childNodes[1])
    })

    socket.on("userPage", function(data) {
        myNumber = data.users
        title.innerText = "User's page"

        content.innerHTML = ""

        socket.on("wait", function(data) {
            title.innerText = `Собрано ${data.numberOfUsers} из ${data.requiredNumberOfUsers} пользователей`
            content.innerHTML = ""
        })
    })

    socket.on("adminPage", function() {
        displayAdminPageLogin()

        socket.on("showAdminPage", function() {
            console.log("empty")
            content.innerHTML = ""

            const input = document.createElement("input")
            input.type = "text"
            input.placeholder = "Количество пользователей"

            const btn = document.createElement("button")
            btn.innerText = "задать"

            btn.addEventListener("click", () => {
                socket.emit("setNumberOfUsers", parseInt(input.value))
                input.value = ""
            })

            content.innerHTML = ""
            content.appendChild(input)
            content.appendChild(btn)
        })

        socket.on("wrongAdmin", function() {
            displayAdminPageLogin()
            title.innerText = "Неверный логин/пароль"
        })
    })
})

socket.on("getOut", function() {
    title.innerText = "Пошел отсюда! (так надо)"

    content.innerHTML = ""
})

socket.on("run", function(data) {
    // if (data == myNumber) {
        console.log(data, myNumber)

        const header = document.createElement("h1")

        header.innerText = "me!"
        header.id = "loop-header"

        document.querySelector("body").appendChild(header)

        setTimeout(() => {
            document.getElementById("loop-header").remove()
        }, 1000)
    // }
})

socket.on("showStopRunBtn", function(data) {
    if (isAdmin) {
        const btn = document.createElement("button")
        btn.innerText = "стоп"

        btn.addEventListener("click", () => {
            socket.emit("stopTheRun")
        })

        content.appendChild(btn)
    }
})

socket.on("seq-num", function(data) {
    console.log(data)
})

// socket.on("connect", function() {
//     console.log("Connected to server")

//     // socket.emit("createMessage", {
//     //     from: "iluha",
//     //     text: "hello, I'm iluha!"
//     // })
// })

// socket.on("disconnect", function() {
//     console.log("Disconnected from server");
// })

// socket.on("newMessage", function(message) {
//     console.log(message)
// })

// socket.emit("createMessage", {
//     from: "Iluha",
//     text: "Hello from iluha!"
// }, function(message) {
//     console.log(message + ". Server's got it.")
// })