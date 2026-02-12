const fs = require('fs');
const path = require('path');

/**
 * CI Control Test
 *
 * This test checks a control file to determine if CI should pass or fail.
 * This allows you to control CI behavior by simply changing the .ci-control file.
 *
 * To make CI PASS: Set .ci-control content to "pass"
 * To make CI FAIL: Set .ci-control content to "fail"
 */
describe('CI Control', () => {
  test('should respect CI control file', () => {
    const controlFilePath = path.join(__dirname, '..', '.ci-control');

    // If control file doesn't exist, assume pass
    if (!fs.existsSync(controlFilePath)) {
      console.log('ℹ No .ci-control file found - CI will PASS by default');
      expect(true).toBe(true);
      return;
    }

    const controlContent = fs.readFileSync(controlFilePath, 'utf8').trim().toLowerCase();

    console.log(`ℹ CI Control file content: "${controlContent}"`);

    if (controlContent === 'fail') {
      console.log('❌ CI Control set to FAIL - This test will fail intentionally');
      expect(true).toBe(false); // This will fail the test
    } else if (controlContent === 'pass') {
      console.log('✅ CI Control set to PASS - This test will pass');
      expect(true).toBe(true);
    } else {
      console.log(`⚠ Unknown CI control value: "${controlContent}" - defaulting to PASS`);
      expect(true).toBe(true);
    }
  });
});
