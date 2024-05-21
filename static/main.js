const imgElement = document.getElementById("imgElement")
const canvasElement = document.getElementById("canvasOutput")
const videoElement = document.getElementById("videoElement")
const FPS = 1
window.onload = function () {
    let consent = confirm("是否引許開啟攝像機")
    if (consent) {
        startCamera()
        sendImage()
    } else {
        console.log("用戶拒絕了許可")
    }
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });// 開啟攝像機
        videoElement.srcObject = stream;// 將攝像機數據傳入video元素
    } catch (err) {
        console.error('無法訪問攝像機:', err);
    }
}

function sendImage() {
    setInterval(async () => {
        var context = canvasElement.getContext("2d")
        canvasElement.width = videoElement.videoWidth
        canvasElement.height = videoElement.videoHeight

        context.drawImage(
            videoElement,
            0,
            0,
            canvasElement.width,
            canvasElement.height
        )
        var imageData = canvasElement.toDataURL("image/jepg")
        var formData = new FormData()
        formData.append("image", imageData)
        let res = await fetch("/upload", {
            method: "POST",
            body: formData,
        })
        const recognizedImage = await res.text()
        const imgElement = document.getElementById("imgElement")
        imgElement.src = "data:image/jpeg;base64," + recognizedImage
    }, 1000 / FPS)
}

async function ask_question() {
    const intputElement = document.getElementById("inputElement")
    const messageBox = document.getElementById("messageBox")

    var formData = new FormData()
    formData.append("question", intputElement.value)
    let res = await fetch("/ask_question", {
        method: "POST",
        body: formData,
    })
    const message = await res.text()
    console.log(message)

    messageBox.innerHTML = message
}

async function ask_button_question(button_question) {
    console.log(button_question)
    const messageBox = document.getElementById("messageBox")

    var formData = new FormData()
    formData.append("question", button_question)
    let res = await fetch("/ask_question", {
        method: "POST",
        body: formData,
    })
    const message = await res.text()
    console.log(message)

    messageBox.innerHTML = message
}