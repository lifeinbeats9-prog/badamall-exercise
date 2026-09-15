from functools import lru_cache
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from transformers import pipeline

BASE_DIR = Path(__file__).resolve().parent
app = FastAPI(title="바다몰 AI Text Lab")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

class TextRequest(BaseModel):
    text: str

@lru_cache(maxsize=1)
def get_sentiment_model():
    return pipeline("text-classification", model="daekeun-ml/koelectra-small-v3-nsmc")

@lru_cache(maxsize=1)
def get_translation_model():
    return pipeline("translation", model="Helsinki-NLP/opus-mt-ko-en")

@lru_cache(maxsize=1)
def get_summary_model():
    return pipeline("summarization", model="EbanLee/kobart-summary-v2")

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.post("/api/sentiment")
def sentiment(req: TextRequest):
    result = get_sentiment_model()(req.text)[0]
    label = result["label"]
    label_map = {"LABEL_0":"부정", "LABEL_1":"긍정", "Neg":"부정", "Pos":"긍정", "NEGATIVE":"부정", "POSITIVE":"긍정"}
    return {"task":"sentiment", "input":req.text, "label":label_map.get(label, label), "score":round(float(result["score"]), 4)}

@app.post("/api/translate")
def translate(req: TextRequest):
    result = get_translation_model()(req.text, max_length=160)[0]
    return {"task":"translation", "input":req.text, "translation":result["translation_text"]}

@app.post("/api/summarize")
def summarize(req: TextRequest):
    result = get_summary_model()(req.text, max_length=90, min_length=15, do_sample=False)[0]
    return {"task":"summarization", "input":req.text, "summary":result["summary_text"]}
