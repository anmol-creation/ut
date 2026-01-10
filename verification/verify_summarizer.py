
from playwright.sync_api import sync_playwright

def verify_text_summarizer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the tool
        page.goto("http://localhost:8080/tools/text-summarizer/index.html")

        # Check landing page
        page.wait_for_selector("#landing-view")
        page.screenshot(path="verification/1_landing.png")
        print("Landing page screenshot taken.")

        # Click Start
        page.click("#start-tool-btn")

        # Check Tool UI
        page.wait_for_selector("#tool-ui:not(.hidden)")
        page.screenshot(path="verification/2_tool_empty.png")
        print("Empty tool screenshot taken.")

        # Enter Text
        sample_text = """
        Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, such as through variations in the solar cycle. But since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas.

        Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures. The main greenhouse gases that are causing climate change include carbon dioxide and methane. These come from using gasoline for driving a car or coal for heating a building, for example. Clearing land and cutting down forests can also release carbon dioxide. Agriculture, oil and gas operations are major sources of methane emissions. Energy, industry, transport, buildings, agriculture and land use are among the main sectors causing greenhouse gases.

        Humans are responsible for virtually all global heating over the last 200 years. The average temperature of the Earth's surface is now about 1.1°C warmer than it was in the late 1800s (before the industrial revolution) and warmer than at any time in the last 100,000 years. The last decade (2011-2020) was the warmest on record, and each of the last four decades has been warmer than any previous decade since 1850.

        Many people think climate change mainly means warmer temperatures. But temperature rise is only the beginning of the story. Because the Earth is a system, where everything is connected, changes in one area can influence changes in all others. The consequences of climate change now include, among others, intense droughts, water scarcity, severe fires, rising sea levels, flooding, melting polar ice, catastrophic storms and declining biodiversity.
        """
        page.fill("#input-text", sample_text)

        # Select Medium Length (default)

        # Click Summarize
        page.click("#summarize-btn")

        # Wait for output
        page.wait_for_selector("#output-container p")

        # Take screenshot of results
        page.screenshot(path="verification/3_tool_result.png")
        print("Result screenshot taken.")

        # Click Keywords
        # Keywords should be visible now
        page.wait_for_selector("#keywords-list .keyword-tag")

        browser.close()

if __name__ == "__main__":
    verify_text_summarizer()
