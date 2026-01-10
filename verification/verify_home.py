
from playwright.sync_api import sync_playwright

def verify_home_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the home page
        page.goto("http://localhost:8080/index.html")

        # Check "New Added Tools" section
        new_added_section = page.locator("#new-comer")
        new_added_section.scroll_into_view_if_needed()

        # Screenshot
        page.screenshot(path="verification/home_new_added.png")
        print("Home page screenshot taken.")

        # Verify specific elements
        header = new_added_section.locator("h2")
        print(f"Header text: {header.inner_text()}")

        tools = new_added_section.locator(".tool-card")
        count = tools.count()
        print(f"Number of tools: {count}")

        # Verify Summarizer
        summarizer = tools.nth(0)
        print(f"First tool: {summarizer.locator('h3').inner_text()}")
        print(f"Button text: {summarizer.locator('.tool-link').inner_text()}")

        browser.close()

if __name__ == "__main__":
    verify_home_page()
