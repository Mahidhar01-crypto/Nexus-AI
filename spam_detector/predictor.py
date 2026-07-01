import os
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PROJECT_DIR = os.path.dirname(BASE_DIR)

MODEL_PATH = os.path.join(PROJECT_DIR, "models", "spam_model.pkl")

VECTORIZER_PATH = os.path.join(PROJECT_DIR, "models", "vectorizer.pkl")

model = joblib.load(MODEL_PATH)

vectorizer = joblib.load(VECTORIZER_PATH)

# ==========================================
# Prediction Function
# ==========================================

def predict_message(message):

    message = message.strip()

    if message == "":

        return "Empty Message", 0

    vector = vectorizer.transform([message])

    prediction = model.predict(vector)[0]

    probability = model.predict_proba(vector)

    confidence = round(max(probability[0]) * 100, 2)

    if prediction == 1:

        return "Spam", confidence

    return "Not Spam", confidence