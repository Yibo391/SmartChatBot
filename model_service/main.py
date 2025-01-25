# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# 加载模型，并启用截断
chatbot = pipeline(
    "text-generation",
    model="microsoft/DialoGPT-medium",
    tokenizer="microsoft/DialoGPT-medium",
    pad_token_id=50256,
    max_length=1000,  # 总体最大长度
    truncation=True,  # 启用截断
    temperature=0.7,
    top_k=50,
    top_p=0.95,
    do_sample=True
)

class PredictRequest(BaseModel):
    text: str  # 接收完整的对话历史作为提示

class PredictResponse(BaseModel):
    reply: str  # 仅返回机器人的回复

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    prompt = request.text

    try:
        response = chatbot(
            prompt,
            max_new_tokens=50,  # 控制生成新标记的数量
            truncation=True
        )
        generated_text = response[0]['generated_text']

        # 提取回复：获取 "Bot:" 之后的文本
        bot_index = generated_text.rfind("Bot:")
        if bot_index != -1:
            reply = generated_text[bot_index + len("Bot:"):].strip()
        else:
            # 如果找不到 "Bot:"，则取生成文本的最后一部分
            reply = generated_text.strip()

        if not reply:
            reply = "抱歉，我不太明白您的意思。"

        return PredictResponse(reply=reply)
    except Exception as e:
        print(f"模型生成错误: {e}")
        raise HTTPException(status_code=500, detail="模型生成错误")
