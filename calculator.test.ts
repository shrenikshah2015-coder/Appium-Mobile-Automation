
import { remote } from 'webdriverio';
import assert from 'node:assert/strict';

async function main() {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Samsung',
      'appium:udid': 'RZCXB155WGT',
      'appium:appPackage': 'com.sec.android.app.popupcalculator',
      'appium:appActivity': '.Calculator',
      'appium:noReset': true,
    },
  });

  try {
    console.log('Calculator launched');

    // Tap 3
    await driver.$(
      'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_03'
    ).click();

    // Tap +
    await driver.$(
      'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_add'
    ).click();

    // Tap 5
    await driver.$(
      'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_05'
    ).click();

    // Tap =
    await driver.$(
      'id=com.sec.android.app.popupcalculator:id/calc_keypad_btn_equal'
    ).click();

    await driver.pause(500);

    // Read the result displayed by Calculator
    const resultElement = await driver.$('android.widget.EditText');
    const actualText = (await resultElement.getText()).trim();

    console.log(`Displayed result: ${actualText}`);

    // Extract the number from text such as "8 Calculation result"
    const match = actualText.match(/^-?\d+(?:\.\d+)?/);

    assert.ok(match, `Could not extract a number from "${actualText}"`);

    const actualResult = Number(match[0]);
    const expectedResult = 8;

    // Assertion: actual result must equal expected result
    assert.equal(
      actualResult,
      expectedResult,
      'Calculator result is incorrect'
    );

    console.log('PASS: 3 + 5 = 8');
  } finally {
    await driver.deleteSession();
  }
}

main().catch((error) => {
  console.error('TEST FAILED:', error.message);
  process.exitCode = 1;
});
