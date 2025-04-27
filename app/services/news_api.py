import os
import requests
from datetime import datetime, timedelta

class NewsAPI:
    def __init__(self):
        self.api_key = os.getenv('GNEWS_API_KEY', 'f334b5ef36b944fd7fff041a081ccb48')
        self.base_url = 'https://gnews.io/api/v4/search'
        # List of trusted news sources (not used for filtering now)
        self.trusted_sources = [
            'reuters.com',
            'bbc.com',
            'theguardian.com',
            'nytimes.com',
            'washingtonpost.com',
            'apnews.com',
            'aljazeera.com',
            'cnn.com',
            'nbcnews.com',
            'cbsnews.com'
        ]
    
    def search_articles(self, query, days_back=7):
        """
        Search for articles related to the query (no source restriction)
        """
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days_back)
            params = {
                'q': query,
                'token': self.api_key,
                'lang': 'en',
                'from': start_date.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'to': end_date.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'max': 10,
            }
            response = requests.get(self.base_url, params=params)
            if response.status_code == 200:
                data = response.json()
                articles = data.get('articles', [])
                print(f"[GNews] Query: {query}")
                print(f"[GNews] Articles found: {len(articles)}")
                for art in articles:
                    print(f"[GNews] Title: {art['title']}")
                return articles
            else:
                print(f"[GNews] No articles found for query: {query}")
                return []
        except Exception as e:
            print(f"Error searching articles: {str(e)}")
            return []
    
    def get_article_details(self, url):
        """
        Get detailed information about a specific article
        """
        try:
            # Note: NewsAPI doesn't provide article content
            # You might want to use web scraping here
            return None
        except Exception as e:
            print(f"Error getting article details: {str(e)}")
            return None 