from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(title="Sentiment Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading model for API...")
sentiment_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")


class ReviewRequest(BaseModel):
    text: str


@app.post("/predict")
def predict_sentiment(request: ReviewRequest):
    prediction = sentiment_model(request.text)[0]

    return {
        "text": request.text,
        "label": prediction["label"],
        "score": round(prediction["score"], 4),
    }


@app.get("/")
def health_check():
    return {"status": "API is running"}