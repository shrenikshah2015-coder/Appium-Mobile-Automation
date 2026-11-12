
#!/usr/bin/env bash

echo "Running Appium Mocha tests"

npm run test:report
TEST_EXIT_CODE=$?

if [ "$TEST_EXIT_CODE" -ne 0 ]; then
  echo "=========================================="
  echo "APPIUM TEST FAILURE - COLLECTING DIAGNOSTICS"
  echo "=========================================="

  echo "Capturing Android Logcat"
  adb logcat -d -t 1000 > android-logcat.txt || true

  echo "Capturing Android activity information"
  adb shell dumpsys activity activities > android-activities.txt || true

  echo "Capturing Appium server log"
  tail -n 200 appium.log || true

  echo "Diagnostic collection completed"

  exit "$TEST_EXIT_CODE"
fi

echo "Appium tests completed successfully"
