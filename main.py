from flask import Flask, render_template, request
import base64
from PIL import Image
from io import BytesIO
from prediction import predict
import cv2
import ollama

app = Flask(__name__)  # Create an instance of the Flask class


@app.route("/")
async def index():
    return render_template("index.html")


@app.route("/upload/", methods=["POST"])
async def upload():
    file_ = request.form["image"]
    base64_string = file_.replace("data:image/png;base64,", "")
    image_bytes = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_bytes))
    image = image.convert("RGB")
    image.save("./temp/temp.jpg")

    img = predict(
        image_path="./temp/temp.jpg", weights="best.pt", data="./502525-2.yaml"
    )
    cv2.imwrite("./temp/predict.jpg", img)
    retval, buffer = cv2.imencode(".jpg", img)
    base64_encoded_img = base64.b64encode(buffer)
    return base64_encoded_img


@app.route("/ask_question/", methods=["POST"])
async def ask_question():
    question = request.form["question"]
    print("=====================================")
    print(question)
    with open("./temp/outcomes.txt", "r") as f:
        deer = f.readline()
    print(deer)
    deer_list = {
        "Formosan Sambar": "台灣水鹿",
        "Formosan sika deer": "台灣梅花鹿",
        "White-tailed deer": "白尾鹿",
        "moose": "駝鹿",
        "male": "鹿",
        "female": "鹿",
    }
    response = ollama.chat(
        model="gemma:7b",
        messages=[
            {
                "role": "user",
                "content": f"請簡要説明，{deer_list[deer]}的" + question,
            },
        ],
    )

    return response["message"]["content"].replace("*", "")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="8051", debug=True)
