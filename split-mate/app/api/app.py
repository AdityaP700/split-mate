from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("http://localhost:3000/ai-integrate")
    
    page.locator("#prompt").fill("Split Rs 3000 equally among 4 users")
    page.locator("#amount").fill("")
    page.locator("#noOfUsers").fill("")
    page.get_by_role("button",name="Split Now").click()
    
    time.sleep(10)
    page.close()
    browser.close()
    