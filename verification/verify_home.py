
from playwright.sync_api import sync_playwright

def verify_home_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the home page served by python http server
        page.goto("http://localhost:8080/")

        # Scroll to the "Most Popular Tools" section
        popular_section = page.locator("#most-popular")
        popular_section.scroll_into_view_if_needed()

        # Wait for the section to be visible
        popular_section.wait_for(state="visible")

        # Take a screenshot of the entire section
        page.locator("body").screenshot(path="verification/home_page_verification.png")

        # Also take a specific screenshot of the cards
        popular_section.screenshot(path="verification/most_popular_cards.png")

        browser.close()

if __name__ == "__main__":
    verify_home_page()
