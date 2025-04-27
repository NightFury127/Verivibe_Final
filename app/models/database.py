import json
import os
from datetime import datetime

# File paths for data storage
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')
TRUSTED_SOURCES_FILE = os.path.join(DATA_DIR, 'trusted_sources.json')
FACT_CHECK_RESULTS_FILE = os.path.join(DATA_DIR, 'fact_check_results.json')

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize files if they don't exist
def init_files():
    if not os.path.exists(TRUSTED_SOURCES_FILE):
        with open(TRUSTED_SOURCES_FILE, 'w') as f:
            json.dump([], f)
    
    if not os.path.exists(FACT_CHECK_RESULTS_FILE):
        with open(FACT_CHECK_RESULTS_FILE, 'w') as f:
            json.dump([], f)

# Initialize files
init_files()

class TrustedSource:
    def __init__(self, name, url, reliability_score=1.0):
        self.name = name
        self.url = url
        self.reliability_score = reliability_score
        self.created_at = datetime.utcnow().isoformat()
    
    @staticmethod
    def get_all():
        with open(TRUSTED_SOURCES_FILE, 'r') as f:
            return json.load(f)
    
    @staticmethod
    def add(source):
        sources = TrustedSource.get_all()
        sources.append({
            'name': source.name,
            'url': source.url,
            'reliability_score': source.reliability_score,
            'created_at': source.created_at
        })
        with open(TRUSTED_SOURCES_FILE, 'w') as f:
            json.dump(sources, f, indent=2)
        return source

class FactCheckResult:
    def __init__(self, claim, result, confidence_score=0.0, sources=None):
        self.claim = claim
        self.result = result
        self.confidence_score = confidence_score
        self.sources = sources or []
        self.created_at = datetime.utcnow().isoformat()
    
    @staticmethod
    def get_all():
        with open(FACT_CHECK_RESULTS_FILE, 'r') as f:
            return json.load(f)
    
    @staticmethod
    def add(result):
        results = FactCheckResult.get_all()
        results.append({
            'claim': result.claim,
            'result': result.result,
            'confidence_score': result.confidence_score,
            'sources': result.sources,
            'created_at': result.created_at
        })
        with open(FACT_CHECK_RESULTS_FILE, 'w') as f:
            json.dump(results, f, indent=2)
        return result 