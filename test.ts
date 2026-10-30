
import { remote } from 'webdriverio';

async function main() {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Samsung',
      'appium:udid': 'RZCXB155WGT',
      'appium:noReset': true,
      'appium:appPackage': 'com.sec.android.app.popupcalculator',
      'appium:appActivity':
        'com.sec.android.app.popupcalculator.Calculator',
    },
  });

  try {
    const nine = await driver.$(
      'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_09'
    );

    const multiply = await driver.$(
      'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_mul'
    );

    const equals = await driver.$(
      'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_equal'
    );

    console.log('Entering 9 × 9 =');

    await nine.click();
    await multiply.click();
    await nine.click();
    await equals.click();

    await driver.pause(1000);
const resultElement = await driver.$(
  'id=com.sec.android.app.popupcalculator:id/calc_edt_formula'
);

const actualResult = await resultElement.getText();

console.log('Actual result:', actualResult);

if (actualResult.includes('81')) {
  console.log('PASS: 9 × 9 = 81');
  await driver.execute('mobile: terminateApp', {
    appId: 'com.sec.android.app.popupcalculator'
});

console.log('Calculator app closed successfully');
} else {
  throw new Error(`FAIL: Expected 81 but got ${actualResult}`);
}

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.deleteSession();
    console.log('Appium session closed');
  }
}

main().catch(console.error);
