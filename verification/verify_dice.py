from playwright.sync_api import sync_playwright

def verify_dice_rolling(page):
    """Verify that the dice can be rolled and the result is displayed."""
    page.goto("http://localhost:5173/dice/")

    # Hide the Eruda button
    page.evaluate("document.querySelector('#eruda').style.display = 'none'")

    # Open the options modal
    options_button = page.locator("#options-button")
    options_button.click()
    page.screenshot(path="verification/modal_screenshot.png")

    # Change the number of dice and edges
    dice_selector = page.locator("#dice-selector")
    dice_selector.select_option("4")
    edges_selector = page.locator("#dice-edges-selector")
    edges_selector.select_option("12")

    # Uncheck the 3D checkbox
    checkbox_3d = page.locator("#\\33 d-checkbox")
    checkbox_3d.uncheck()

    # Close the modal
    close_button = page.locator(".modal-content button")
    close_button.click()

    # Roll the dice
    roll_button = page.locator("#roll-button")
    roll_button.click()

    # Take a screenshot
    page.screenshot(path="verification/verification.png")

def main():
    """Run the verification script."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        verify_dice_rolling(page)
        browser.close()

if __name__ == "__main__":
    main()
