from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the file directly since we are using static HTML
        cwd = os.getcwd()
        file_path = f"file://{cwd}/tools/image-compressor/index.html"
        print(f"Loading {file_path}")

        page.goto(file_path)

        # Take a screenshot of the initial state (Landing View)
        page.screenshot(path="verification/landing_view.png")
        print("Landing view screenshot taken")

        # Manually switch to active view to test controls
        page.evaluate("""() => {
            document.getElementById('landing-view').classList.add('hidden');
            document.getElementById('active-view').classList.remove('hidden');
        }""")

        # Click Manual mode
        page.click("button[data-mode='manual']")

        # Take a screenshot of the active view with manual controls
        page.screenshot(path="verification/manual_mode.png")
        print("Manual mode screenshot taken")

        browser.close()

if __name__ == "__main__":
    run()
