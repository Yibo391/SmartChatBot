# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Load model
chatbot = pipeline(
    "text-generation",
    model="microsoft/DialoGPT-medium",
    tokenizer="microsoft/DialoGPT-medium",
    pad_token_id=50256,
    max_length=1000,
    truncation=True,
    temperature=0.7,
    top_k=50,
    top_p=0.95,
    do_sample=True
)

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    reply: str

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    try:
        prompt = f"Human: {request.text}\nBot:"
        response = chatbot(prompt, max_new_tokens=50)
        reply = response[0]['generated_text'][len(prompt):].strip()
        
        return PredictResponse(reply=reply or "抱歉，我不太明白您的意思。")
    except Exception as e:
        raise HTTPException(status_code=500, detail="模型生成错误")
