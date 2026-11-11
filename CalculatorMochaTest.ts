
import { remote, Browser } from 'webdriverio';
import { CalculatorPage } from './CalculatorPage';
import { before, beforeEach, after, afterEach, describe, it } from 'mocha';
import fs from 'node:fs';
import { config } from './config';

describe('Calculator Tests', function () {
    this.timeout(60000);

    let driver: Browser;
    let calculator: CalculatorPage;

    const screenshotFolder = './screenshots';

    // Create screenshots folder if it does not exist
    if (!fs.existsSync(screenshotFolder)) {
        fs.mkdirSync(screenshotFolder, { recursive: true });
    }

    // Create the Appium session before the tests
    before(async function () {

        console.log(`Connecting to device: ${config.udid}`);
        console.log(`Device name: ${config.deviceName}`);
        console.log(`Launching package: ${config.calculatorPackage}`);
        console.log(`Launching activity: ${config.calculatorActivity}`);

        driver = await remote({
            hostname: '127.0.0.1',
            port: 4723,
            path: '/',
            capabilities: {
                platformName: config.platformName,
                'appium:automationName': 'UiAutomator2',
                'appium:deviceName': config.deviceName,
                'appium:udid': config.udid,
                'appium:appPackage': config.calculatorPackage,
                'appium:appActivity': config.calculatorActivity,
                'appium:noReset': true
            }
        });

        calculator = new CalculatorPage(driver);

        // Capture application screen elements for locator analysis
        const pageSource = await driver.getPageSource();

        console.log('========== APP PAGE SOURCE START ==========');
        console.log(pageSource);
        console.log('========== APP PAGE SOURCE END ==========');
    });

    // Clear calculator before each test
    beforeEach(async function () {
        await calculator.clearCalculator();
        console.log('Calculator cleared before test');
    });

    // Test data for calculator operations
    const testCases = [
        {
            title: 'should multiply 9 by 9 and return 81',
            execute: () => calculator.multiplyNineByNine(),
            expected: '81'
        },
        {
            title: 'should divide 8 by 2 and return 4',
            execute: () => calculator.divideEightByTwo(),
            expected: '4'
        },
        {
            title: 'should add 5 and 3 and return 8',
            execute: () => calculator.addFiveAndThree(),
            expected: '8'
        },
        {
            title: 'should subtract 4 from 9 and return 5',
            execute: () => calculator.subtractNineAndFour(),
            expected: '5'
        }
    ];

    // Execute each test case using the same test structure
    testCases.forEach((testCase) => {
        it(testCase.title, async function () {
            console.log(`Running: ${testCase.title}`);

            await testCase.execute();
            await calculator.verifyResult(testCase.expected);
        });
    });

    // Capture screenshot automatically when a test fails
    afterEach(async function () {
        if (this.currentTest?.state === 'failed' && driver) {
            try {
                const screenshot = await driver.takeScreenshot();

                const testName = this.currentTest.title
                    .replace(/[^a-zA-Z0-9-_]/g, '_');

                const fileName = `failure-${testName}-${Date.now()}.png`;
                const filePath = `${screenshotFolder}/${fileName}`;

                fs.writeFileSync(filePath, screenshot, 'base64');

                console.log(`Failure screenshot saved: ${filePath}`);
            } catch (error) {
                console.error('Failed to capture failure screenshot:', error);
            }
        }
    });

    // Close the Appium session after all tests
    after(async function () {
        if (driver) {
            try {
                if (calculator) {
                    await calculator.closeCalculator();
                    console.log('Calculator app closed successfully');
                }
            } finally {
                await driver.deleteSession();
                console.log('Appium session closed');
            }
        }
    });
});
