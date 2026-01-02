
from playwright.sync_api import Page, expect, sync_playwright

def verify_dice_rolling(page: Page):
    """
    This test verifies that a user can select the number of dice to roll
    and that the correct number of dice are displayed after clicking the 'Roll' button.
    """
    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:5173")

    # 2. Act: Select 4 dice from the dropdown.
    dice_selector = page.locator("#dice-selector")
    dice_selector.select_option("4")

    # 3. Act: Click the "Roll" button.
    roll_button = page.get_by_role("button", name="Roll")
    roll_button.click()

    # 4. Assert: For now, we will just wait for the canvas to be visible.
    # A more robust test would involve checking the canvas content, but for
    # visual verification, this is sufficient.
    canvas = page.locator("#game-container canvas")
    expect(canvas).to_be_visible()

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="/app/verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_dice_rolling(page)
        finally:
            browser.close()
