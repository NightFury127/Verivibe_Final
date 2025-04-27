from app.models.database import FactCheckResult
from app.services.gemini_service import GeminiService
import json

class FactChecker:
    def __init__(self):
        self.gemini = GeminiService()
    
    def check_claim(self, claim):
        """
        Use Gemini AI to analyze the claim and generate a verdict/summary.
        """
        # Use Gemini to generate a verdict paragraph
        verdict = self.gemini.generate_verdict(claim, [])
        results = {
            'summary': verdict,
            'confidence': None,
            'sources': []
        }
        # Store result in file-based storage
        fact_check = FactCheckResult(
            claim=claim,
            result=results['summary'],
            confidence_score=results['confidence'],
            sources=results['sources']
        )
        FactCheckResult.add(fact_check)
        return results 