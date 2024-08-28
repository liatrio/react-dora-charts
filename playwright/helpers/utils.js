import * as path from 'path';
import * as constants from './constants';

/**
 * Converts a test name to a filename-safe format.
 *
 * This function takes a test name as input and returns a filename-safe version of the test name.
 * The test name is converted to lowercase and any characters that are not alphanumeric or hyphens are replaced with hyphens.
 * Two or more consecutive hyphens are then replaced with a single hyphen.
 * Leading and trailing hyphens are then removed.
 *
 * @param {string} testName - The test name to convert.
 * @return {string} The filename-safe version of the test name.
 */
export function convertTestTitleToFileName(testInfo) {
  const testName = testInfo.titlePath.join(' > ');
  const fileName = testName
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '')
    .toLowerCase();
  return fileName;
}

/**
 * Saves a fullpage screenshot of the given page with the provided test name and suffix (if provided).
 *
 * @param {string} testName - The name of the test.
 * @param {Page} page - The page to save a screenshot of.
 * @param {string} [suffix=''] - An optional suffix to append to the test name.
 * @return {Promise<void>} - A promise that resolves when the screenshot is saved.
 */
export async function savePageScreenshot(testInfo, page, suffix = '') {
  let fileName = convertTestTitleToFileName(testInfo);
  if (suffix) {
    fileName += `-${suffix}`;
  }
  const screenshotPath = path.resolve(constants.TEMP_DIR, `${fileName}.png`);
  await page.waitForTimeout(1000); // 1 second wait for page to settle
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.debug(`Screenshot saved as: ${screenshotPath}`);
}

/**
 * Waits for the Storybook root div to load on the page.
 *
 * @param {Page} page - The Playwright Page object.
 * @return {Promise<Locator>} A Promise that resolves to a Locator object for the Storybook root div.
 * @throws {Error} If an error occurs while waiting for the Storybook root div to load.
 */
export async function waitForStorybookRootToLoad(page) {
  try {
    const storybookRootDiv = await page
      .frameLocator('#storybook-preview-iframe')
      .locator('#storybook-root');
    await storybookRootDiv.waitFor({ state: 'visible' });
    return storybookRootDiv;
  } catch (error) {
    console.error('Error waiting for Storybook root to load:', error);
    throw error;
  }
}
