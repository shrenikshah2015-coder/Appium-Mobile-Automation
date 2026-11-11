
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
        number5: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_05',
        number3: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_03',
        number4: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_04',
        number9: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_09',
        multiply: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_mul',
        divide: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_div',
        add: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_add',
        subtract: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_sub',
        equals: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_equal',
        result: 'id=com.sec.android.app.popupcalculator:id/calc_edt_formula',
        clear: 'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_clear'
    };

    // OpenCalc resource IDs
    private openCalc = {
        number8: 'id=com.darkempire78.opencalculator:id/eightButton',
        number2: 'id=com.darkempire78.opencalculator:id/twoButton',
        number5: 'id=com.darkempire78.opencalculator:id/fiveButton',
        number3: 'id=com.darkempire78.opencalculator:id/threeButton',
        number4: 'id=com.darkempire78.opencalculator:id/fourButton',
        number9: 'id=com.darkempire78.opencalculator:id/nineButton',
        multiply: 'id=com.darkempire78.opencalculator:id/multiplyButton',
        divide: 'id=com.darkempire78.opencalculator:id/divideButton',
        add: 'id=com.darkempire78.opencalculator:id/addButton',
        subtract: 'id=com.darkempire78.opencalculator:id/subtractButton',
        equals: 'id=com.darkempire78.opencalculator:id/equalsButton',
        result: 'id=com.darkempire78.opencalculator:id/resultDisplay',
        input: 'id=com.darkempire78.opencalculator:id/input',
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

    // Reusable button click method
    private async clickButton(locator: string): Promise<void> {
        console.log(`Attempting to click: ${locator}`);

        const element = await this.driver.$(locator);

        await element.waitForDisplayed({ timeout: 10000 });

        console.log(`Button displayed: ${locator}`);

        await element.click();

        console.log(`Button clicked successfully: ${locator}`);
    }

    // Test calculation: 9 x 9 = 81
    async multiplyNineByNine(): Promise<void> {
        const locators = this.locators;

        console.log('STEP 1: Clicking number 9');
        await this.clickButton(locators.number9);

        const screenshot = await this.driver.takeScreenshot();
        require('fs').writeFileSync(
            'step1-calculator.png',
            screenshot,
            'base64'
        );
        console.log('STEP 1 screenshot saved');

        console.log('STEP 2: Clicking multiplication');
        await this.clickButton(locators.multiply);

        const screenshot2 = await this.driver.takeScreenshot();
        require('fs').writeFileSync(
            'step2-calculator.png',
            screenshot2,
            'base64'
        );
        console.log('STEP 2 screenshot saved');

        console.log('STEP 3: Clicking second number 9');
        await this.clickButton(locators.number9);

        const screenshot3 = await this.driver.takeScreenshot();
        require('fs').writeFileSync(
            'step3-calculator.png',
            screenshot3,
            'base64'
        );
        console.log('STEP 3 screenshot saved');

        console.log('STEP 4: Clicking equals');
        await this.clickButton(locators.equals);

        const screenshot4 = await this.driver.takeScreenshot();
        require('fs').writeFileSync(
            'step4-calculator.png',
            screenshot4,
            'base64'
        );
        console.log('STEP 4 screenshot saved');
    }

    // Test calculation: 8 / 2 = 4
    async divideEightByTwo(): Promise<void> {
        const locators = this.locators;

        await this.clickButton(locators.number8);
        await this.clickButton(locators.divide);
        await this.clickButton(locators.number2);
        await this.clickButton(locators.equals);
    }

// Test calculation: 5 + 3 = 8
    async addFiveAndThree(): Promise<void> {
        const locators = this.locators;

        await this.clickButton(locators.number5);
        await this.clickButton(locators.add);
        await this.clickButton(locators.number3);
        await this.clickButton(locators.equals);
}

    // Test calculation: 9 - 4 = 5
    async subtractNineAndFour(): Promise<void> {
        const locators = this.locators;

        await this.clickButton(locators.number9);
        await this.clickButton(locators.subtract);
        await this.clickButton(locators.number4);
        await this.clickButton(locators.equals);
}

    // Read the calculator result
    async getResult(): Promise<string> {
        const resultLocator =
            this.appPackage === 'com.darkempire78.opencalculator'
                ? this.openCalc.input
                : this.samsung.result;

        const resultElement = await this.driver.$(resultLocator);

        await resultElement.waitForDisplayed({ timeout: 10000 });

        const actualText = await resultElement.getText();

        console.log('Calculator result:', actualText);

        return actualText.trim();
    }

    // Verify expected calculation result
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

    // Clear calculator
    async clearCalculator(): Promise<void> {
        const clearButton = await this.driver.$(this.locators.clear);

        await clearButton.waitForDisplayed({ timeout: 10000 });
        await clearButton.click();

        console.log('Calculator cleared successfully');
    }

    // Close calculator
    async closeCalculator(): Promise<void> {
        await this.driver.execute('mobile: terminateApp', {
            appId: this.appPackage
        });
    }
}
