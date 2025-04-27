import os
import google.generativeai as genai

class GeminiService:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY', 'AIzaSyDwdn-fbCWwMaO9GNyaUEG6r1gczKsjM4g')
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def summarize_article(self, article_text):
        prompt = f"Summarize the following news article in 2-3 sentences:\n\n{article_text}"
        response = self.model.generate_content(prompt)
        return response.text.strip() if hasattr(response, 'text') else str(response)

    def generate_verdict(self, claim, sources):
        sources_text = '\n'.join([f"Title: {s['title']}\nSnippet: {s.get('description', '')}" for s in sources])
        prompt = (
            f"Claim: {claim}\n"
            f"Here are some news sources related to the claim:\n{sources_text}\n"
            "Based on these sources, is the claim true, false, or unverified? "
            "Write a short paragraph summarizing the evidence and your verdict."
        )
        response = self.model.generate_content(prompt)
        return response.text.strip() if hasattr(response, 'text') else str(response) 