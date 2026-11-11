import dotenv from 'dotenv';

// Load the selected environment file
const envFile = process.env.ENV_FILE || '.env';

dotenv.config({ path: envFile });

// Export device configuration
export const config = {
    platformName: process.env.PLATFORM_NAME || 'Android',
    deviceName: process.env.DEVICE_NAME || 'Samsung',
    udid: process.env.ANDROID_UDID || '',
    calculatorPackage: process.env.CALCULATOR_PACKAGE || '',
    calculatorActivity: process.env.CALCULATOR_ACTIVITY || ''
};

console.log('Current Device Configuration:', config);