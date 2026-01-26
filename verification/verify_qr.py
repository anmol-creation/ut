
from playwright.sync_api import sync_playwright

def verify_qr_code_tool():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the tool page
        page.goto("http://localhost:8000/tools/qr-code-generator/index.html")

        # Wait for the landing page content
        page.wait_for_selector("#landing-page")

        # Take a screenshot of the landing page
        page.screenshot(path="verification/landing_page.png")
        print("Landing page screenshot taken.")

        # Click Start Generating
        page.click("#start-btn")

        # Wait for tool container to be visible
        page.wait_for_selector("#tool-container")

        # Enter a URL
        page.fill("#inp-url", "https://example.com")

        # Click Generate
        page.click("#generate-btn")

        # Wait for QR code output
        page.wait_for_selector("#qr-output img")

        # Take a screenshot of the active tool
        page.screenshot(path="verification/active_tool.png")
        print("Active tool screenshot taken.")

        # Switch to Scan tab
        page.click("#tab-scan")

        # Wait for scan panel
        page.wait_for_selector("#panel-scan:not(.hidden)")

        # Take screenshot of scan tab
        page.screenshot(path="verification/scan_tab.png")
        print("Scan tab screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_qr_code_tool()
