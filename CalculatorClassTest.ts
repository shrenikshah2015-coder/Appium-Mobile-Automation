
import { remote } from 'webdriverio';
import { CalculatorPage } from './CalculatorPage';

async function main() {
    const driver = await remote({
        hostname: '127.0.0.1',
        port: 4723,
        path: '/',
        capabilities: {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:udid': 'RZCXB155WGT',
            'appium:appPackage': 'com.sec.android.app.popupcalculator',
            'appium:noReset': true
        }
    });

    const calculator = new CalculatorPage(driver);

    try {

        
console.log('Test: 9 × 9 = 81');

await calculator.multiplyNineByNine();
await calculator.verifyResult('81');


        const actualResult = await calculator.getResult();
        console.log('Actual result:', actualResult);

        await calculator.verifyResult('81');
        // Test 2: Division

console.log('Test: 8 ÷ 2 = 4');

await calculator.divideEightByTwo();
await calculator.verifyResult('4');

        // Perform division using the reusable page class

        // Read the displayed result
        const divisionResult = await calculator.getResult();
        console.log('Actual division result:', divisionResult);

        // Verify the result
        await calculator.verifyResult('4');

        await calculator.closeCalculator();
        console.log('Calculator app closed successfully');

    } finally {
        await driver.deleteSession();
        console.log('Appium session closed');
    }
}

main().catch(console.error);
