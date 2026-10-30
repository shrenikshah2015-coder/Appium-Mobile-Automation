
import type { Browser } from 'webdriverio';

export class CalculatorPage {
    private driver: Browser;

    constructor(driver: Browser) {
        this.driver = driver;
    }

    // Calculator element locators
    private number8 = 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_08';
    private number2 = 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_02';
    private number9 = 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_09';

    // Reusable method to click any Calculator button
    private async clickButton(locator: string): Promise<void> {
    await this.driver.$(locator).click();
}
   
    private multiplyButton = 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_mul';
    private divideButton = 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_div';
    private equalsButton = 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_equal';
    private resultField = 'id=com.sec.android.app.popupcalculator:id/calc_edt_formula';

    // Perform multiplication: 9 × 9
    async multiplyNineByNine(): Promise<void> {
    await this.clickButton(this.number9);
    await this.clickButton(this.multiplyButton);
    await this.clickButton(this.number9);
    await this.clickButton(this.equalsButton);
}

    // Perform division: 8 ÷ 2
    async divideEightByTwo(): Promise<void> {
    await this.clickButton(this.number8);
    await this.clickButton(this.divideButton);
    await this.clickButton(this.number2);
    await this.clickButton(this.equalsButton);
}

    // Read the displayed result
    async getResult(): Promise<string> {
        const resultElement = await this.driver.$(this.resultField);
        return await resultElement.getText();
    }
  
    
    // Verify the displayed result exactly
    
async verifyResult(expected: string): Promise<void> {
    const actual = await this.getResult();

    // Check whether the result starts with the expected value
    const actualResult = actual.trim().split(' ')[0];

    if (actualResult === expected) {
        console.log(`PASS: Expected result ${expected}`);
    } else {
        throw new Error(
            `FAIL: Expected ${expected}, but got ${actual}`
        );
    }
}
   

    // Close the Calculator app
    async closeCalculator(): Promise<void> {
        await this.driver.execute('mobile: terminateApp', {
            appId: 'com.sec.android.app.popupcalculator'
        });
    }

// Clear the calculator before a new calculation

async clearCalculator(): Promise<void> {
    const clearButton = await this.driver.$(
        'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_clear'
    );

    if (await clearButton.isExisting()) {
        await clearButton.click();
        console.log('Calculator cleared successfully');
    } else {
        console.log('Clear button not available');
    }
}
}
