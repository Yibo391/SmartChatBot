from transformers import pipeline

def initialize_chatbot():
    return pipeline(
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

def get_response(chatbot, user_input):
    try:
        prompt = f"Human: {user_input}\nBot:"
        response = chatbot(prompt, max_new_tokens=50)
        reply = response[0]['generated_text'][len(prompt):].strip()
        return reply or "Sorry, I don't understand your question."
    except Exception:
        return "An error occurred. Please try again."

def main():
    print("Loading model...")
    chatbot = initialize_chatbot()
    print("Model loaded! Enter 'quit' to exit")
    
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == 'quit':
            break
        print(f"Bot: {get_response(chatbot, user_input)}")

if __name__ == "__main__":
    main()
