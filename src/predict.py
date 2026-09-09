from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This grabs your secure token from Render
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"

class TextRequest(BaseModel):
    text: str

@app.post("/predict")
async def predict_sentiment(req: TextRequest):
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {"inputs": req.text}
    
    response = requests.post(API_URL, headers=headers, json=payload)
    
    if response.status_code == 200:
        result = response.json()
        # The API returns a list containing a list of dictionaries. We grab the highest score.
        best_prediction = max(result[0], key=lambda x: x['score'])
        return {"label": best_prediction['label'], "score": best_prediction['score']}
    else:
        return {"label": "ERROR", "score": 0.0}