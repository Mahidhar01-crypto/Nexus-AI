from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import re
import os

# Spam Detector Modules
from spam_detector.predictor import predict_message
from spam_detector.extract_text import extract_text

# ============================================
# Flask App
# ============================================

app = Flask(
    __name__
)

app.config["UPLOAD_FOLDER"] = "uploads"

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)



import os

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# ============================================
# Response Formatter
# ============================================

def format_response(text):

    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)

    text = re.sub(r"\*(.*?)\*", r"\1", text)

    text = re.sub(r"```", "", text)

    text = re.sub(r"#", "", text)

    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()

# ============================================
# Website Routes
# ============================================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")


@app.route("/spam")
def spam():
    return render_template("spam.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


# ============================================
# Gemini Chatbot API
# ============================================

@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "response": "Please enter a message."
        })

    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "system",
                    "content": "You are Nexus AI, a helpful, intelligent, and professional AI assistant."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],

            temperature=0.7,

            max_tokens=1024

        )

        answer = response.choices[0].message.content

        return jsonify({
            "response": answer
        })

    except Exception as e:

        return jsonify({
            "response": f"Error: {str(e)}"
        })


# ============================================
# Spam Detection
# ============================================

@app.route("/predict_spam", methods=["POST"])
def predict_spam():

    # --------------------------
    # TEXT INPUT
    # --------------------------

    if "message" in request.form:

        message = request.form["message"]

        prediction, confidence = predict_message(message)

        return jsonify({

            "prediction": prediction,

            "confidence": confidence,

            "text": message

        })

    # --------------------------
    # FILE INPUT
    # --------------------------

    if "file" in request.files:

        file = request.files["file"]

        if file.filename == "":

            return jsonify({

                "error": "Please select a file."

            })

        path = os.path.join(

            app.config["UPLOAD_FOLDER"],

            file.filename

        )

        file.save(path)

        extracted_text = extract_text(path)

        prediction, confidence = predict_message(extracted_text)

        return jsonify({

            "prediction": prediction,

            "confidence": confidence,

            "text": extracted_text

        })

    return jsonify({

        "error": "Invalid Request"

    })


# ============================================
# Future AI Tools
# ============================================

@app.route("/writer")
def writer():

    return render_template("writer.html")


@app.route("/image")
def image():

    return render_template("image.html")


@app.route("/translator")
def translator():

    return render_template("translator.html")


@app.route("/pdf_chat")
def pdf_chat():

    return render_template("pdf_chat.html")


# ============================================
# 404 Page
# ============================================

@app.errorhandler(404)
def page_not_found(error):

    return render_template("404.html"), 404


# ============================================
# Run App
# ============================================

if __name__ == "__main__":

    app.run(debug=True)