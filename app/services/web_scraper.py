from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import os
import time

class WebScraper:
    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        # Use chromedriver from project root
        driver_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'chromedriver.exe')
        service = Service(driver_path)
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.driver.set_page_load_timeout(10)  # 10 seconds timeout

    def extract_text(self, url):
        try:
            print(f"[WebScraper] Loading URL: {url}")
            self.driver.get(url)
            time.sleep(1)  # Reduce wait time
            print("[WebScraper] Page loaded, extracting title...")
            title = self.driver.title
            if title and len(title) > 10:
                print(f"[WebScraper] Extracted title: {title}")
                return title
            print("[WebScraper] Title not found, extracting paragraphs...")
            paragraphs = self.driver.find_elements(By.TAG_NAME, "p")
            article_text = " ".join([p.text for p in paragraphs if p.text.strip()])
            if not article_text:
                print("[WebScraper] No article text found.")
                return None
            print(f"[WebScraper] Extracted article text (first 100 chars): {article_text[:100]}")
            return article_text
        except Exception as e:
            print(f"[WebScraper] Error extracting text from {url}: {str(e)}")
            return None

    def __del__(self):
        try:
            self.driver.quit()
        except Exception:
            pass 