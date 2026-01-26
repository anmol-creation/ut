
from playwright.sync_api import sync_playwright

def verify_text_formatter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the tool
        page.goto("http://localhost:8080/tools/text-formatter/index.html")

        # Take screenshot of Landing View
        page.screenshot(path="verification/landing_view.png")
        print("Captured Landing View")

        # Click Use Tool
        page.get_by_role("button", name="[ Use Tool ]").click()

        # Wait for tool to appear
        page.wait_for_selector("#tool-view:not(.hidden)")

        # Type in input
        page.fill("#input-text", "hello world")

        # Click Uppercase
        page.click("button[data-action='uppercase']")

        # Check output
        output_value = page.input_value("#output-text")
        if output_value == "HELLO WORLD":
            print("Transformation Logic Verified: HELLO WORLD")
        else:
            print(f"Transformation Failed: Got '{output_value}'")

        # Take screenshot of Tool View
        page.screenshot(path="verification/tool_view.png")
        print("Captured Tool View")

        browser.close()

if __name__ == "__main__":
    verify_text_formatter()
