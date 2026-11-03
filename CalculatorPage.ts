
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

    // OpenCalc locators will be configured after inspecting its page source.
    private get locators() {
        if (this.appPackage === 'com.sec.android.app.popupcalculator') {
            return this.samsung;
        }

        if (this.appPackage === 'com.darkempire78.opencalculator') {
            throw new Error(
                'OpenCalc locators are not configured yet. ' +
                'Please inspect the OpenCalc page source first.'
            );
        }

        throw new Error(`Unsupported calculator package: ${this.appPackage}`);
    }

    private async clickButton(locator: string): Promise<void> {
        const element = await this.driver.$(locator);
        await element.waitForDisplayed({ timeout: 10000 });
        await element.click();
    }

    async multiplyNineByNine(): Promise<void> {
        const locators = this.locators;

        await this.clickButton(locators.number9);
        await this.clickButton(locators.multiply);
        await this.clickButton(locators.number9);
        await this.clickButton(locators.equals);
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

        return (await resultElement.getText()).trim();
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

        if (await clearButton.isExisting()) {
            await clearButton.click();
            console.log('Calculator cleared successfully');
        } else {
            console.log('Clear button not available');
        }
    }

    async closeCalculator(): Promise<void> {
        await this.driver.execute('mobile: terminateApp', {
            appId: this.appPackage
        });
    }
}
