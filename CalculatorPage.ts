
import type { Browser } from 'webdriverio';

export class CalculatorPage {
    private driver: Browser;
    private appPackage: string;

    constructor(driver: Browser) {
        this.driver = driver;
        this.appPackage =
            process.env.CALCULATOR_PACKAGE ||
            'com.sec.android.app.popupcalculator';
    }

    // Samsung Calculator locators
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

    // OpenCalc locators will be added after inspecting its page source.
    private get locators() {
        if (this.appPackage === 'com.sec.android.app.popupcalculator') {
            return this.samsung;
        }

        throw new Error(
            `Locators have not yet been configured for ${this.appPackage}`
        );
    }

    private async clickButton(locator: string): Promise<void> {
        await this.driver.$(locator).click();
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
        return await resultElement.getText();
    }

    async verifyResult(expected: string): Promise<void> {
        const actual = await this.getResult();
        const actualResult = actual.trim().split(' ')[0];

        if (actualResult === expected) {
            console.log(`PASS: Expected result ${expected}`);
        } else {
            throw new Error(`FAIL: Expected ${expected}, but got ${actual}`);
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
