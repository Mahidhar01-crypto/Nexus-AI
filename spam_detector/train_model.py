import os

import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

# ==========================================
# Load Dataset
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET = os.path.join(BASE_DIR, "spam.csv")

df = pd.read_csv(DATASET, encoding="latin-1")

# ==========================================
# Clean Dataset
# ==========================================

df = df.drop(
    columns=[
        "Unnamed: 2",
        "Unnamed: 3",
        "Unnamed: 4"
    ]
)

df.columns = [
    "label",
    "message"
]

# ==========================================
# Convert Labels
# ==========================================

df["label"] = df["label"].map({
    "ham": 0,
    "spam": 1
})

# ==========================================
# Features
# ==========================================

X = df["message"]

y = df["label"]

# ==========================================
# TF-IDF
# ==========================================

vectorizer = TfidfVectorizer(
    stop_words="english"
)

X = vectorizer.fit_transform(X)

# ==========================================
# Split Dataset
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.2,

    random_state=42

)

# ==========================================
# Train Model
# ==========================================

model = MultinomialNB()

model.fit(
    X_train,
    y_train
)

# ==========================================
# Accuracy
# ==========================================

prediction = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    prediction
)

print("\nModel Accuracy")

print(round(accuracy * 100,2),"%")

# ==========================================
# Save Model
# ==========================================

# ==========================================
# Save Model
# ==========================================

PROJECT_DIR = os.path.dirname(BASE_DIR)

MODELS_DIR = os.path.join(PROJECT_DIR, "models")

os.makedirs(MODELS_DIR, exist_ok=True)

joblib.dump(
    model,
    os.path.join(MODELS_DIR, "spam_model.pkl")
)

joblib.dump(
    vectorizer,
    os.path.join(MODELS_DIR, "vectorizer.pkl")
)

print("\nModel Saved Successfully")

print(os.path.join(MODELS_DIR, "spam_model.pkl"))

print(os.path.join(MODELS_DIR, "vectorizer.pkl"))