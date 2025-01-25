# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# 加载模型
chatbot = pipeline(
    "text-generation",
    model="microsoft/DialoGPT-medium"
    # 移除 torch_dtype 和 device_map 参数
)

class PredictRequest(BaseModel):
    session_id: str
    text: str

class PredictResponse(BaseModel):
    session_id: str
    intent: str
    entities: list
    reply: str

# Remove sessions dictionary as we're not tracking conversations here

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    user_input = request.text

    # 简单的意图识别
    intent = "general_chat"
    entities = []

    # 生成回复
    response = chatbot(
        user_input, 
        max_length=1000,
        num_return_sequences=1,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7
    )[0]['generated_text']
    
    # Remove the original input from the response
    actual_reply = response[len(user_input):].strip()
    if not actual_reply:
        actual_reply = "I'm not sure how to respond to that."

    return PredictResponse(
        session_id=request.session_id,
        intent=intent,
        entities=entities,
        reply=actual_reply
    )
