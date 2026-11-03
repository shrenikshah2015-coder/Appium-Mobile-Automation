
import { remote, Browser } from 'webdriverio';
import { CalculatorPage } from './CalculatorPage';
import { before, beforeEach, after, afterEach, describe, it } from 'mocha';
import fs from 'node:fs';

describe('Samsung Calculator Tests', function () {
    this.timeout(60000);
    let driver: Browser;
    let calculator: CalculatorPage;
    const screenshotFolder = './screenshots';

if (!fs.existsSync(screenshotFolder)) {
    fs.mkdirSync(screenshotFolder, { recursive: true });
}   

    // Create the Appium session before the tests
    before(async function () {
        driver = await remote({
            hostname: '127.0.0.1',
            port: 4723,
            path: '/',
            capabilities: {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:udid': process.env.ANDROID_UDID || 'emulator-5554',
            'appium:appPackage': process.env.CALCULATOR_PACKAGE || 'com.sec.android.app.popupcalculator',
            'appium:appActivity': process.env.CALCULATOR_ACTIVITY || '.Calculator',
            'appium:noReset': true
}
        });
calculator = new CalculatorPage(driver);

// Diagnostic: capture OpenCalc screen elements
const pageSource = await driver.getPageSource();
console.log('========== OPENCALC PAGE SOURCE START ==========');
console.log(pageSource);
console.log('========== OPENCALC PAGE SOURCE END ==========');
});

beforeEach(async function () {
        await calculator.clearCalculator();
        console.log('Calculator cleared before test');
    });   

    // Multiplication test
    it('should multiply 9 by 9 and return 81', async function () {
        console.log('Test: 9 × 9 = 81');

        await calculator.multiplyNineByNine();
        await calculator.verifyResult('81');
    });

    // Division test
    it('should divide 8 by 2 and return 4', async function () {
        console.log('Test: 8 ÷ 2 = 4');

        await calculator.divideEightByTwo();
        await calculator.verifyResult('4');
    });

    afterEach(async function () {
    if (this.currentTest?.state === 'failed' && driver) {
        const screenshot = await driver.takeScreenshot();

        const fileName =
            `failure-${Date.now()}.png`;

        const filePath =
            `${screenshotFolder}/${fileName}`;

        fs.writeFileSync(filePath, screenshot, 'base64');

        console.log(`Failure screenshot saved: ${filePath}`);
    }
});

    // Close the Appium session after all tests
    after(async function () {
        if (driver) {
            try {
                await calculator.closeCalculator();
                console.log('Calculator app closed successfully');
            } finally {
                await driver.deleteSession();
                console.log('Appium session closed');
            }
        }
    });
});
