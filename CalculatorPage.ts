
import type { Browser } from 'webdriverio';

export class CalculatorPage {
    private driver: Browser;
    private appPackage: string;

    constructor(driver: Browser) {
        this.driver = driver;

        this.appPackage =
            process.env.CALCULATOR_PACKAGE ||
            'com.darkempire78.opencalculator';
    }

    // Samsung Calculator resource IDs
    private samsung = {
        number8: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_08',
        number2: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_02',
        number9: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_09',
        multiply: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_mul',
        divide: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_div',
        equals: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_equal',
        result: 'id=com.sec.android.app.popupcalculator:id/calc_edt_formula',
        clear: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_clear'
    };

    // OpenCalc resource IDs - captured from Appium page source
    private openCalc = {
        number8: 'id=com.darkempire78.opencalculator:id/eightButton',
        number2: 'id=com.darkempire78.opencalculator:id/twoButton',
        number9: 'id=com.darkempire78.opencalculator:id/nineButton',
        multiply: 'id=com.darkempire78.opencalculator:id/multiplyButton',
        divide: 'id=com.darkempire78.opencalculator:id/divideButton',
        equals: 'id=com.darkempire78.opencalculator:id/equalsButton',
        result: 'id=com.darkempire78.opencalculator:id/resultDisplay',
        clear: 'id=com.darkempire78.opencalculator:id/clearButton'
    };

    // Select locators based on the configured application
    private get locators() {
        if (this.appPackage === 'com.sec.android.app.popupcalculator') {
            return this.samsung;
        }

        if (this.appPackage === 'com.darkempire78.opencalculator') {
            return this.openCalc;
        }

        throw new Error(`Unsupported calculator package: ${this.appPackage}`);
    }

    private async clickButton(locator: string): Promise<void> {
    console.log(`Attempting to click: ${locator}`);

    const element = await this.driver.$(locator);

    await element.waitForDisplayed({ timeout: 10000 });

    console.log(`Button displayed: ${locator}`);

    await element.click();

    console.log(`Button clicked successfully: ${locator}`);
}

   async multiplyNineByNine(): Promise<void> {
    const locators = this.locators;

    console.log('STEP 1: Clicking number 9');
    await this.clickButton(locators.number9);
    console.log('Screen after first 9:', await this.driver.getPageSource());

    console.log('STEP 2: Clicking multiplication');
    await this.clickButton(locators.multiply);
    console.log('Screen after multiplication:', await this.driver.getPageSource());

    console.log('STEP 3: Clicking second number 9');
    await this.clickButton(locators.number9);
    console.log('Screen after second 9:', await this.driver.getPageSource());

    console.log('STEP 4: Clicking equals');
    await this.clickButton(locators.equals);
    console.log('Screen after equals:', await this.driver.getPageSource());
}

    async divideEightByTwo(): Promise<void> {
        const locators = this.locators;

        await this.clickButton(locators.number8);
        await this.clickButton(locators.divide);
        await this.clickButton(locators.number2);
        await this.clickButton(locators.equals);
    }

    async getResult(): Promise<string> {
    const resultElement = await this.driver.$(this.locators.result);

    await resultElement.waitForDisplayed({ timeout: 10000 });

    const text = await resultElement.getText();
    const attributeText = await resultElement.getAttribute('text');
    const contentDescription = await resultElement.getAttribute('content-desc');

    console.log('========== CALCULATOR RESULT DEBUG ==========');
    console.log('getText():', text);
    console.log('Text attribute:', attributeText);
    console.log('Content description:', contentDescription);
    console.log('========== CURRENT APP PAGE SOURCE ==========');
    console.log(await this.driver.getPageSource());
    console.log('=============================================');

    return (text || attributeText || contentDescription || '').trim();
}

    async verifyResult(expected: string): Promise<void> {
        const actual = await this.getResult();
        const actualResult = actual.split(' ')[0];

        if (actualResult === expected) {
            console.log(`PASS: Expected result ${expected}`);
        } else {
            throw new Error(
                `FAIL: Expected ${expected}, but got ${actual}`
            );
        }
    }

    async clearCalculator(): Promise<void> {
        const clearButton = await this.driver.$(this.locators.clear);
        await clearButton.waitForDisplayed({ timeout: 10000 });
        await clearButton.click();

        console.log('Calculator cleared successfully');
    }

    async closeCalculator(): Promise<void> {
        await this.driver.execute('mobile: terminateApp', {
            appId: this.appPackage
        });
    }
}
