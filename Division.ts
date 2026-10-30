
import { remote } from 'webdriverio';

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

    try {
        // Identify Calculator buttons
        const number8 = await driver.$(
            'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_08'
        );

        const divide = await driver.$(
            'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_div'
        );

        const number2 = await driver.$(
            'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_02'
        );

        const equals = await driver.$(
            'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_equal'
        );

        // Perform 8 ÷ 2
        console.log('Entering 8 ÷ 2 =');

        await number8.click();
        await divide.click();
        await number2.click();
        await equals.click();

        // Read the result
        const resultElement = await driver.$(
            'id=com.sec.android.app.popupcalculator:id/calc_edt_formula'
        );

        const actualResult = await resultElement.getText();

        console.log('Actual result:', actualResult);

        // Validate the result
        if (actualResult.includes('4')) {
            console.log('PASS: 8 ÷ 2 = 4');
        } else {
            throw new Error(
                `FAIL: Expected 4 but got ${actualResult}`
            );
        }

        // Close Calculator
        await driver.execute('mobile: terminateApp', {
            appId: 'com.sec.android.app.popupcalculator'
        });

        console.log('Calculator app closed successfully');

    } finally {
        await driver.deleteSession();
        console.log('Appium session closed');
    }
}

main().catch(console.error);
