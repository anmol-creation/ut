from playwright.sync_api import sync_playwright, expect
import os

def test_ui_improvements(page):
    # Load the local file
    file_path = os.path.abspath("tools/text-case-converter/index.html")
    page.goto(f"file://{file_path}")

    # 1. Verify Landing View
    expect(page.locator("#landing-view")).to_be_visible()
    expect(page.locator("#tool-view")).not_to_be_visible()
    expect(page.locator(".hero-title")).to_have_text("Text Case Converter")
    expect(page.locator(".info-grid")).to_be_visible()

    # 2. Transition to Tool View
    page.click("#use-tool-btn")
    expect(page.locator("#landing-view")).not_to_be_visible()
    expect(page.locator("#tool-view")).to_be_visible()

    # 3. Verify Tool Card Structure
    expect(page.locator(".tool-card")).to_be_visible()
    expect(page.locator("#input-text")).to_be_visible()
    expect(page.locator("#output-text")).to_be_visible()
    expect(page.locator(".actions-wrapper")).to_be_visible()

    # 4. Verify Logic Preservation
    page.fill("#input-text", "hello world")
    page.click("button[data-action=\"uppercase\"]")
    expect(page.locator("#output-text")).to_have_value("HELLO WORLD")

    # 5. Mobile Layout Check (simulated by checking class or basic visibility,
    # visual regression not possible without screenshots, but we check if elements exist)

    # 6. Screenshot
    page.screenshot(path="verification/ui_improvement.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 375, "height": 812}) # Mobile viewport
        try:
            test_ui_improvements(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()
