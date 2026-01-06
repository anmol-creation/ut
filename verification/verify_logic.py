from playwright.sync_api import sync_playwright, expect

def test_clear_reset(page):
    page.goto("http://localhost:8000/tools/text-case-converter/index.html")
    page.click("#use-tool-btn")

    # Fill text
    page.fill("#input-text", "To be cleared")
    page.click("button[data-action=\"uppercase\"]")
    expect(page.locator("#output-text")).to_have_value("TO BE CLEARED")

    # Test Clear
    page.click("#btn-clear")
    expect(page.locator("#input-text")).to_have_value("")
    expect(page.locator("#output-text")).to_have_value("")

    # Fill again for Reset
    page.fill("#input-text", "To be reset")
    page.click("button[data-action=\"lowercase\"]")

    # Test Reset
    page.click("#btn-reset")
    expect(page.locator("#input-text")).to_have_value("")
    expect(page.locator("#output-text")).to_have_value("")

    print("Clear/Reset verification successful!")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_clear_reset(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()
