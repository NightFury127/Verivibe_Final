import os
from serpapi import GoogleSearch
from datetime import datetime, timedelta

class SerpNewsAPI:
    def __init__(self):
        self.api_key = os.getenv('SERPAPI_KEY', '19d1203a5ae976cba1d83300b0a3954cb18e32cf983ceef899331a004a718278')

    def search_articles(self, query, days_back=7):
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days_back)
            params = {
                "engine": "google_news",
                "q": query,
                "api_key": self.api_key,
                "hl": "en",
                "gl": "in",
                "from": start_date.strftime('%Y-%m-%d'),
                "to": end_date.strftime('%Y-%m-%d'),
                "num": 10
            }
            search = GoogleSearch(params)
            results = search.get_dict()
            articles = []
            for news in results.get('news_results', []):
                articles.append({
                    'title': news.get('title', ''),
                    'url': news.get('link', ''),
                    'description': news.get('snippet', '')
                })
            print(f"[SerpAPI] Query: {query}")
            print(f"[SerpAPI] Articles found: {len(articles)}")
            for art in articles:
                print(f"[SerpAPI] Title: {art['title']}")
            return articles
        except Exception as e:
            print(f"Error searching articles with SerpAPI: {str(e)}")
            return [] 