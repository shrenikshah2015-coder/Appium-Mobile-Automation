
import { remote, Browser } from 'webdriverio';
import { CalculatorPage } from './CalculatorPage';
import { before, beforeEach, after, afterEach, describe, it } from 'mocha';
import fs from 'node:fs';

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
        const appPackage =
            process.env.CALCULATOR_PACKAGE ||
            'com.darkempire78.opencalculator';

        const appActivity =
            process.env.CALCULATOR_ACTIVITY ||
            '.activities.MainActivity';

        const deviceUdid =
            process.env.ANDROID_UDID ||
            'emulator-5554';

        console.log(`Connecting to device: ${deviceUdid}`);
        console.log(`Launching package: ${appPackage}`);
        console.log(`Launching activity: ${appActivity}`);

        driver = await remote({
            hostname: '127.0.0.1',
            port: 4723,
            path: '/',
            capabilities: {
                platformName: 'Android',
                'appium:automationName': 'UiAutomator2',
                'appium:udid': deviceUdid,
                'appium:appPackage': appPackage,
                'appium:appActivity': appActivity,
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
