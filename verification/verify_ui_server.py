from playwright.sync_api import sync_playwright, expect

def test_ui_improvements(page):
    # Load via localhost
    page.goto("http://localhost:8000/tools/text-case-converter/index.html")

    # 1. Verify Landing View
    expect(page.locator("#landing-view")).to_be_visible()

    # Check if script loaded (often if module fails, button click does nothing)
    # 2. Transition to Tool View
    page.click("#use-tool-btn")

    # Wait for change
    expect(page.locator("#landing-view")).not_to_be_visible()
    expect(page.locator("#tool-view")).to_be_visible()

    # 3. Verify Tool Card Structure
    expect(page.locator(".tool-card")).to_be_visible()

    # 4. Verify Logic Preservation
    page.fill("#input-text", "hello world")
    page.click("button[data-action=\"uppercase\"]")
    expect(page.locator("#output-text")).to_have_value("HELLO WORLD")

    # Screenshot
    page.screenshot(path="verification/ui_improvement.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 375, "height": 812})
        try:
            test_ui_improvements(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()
