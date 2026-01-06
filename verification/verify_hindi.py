from playwright.sync_api import sync_playwright, expect
import os

def test_hindi_support(page):
    # Load the local file
    file_path = os.path.abspath("tools/word-character-counter/index.html")
    page.goto(f"file://{file_path}")

    # Enter tool
    page.click("#launch-tool-btn")

    # Type Hindi text
    # "Hello world. This is a test." -> "नमस्ते दुनिया। यह एक परीक्षण है।"
    # Words: 6
    # Sentences: 2 (Split by |)
    hindi_text = "नमस्ते दुनिया। यह एक परीक्षण है।"

    text_input = page.locator("#text-input")
    text_input.fill(hindi_text)

    # Verify Counts
    expect(page.locator("#stat-words")).to_have_text("6")
    expect(page.locator("#stat-sentences")).to_have_text("2")

    # Unique check
    # All 6 are unique
    expect(page.locator("#stat-unique")).to_have_text("6")

    print("Hindi verification successful!")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_hindi_support(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()
