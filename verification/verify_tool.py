from playwright.sync_api import sync_playwright, expect
import os

def test_word_counter(page):
    # Load the local file
    file_path = os.path.abspath("tools/word-character-counter/index.html")
    page.goto(f"file://{file_path}")

    # Verify Landing Page
    expect(page.locator(".landing-content")).to_be_visible()

    # Click Launch
    page.click("#launch-tool-btn")

    # Verify Tool UI is visible
    expect(page.locator("#tool-ui")).to_be_visible()

    # Type some text
    text_input = page.locator("#text-input")
    text_input.fill("Hello world. This is a test sentence.")

    # Verify Counts
    # Words: 7
    # Chars: 37
    expect(page.locator("#stat-words")).to_have_text("7")
    expect(page.locator("#stat-chars")).to_have_text("37")
    expect(page.locator("#stat-sentences")).to_have_text("2")

    # Test Modifiers (Trim)
    text_input.fill("   Trim me   ")
    page.click("button[data-action=\"trim\"]")
    expect(text_input).to_have_value("Trim me")

    # Dark mode toggle check (Visual only, but we can check attribute)
    page.click("#theme-toggle")

    # Take Screenshot
    page.screenshot(path="verification/tool_verified.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_word_counter(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()
