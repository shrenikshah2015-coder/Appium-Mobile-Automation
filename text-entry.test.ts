
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
    },
  });

  try {
    await driver.execute('mobile: startActivity', {
      intent: 'com.android.settings/.Settings',
    });

    await driver.pause(2000);

    // Print the current screen hierarchy
    const source = await driver.getPageSource();
    console.log('SCREEN HIERARCHY:\n', source);

    // Find elements using the actual resource IDs in the hierarchy
    const elements = await driver.$$('//*[
      contains(@resource-id, "search")
      or contains(@class, "EditText")
    ]');

    console.log('Search-related elements:', elements.length);

    for (const element of elements) {
      console.log({
        resourceId: await element.getAttribute('resource-id'),
        className: await element.getAttribute('class'),
        text: await element.getText(),
        displayed: await element.isDisplayed(),
      });
    }
  } finally {
    await driver.deleteSession();
  }
}

main().catch((error) => {
  console.error('Test failed:', error);
  process.exitCode = 1;
});
